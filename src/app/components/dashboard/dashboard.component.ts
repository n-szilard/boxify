import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { NewBoxComponent } from '../new-box/new-box.component';
import { DialogModule } from 'primeng/dialog';
import { NewItemComponent } from '../new-item/new-item.component';
import { Box } from '../../interfaces/box';
import { ApiService } from '../../services/api.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Item } from '../../interfaces/item';
import { SelectModule } from 'primeng/select';
import { QRCodeModule } from 'angularx-qrcode';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    TableModule,
    ProgressBarModule,
    TimelineModule,
    ToastModule,
    NewBoxComponent,
    DialogModule,
    NewItemComponent,
    SelectModule,
    QRCodeModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  emptySelectedBox: Box = {
    id: '',
    labelType: 'QR',
    lengthCm: 0,
    widthCm: 0,
    heightCm: 0,
    maxWeightKg: 0,
    location: '',
    note: '',
    status: 'ACTIVE'
  };
  displayEmptyBoxConfirm = false;

  displayitem = false;

  averageFullness = 0;

  displayQRCode = false;
  QRData = '';

  open1() { this.displayitem = true; }
  close1() {
    this.getItems();
    this.displayitem = false;
  }
  displaybox = false;

  open() {
    this.displaybox = true;
  }

  close() {
    this.getBoxes();
    this.displaybox = false;
  }

  sidebarVisible: boolean = false;

  boxes: Box[] = [];

  items: Item[] = [];

  fakeActivities = [
    { action: 'Tárgy hozzáadva', detail: 'Téli ruhák → BOX-23014K', time: '15 perce' },
    { action: 'Doboz létrehozva', detail: 'BOX-23018R (120x80x60)', time: '2 órája' },
    { action: 'Doboz ürítve', detail: 'BOX-22987T', time: 'Tegnap' },
    { action: 'Telítettség figyelmeztetés', detail: 'BOX-23014K > 90%', time: 'Ma reggel' },
  ];

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private message: MessageService,
    private confirm: ConfirmationService
  ) { }

  ngOnInit(): void {
    console.log(this.auth.isAdmin())
    this.getBoxes();
    this.getItems();
  }

  getBoxes() {
    if (this.auth.loggedUser()) {
      this.api.selectByField('boxes', 'userId', 'eq', this.auth.loggedUser()!.id).subscribe({
        next: (res) => {
          this.boxes = res as any

          this.getBoxFullness()
        },
        error: (err) => {
          this.message.add({
            severity: 'error',
            summary: 'Hiba',
            detail: 'Hiba a dobozok betöltése során!'
          })
        }
      })
    }
  }

  getItems() {
    if (this.auth.loggedUser()) {
      this.api.selectByField('items', 'userId', 'eq', this.auth.loggedUser()!.id).subscribe({
        next: (res) => {
          this.items = res as any
        },
        error: (err) => {
          this.message.add({
            severity: 'error',
            summary: 'Hiba',
            detail: 'Hiba a tárgyak betöltése során!'
          })
        }
      })
    }
  }

  async getBoxFullness() {
    this.boxes.forEach(box => {
      this.api.getBoxFullness(box.id!).subscribe({
        next: (res) => {
          box.weightPercent = (res as any).weightPercent;
          this.averageFullness += (res as any).weightPercent || 0;
        },
        error: (err) => {
          this.message.add({
            severity: 'error',
            summary: 'Hiba',
            detail: 'Hiba a doboz telítettségének lekérdezése során!'
          })
        }
      });
    });
    this.averageFullness = this.boxes.length > 0 ? this.averageFullness / this.boxes.length : 0;
  }

  showQRCode(boxId: string) {
    if (boxId == '' || boxId == undefined) {
      this.message.add({ severity: 'error', summary: 'Hiba', detail: 'Nincs kiválasztott doboz!' });
      return;
    }

    this.QRData = boxId;
    this.displayQRCode = true;
  }

  confirmDelete(boxId: string, event: Event) {
    this.confirm.confirm({
      target: event.target as EventTarget,
      message: 'Biztosan törölni szeretnéd ezt a dobozt?',
      header: 'Veszély!',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Mégsem',
      rejectButtonProps: {
        label: 'Mégsem',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Törlés',
        severity: 'danger'
      },

      accept: () => {
        this.api.delete('boxes', boxId).subscribe({
          next: (res) => {
            this.message.add({ severity: 'info', summary: 'Sikeres törlés', detail: 'Doboz törölve.' });
            this.getBoxes();
          },
          error: (err) => {
            this.message.add({ severity: 'error', summary: 'Hiba a törlés közben', detail: err.error.error });
            this.getBoxes();
          }
        })
      },
      reject: () => {
      }
    });
  }

  confirmDeleteItem(itemId: string, event: Event) {
    this.confirm.confirm({
      target: event.target as EventTarget,
      message: 'Biztosan törölni szeretnéd ezt a tárgyat?',
      header: 'Veszély!',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Mégsem',
      rejectButtonProps: {
        label: 'Mégsem',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Törlés',
        severity: 'danger'
      },

      accept: () => {
        this.api.delete('items', itemId).subscribe({
          next: (res) => {
            this.message.add({ severity: 'info', summary: 'Sikeres törlés', detail: 'Tárgy törölve.' });
            this.getItems();
          },
          error: (err) => {
            this.message.add({ severity: 'error', summary: 'Hiba a törlés közben', detail: err.error.error });
            this.getItems();
          }
        })
      },
      reject: () => {
      }
    });
  }

  confirmEmptyBox() {
    this.displayEmptyBoxConfirm = true;
  }

  emptyBox() {
    if (this.emptySelectedBox.id == '' || this.emptySelectedBox.id == undefined) {
      this.message.add({ severity: 'error', summary: 'Hiba', detail: 'Nincs kiválasztott doboz!' });
      return;
    }

    this.api.emptyBox(this.emptySelectedBox.id).subscribe({
      next: (res) => {
        this.message.add({ severity: 'info', summary: 'Sikeres ürítés', detail: 'A doboz kiürítve.' });
        this.getBoxes();
      },
      error: (err) => {
        this.message.add({ severity: 'error', summary: 'Hiba a kiürítés közben', detail: err.error.error });
      }
    });

  }

}
