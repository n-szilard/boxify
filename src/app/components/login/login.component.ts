import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { User } from '../../interfaces/user';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FloatLabelModule, InputTextModule, FormsModule, ButtonModule, PasswordModule, CheckboxModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  rememberMe: boolean = false;
  user:User = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: '',
    reg: new Date(),
    status: false
  }

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private message: MessageService
  ) {}

  login() {
    let data = {
      email: this.user.email,
      password: this.user.password
    }
    this.api.login('users', data).subscribe({
      next: (res) => {
        const userData: User = {
          id: res.id,
          name: res.name,
          email: res.email,
          role: res.role,
          status: res.status
        };

        const token = res.token;

        if (this.rememberMe) {
          this.auth.storeUser(token, userData);
        }
        this.auth.login(token, userData);
        this.message.add({
          severity: 'success',
          summary: 'Info',
          detail: 'Sikeres belépés',
          life: 3000
        });
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.message.add({
          severity: 'error',
          summary: 'Hiba',
          detail: err.error.error,
          life: 5000
        })
      }
    });
  }
}
