import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../services/api.service';
import { Box } from '../../interfaces/box';
import { Item } from '../../interfaces/item';
import { BoxItem, FillData } from '../../interfaces/boxItem';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-packing',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, InputTextModule, DropdownModule,
    ProgressBarModule, InputNumberModule, ToastModule
  ],
  templateUrl: './packing.component.html',
  styleUrls: ['./packing.component.scss']
})
export class PackingComponent implements OnInit {

  boxes: Box[] = [];
  allItems: Item[] = [];
  boxItems: BoxItem[] = [];
  fillMap = new Map<string, FillData>();

  selectedBox: Box | null = null;
  selectedItem: Item | null = null;
  addQuantity = 1;
  itemSearch = '';
  loading = false;

  constructor(private api: ApiService, private msg: MessageService, private auth: AuthService) {}

    ngOnInit(): void {
    this.api.selectByField('boxes', 'userId', 'eq', this.auth.loggedUser()!.id).subscribe({
      next: (data: any) => {
        this.boxes = data as Box[];
        this.boxes.forEach(b => this.loadFill(b.id!));
      }
    });

    this.api.selectByField('items', 'userId', 'eq', this.auth.loggedUser()!.id).subscribe({
      next: (data: any) => this.allItems = data as Item[]
    });
  }

  private loadFill(boxId: string): void {
    this.api.selectById('boxitems', `${boxId}/fill`).subscribe({
      next: (data: any) => this.fillMap.set(boxId, data as FillData)
    });
  }

