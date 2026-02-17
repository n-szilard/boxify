import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Box } from '../../interfaces/box';
import { SelectButton } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-new-box',
  standalone: true,
  imports: [DropdownModule, InputTextModule, InputNumberModule, FormsModule, CommonModule, SelectButton, ButtonModule, TextareaModule, FloatLabelModule, DialogModule],
  templateUrl: './new-box.component.html',
  styleUrl: './new-box.component.scss'
})
export class NewBoxComponent {

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private message: MessageService
  ) {}

  model: Box = {
    userId: '',
    code: '',
    labelType: 'QR',
    lengthCm: 0,
    widthCm: 0,
    heightCm: 0,
    maxWeightKg: 0,
    location: '',
    note: '',
    status: 'ACTIVE',
  }

  onSubmit() {
    // TODO: adatok validálása
    if (this.auth.loggedUser()) {
      this.model.userId = this.auth.loggedUser()!.id;
      this.api.insert('boxes', this.model).subscribe({
        next: (res) => {
          this.message.add({
            severity: 'success',
            summary: 'Doboz létrehozva!',
            detail: `Új doboz ${(res as any).code} néven létrehozva!`
          })
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
