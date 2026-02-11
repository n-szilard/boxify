import { Component, OnInit } from '@angular/core';
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { User } from '../../interfaces/user';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [FloatLabelModule, InputTextModule, FormsModule, ButtonModule, PasswordModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegistrationComponent implements OnInit {
  user: User = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: '',
    reg: new Date(),
    status: true
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private message: MessageService
  ) { }

  ngOnInit(): void { }

  save() {
    // name, email, password, confirm, phone, address
    let data = {
      name: this.user.name,
      email: this.user.email,
      password: this.user.password,
      confirm: this.user.confirm,
      phone: '',
      address: ''
    };

    if (!data.name || !data.email || !data.password || !data.confirm) {
      this.message.add({
        severity: 'warn',
        summary: 'Hiba',
        detail: 'Kérem, tölsön ki minden kötelező mezőt.',
        life: 5000
      })
      return;
    }

    if (!this.validateEmail(data.email)) {
      this.message.add({
        severity: 'warn',
        summary: 'Hiba',
        detail: 'Adjon meg egy megfelelő formátumú email címet!',
        life: 5000
      })
      return;
    }

    if (data.password !== data.confirm) {
      this.message.add({
        severity: 'warn',
        summary: 'Hiba',
        detail: 'A jelszavak nem egyeznek!',
        life: 5000
      })
      return;
    }

    this.api.registration('users', data).subscribe({
      next: (res) => {
        this.message.add({
          severity: 'success',
          summary: 'Info',
          detail: 'Sikeres regisztráció',
          life: 3000
        });
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.message.add({
          severity: 'error',
          summary: 'Hiba',
          detail: 'Hiba a regisztráció során, próbálja újra később.',
          life: 5000
        })
        console.error('Registration failed:', err);
      }
    });
  }

  validateEmail(email: string) {
    let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return re.test(email);
  }
}

