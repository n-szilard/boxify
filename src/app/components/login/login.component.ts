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
    secret: '',
    reg: new Date(),
    status: false
  }

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    let data = {
      email: this.user.email,
      password: this.user.password
    }
    this.api.login('users', data).subscribe({
      next: (res) => {
        if (this.rememberMe) {
          this.auth.storeUser(res as any);
        }
        this.auth.login(res as any);
        alert('Sikeres belépés');
        this.router.navigateByUrl('/home');
      },
      error: (err) => {
        console.error(err);
        alert(err.error.error);
      }
    });
  }
}
