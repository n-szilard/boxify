import { Component, OnInit } from '@angular/core';
import { FloatLabelModule } from "primeng/floatlabel"
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { User } from '../../interfaces/user';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

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
    secret: '',
    reg: new Date(),
    status: true
  };

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {}

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
      alert('Töltsd ki az összes kötelező mezőt.');
      return;
    }

    if (data.password !== data.confirm) {
      alert('A jelszavak nem egyeznek');
      return;
    }

    this.api.registration('users', data).subscribe({
      next: (res) => {
        alert('Sikeres regisztráció');
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        alert(err.error.error);
        console.error('Registration failed:', err);
      }
    });
  }
}
