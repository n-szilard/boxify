import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) { }

  items: MenuItem[] | undefined;
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      setTimeout(() => {
        this.setupMenu();
      }, 100);
    });

    if (this.isLoggedIn) {
      this.router.navigateByUrl('/home')
    }
  }


  setupMenu() {
    this.items = [
      // always visible
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: '/'
      },
      // isLoggedIn true
      ...this.isLoggedIn ? [
        {
          label: 'Dashboard',
          icon: 'pi pi-th-large',
          routerLink: '/dashboard'
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => {
            this.auth.logout();
            this.router.navigateByUrl('/login');
          }
        }
        // isLoggedIn false
      ] : [
        {
          label: 'Login',
          icon: 'pi pi-user',
          routerLink: '/login'
        },
        {
          label: 'Register',
          icon: 'pi pi-user-plus',
          routerLink: '/register'
        },
      ],
    ]
  }
}
