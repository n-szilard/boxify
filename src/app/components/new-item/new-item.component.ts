import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { Item } from '../../interfaces/item';
import { SelectModule } from 'primeng/select';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-new-item',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, InputNumberModule, TextareaModule, DropdownModule, ButtonModule, SelectModule],
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent {

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private message: MessageService
  ) { }

  model: Item = {
    userId: '',
    name: '',
    description: '',
    category: '',
    lengthCm: 0,
    widthCm: 0,
    heightCm: 0,
    weightKg: 0,
    imagePath: '',
  };

  onCancel() {
    // emit event / close dialog from wrapper — left blank intentionally
  }

  onSubmit() {
    if (!this.model.name?.trim() || !this.model.description?.trim() || !this.model.category?.trim() || (this.model.lengthCm ?? 0) <= 0 || (this.model.widthCm ?? 0) <= 0 || (this.model.heightCm ?? 0) <= 0 || (this.model.weightKg ?? 0) <= 0) {
      this.message.add({
        severity: 'error',
        summary: 'Hiba',
        detail: 'Kérjük, töltse ki az összes mezőt!'
      });
      return;
    }

    if (this.auth.loggedUser()) {
      this.model.userId = this.auth.loggedUser()!.id;
      this.api.insert('items', this.model).subscribe({
        next: (res) => {
          this.message.add({
            severity: 'success',
            summary: 'Tárgy létrehozva!',
            detail: `Új tárgy létrehozva!`
          })

          this.model = {
            userId: '',
            name: '',
            description: '',
            category: '',
            lengthCm: 0,
            widthCm: 0,
            heightCm: 0,
            weightKg: 0,
            imagePath: '',
          }
        },
        error: (err) => {
          this.message.add({
            severity: 'error',
            summary: 'Hiba',
            detail: err.error.error
          })
        }
      })
    }
  }
}