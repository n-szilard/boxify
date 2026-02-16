import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card'
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, ToolbarModule, CardModule, RouterLink, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  title: string = "Rendszerezd a dobozolást a Boxify segítségével";
  mainButtonText: string = "Kezdés";
  hideSignup: boolean = false;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    if (this.auth.isLoggedUser()) {
      this.title = `Üdv, ${this.auth.loggedUser()!.name}!`;
      this.mainButtonText = "Tovább a dashboard-ra";
      this.hideSignup = true;
    }
  }

  getStarted() {
    if (this.auth.isLoggedUser()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
