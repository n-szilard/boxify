import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { NewBoxComponent } from '../new-box/new-box.component';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    TableModule,
    ProgressBarModule,
    TimelineModule,
    ToastModule,
    NewBoxComponent,
    DialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  display = false;

  open() {
    this.display = true;
  }

  close() {
    this.display = false;
  }

  sidebarVisible: boolean = false;

fakeBoxes = [
  { id: 'BOX-23014K', dimensions: '80 x 50 x 45', maxKg: 35, fill: 88, location: 'Garázs / polc C2' },
  { id: 'BOX-23015M', dimensions: '60 x 40 x 35', maxKg: 20, fill: 62, location: 'Padlás' },
  { id: 'BOX-23016P', dimensions: '100 x 60 x 50', maxKg: 50, fill: 95, location: 'Szoba / szekrény' },
];

fakeActivities = [
  { action: 'Tárgy hozzáadva', detail: 'Téli ruhák → BOX-23014K', time: '15 perce' },
  { action: 'Doboz létrehozva', detail: 'BOX-23018R (120x80x60)', time: '2 órája' },
  { action: 'Doboz ürítve', detail: 'BOX-22987T', time: 'Tegnap' },
  { action: 'Telítettség figyelmeztetés', detail: 'BOX-23014K > 90%', time: 'Ma reggel' },
];

  constructor(
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    console.log(this.auth.isAdmin())
  }
}
