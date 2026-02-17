import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { Item } from '../../interfaces/item';

@Component({
  selector: 'app-new-item',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, InputNumberModule, TextareaModule, DropdownModule, ButtonModule],
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent {
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  categories = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Books', value: 'books' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Other', value: 'other' }
  ];

  onCancel() {
    // emit event / close dialog from wrapper — left blank intentionally
  }

  onSubmit() {
    // TODO: validate + send to backend
    this.model.updatedAt = new Date().toISOString();
    console.log('submit item', this.model);
  }
}