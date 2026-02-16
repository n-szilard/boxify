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

@Component({
  selector: 'app-new-box',
  standalone: true,
  imports: [DropdownModule, InputTextModule, InputNumberModule, FormsModule, CommonModule, SelectButton, ButtonModule, TextareaModule, FloatLabelModule],
  templateUrl: './new-box.component.html',
  styleUrl: './new-box.component.scss'
})
export class NewBoxComponent {
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

  onCancel() {

  }

  onSubmit() {

  }
}