  private loadBoxItems(): void {
    if (!this.selectedBox) return;
    this.loading = true;
    this.api.selectById('boxitems', this.selectedBox.id!).subscribe({
      next: (data: any) => { this.boxItems = data as BoxItem[]; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onBoxChange(): void {
    this.selectedItem = null;
    this.boxItems = [];
    this.loadBoxItems();
    if (this.selectedBox) this.loadFill(this.selectedBox.id!);
  }

  selectItem(item: Item): void {
    this.selectedItem = this.selectedItem?.id === item.id ? null : item;
    this.addQuantity = 1;
  }

  get filteredItems(): Item[] {
    const q = this.itemSearch.toLowerCase();
    return this.allItems.filter(i =>
      i.name.toLowerCase().includes(q) ||
      (i.description ?? '').toLowerCase().includes(q) ||
      (i.category ?? '').toLowerCase().includes(q)
    );
  }

  isInBox(item: Item): boolean {
    return this.boxItems.some((bi: BoxItem) => bi.itemId === item.id);
  }

  // Ellenőrzi hogy az új tárgy + mennyiség belefér-e a dobozba
  get canAdd(): boolean {
    if (!this.selectedBox || !this.selectedItem || !this.fill) return !!this.selectedBox && !!this.selectedItem;
    const item = this.selectedItem;
    const qty = this.addQuantity;

    const newWeight = (this.fill.usedWeightKg ?? 0) + (item.weightKg ?? 0) * qty;
    const newVolume = (this.fill.usedVolumeCm3 ?? 0) +
      (item.heightCm ?? 0) * (item.widthCm ?? 0) * (item.lengthCm ?? 0) * qty;

    const overWeight = this.selectedBox.maxWeightKg > 0 && newWeight > this.selectedBox.maxWeightKg;
    const overVolume = this.fill.boxVolumeCm3 > 0 && newVolume > this.fill.boxVolumeCm3;

    return !overWeight && !overVolume;
  }

  get addBlockReason(): string {
    if (!this.selectedBox || !this.selectedItem || !this.fill) return '';
    const item = this.selectedItem;
    const qty = this.addQuantity;

    const newWeight = (this.fill.usedWeightKg ?? 0) + (item.weightKg ?? 0) * qty;
    const newVolume = (this.fill.usedVolumeCm3 ?? 0) +
      (item.heightCm ?? 0) * (item.widthCm ?? 0) * (item.lengthCm ?? 0) * qty;

    if (this.selectedBox.maxWeightKg > 0 && newWeight > this.selectedBox.maxWeightKg)
      return `Túl nehéz! (+${((item.weightKg ?? 0) * qty).toFixed(1)} kg, max ${this.selectedBox.maxWeightKg} kg)`;
    if (this.fill.boxVolumeCm3 > 0 && newVolume > this.fill.boxVolumeCm3)
      return 'Nem fér bele! A doboz megtelt.';
    return '';
  }

  addItemToBox(): void {
    if (!this.selectedBox || !this.selectedItem) return;

    if (!this.canAdd) {
      this.toast('warn', 'Nem fér bele', this.addBlockReason);
      return;
    }

    this.api.insert('boxitems', {
      boxId: this.selectedBox.id,
      itemId: this.selectedItem.id,
      quantity: this.addQuantity
    }).subscribe({
      next: () => {
        this.toast('success', 'Hozzáadva', `${this.selectedItem!.name} elhelyezve`);
        this.selectedItem = null;
        this.addQuantity = 1;
        this.loadBoxItems();
        this.loadFill(this.selectedBox!.id!);
      },
      error: (e: any) => this.toast('error', 'Hiba', e.error?.error ?? 'Sikertelen')
    });
  }

  updateQuantity(bi: BoxItem, qty: number): void {
    if (!qty || qty < 1) return;
    if (!this.selectedBox || !this.fill) return;

    // Ellenőrzés: új qty mellett belefér-e
    const diff = qty - bi.quantity;
    const newWeight = (this.fill.usedWeightKg ?? 0) + (bi.item.weightKg ?? 0) * diff;
    const newVolume = (this.fill.usedVolumeCm3 ?? 0) +
      (bi.item.heightCm ?? 0) * (bi.item.widthCm ?? 0) * (bi.item.lengthCm ?? 0) * diff;

    if (this.selectedBox.maxWeightKg > 0 && newWeight > this.selectedBox.maxWeightKg) {
      this.toast('warn', 'Túl nehéz!', `Max súly: ${this.selectedBox.maxWeightKg} kg`);
      return;
    }
    if (this.fill.boxVolumeCm3 > 0 && newVolume > this.fill.boxVolumeCm3) {
      this.toast('warn', 'Nem fér bele!', 'A doboz megtelt.');
      return;
    }

    this.api.update('boxitems', bi.id, { quantity: qty }).subscribe({
      next: () => { bi.quantity = qty; this.loadFill(this.selectedBox!.id!); }
    });
  }

  removeItem(bi: BoxItem): void {
    this.api.delete('boxitems', bi.id).subscribe({
      next: () => {
        this.toast('success', 'Eltávolítva', bi.item.name);
        this.loadBoxItems();
        this.loadFill(this.selectedBox!.id!);
      }
    });
  }

  // --- Getterek ---
  get fill(): FillData | null {
    return this.selectedBox ? (this.fillMap.get(this.selectedBox.id!) ?? null) : null;
  }
  get weightPct(): number { return Math.min(this.fill?.weightPercent ?? 0, 100); }
  get volumePct(): number { return Math.min(this.fill?.volumePercent ?? 0, 100); }

  getFill(box: Box): FillData | null { return this.fillMap.get(box.id!) ?? null; }
  getWPct(box: Box): number { return Math.min(this.getFill(box)?.weightPercent ?? 0, 100); }
  getVPct(box: Box): number { return Math.min(this.getFill(box)?.volumePercent ?? 0, 100); }

  barClass(pct: number): string {
    if (pct >= 100) return 'bar-danger';
    if (pct > 80)   return 'bar-warn';
    return 'bar-ok';
  }

  boxSizeStr(box: Box): string {
    return `${box.heightCm}×${box.widthCm}×${box.lengthCm} cm`;
  }

  itemSizeStr(item: Item): string {
    return `${item.heightCm ?? '?'}×${item.widthCm ?? '?'}×${item.lengthCm ?? '?'} cm`;
  }

  private toast(severity: string, summary: string, detail: string): void {
    this.msg.add({ severity, summary, detail, life: 3000 });
  }
}