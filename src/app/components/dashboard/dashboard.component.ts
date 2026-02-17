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
import { NewItemComponent } from '../new-item/new-item.component';
import { Box } from '../../interfaces/box';
import { ApiService } from '../../services/api.service';
import { MessageService, ConfirmationService } from 'primeng/api';


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
    DialogModule,
    NewItemComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  displayitem = false;

  open1() { this.displayitem = true; }
  close1() { this.displayitem = false; }
  displaybox = false;

  open() {
    this.displaybox = true;
  }

  close() {
    this.displaybox = false;
  }

  sidebarVisible: boolean = false;

  boxes: Box[] = [];

  fakeActivities = [
    { action: 'Tárgy hozzáadva', detail: 'Téli ruhák → BOX-23014K', time: '15 perce' },
    { action: 'Doboz létrehozva', detail: 'BOX-23018R (120x80x60)', time: '2 órája' },
    { action: 'Doboz ürítve', detail: 'BOX-22987T', time: 'Tegnap' },
    { action: 'Telítettség figyelmeztetés', detail: 'BOX-23014K > 90%', time: 'Ma reggel' },
  ];

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private message: MessageService,
    private confirm: ConfirmationService
  ) { }

  ngOnInit(): void {
    console.log(this.auth.isAdmin())
    this.getBoxes()
  }

  getBoxes() {
    if (this.auth.loggedUser()) {
      this.api.selectByField('boxes', 'userId', 'eq', this.auth.loggedUser()!.id).subscribe({
        next: (res) => {
          this.boxes = res as any
        },
        error: (err) => {
          this.message.add({
            severity: 'error',
            summary: 'Hiba',
            detail: 'Hiba a dobozok betöltése során!'
          })
        }
      })
    }
  }

  confirmDelete(boxId: string, event: Event) {
    this.confirm.confirm({
      target: event.target as EventTarget,
      message: 'Biztosan törölni szeretnéd ezt a dobozt?',
      header: 'Veszély!',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Mégsem',
      rejectButtonProps: {
        label: 'Mégsem',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Törlés',
        severity: 'danger'
      },

      accept: () => {
        this.api.delete('boxes', boxId).subscribe({
          next: (res) => {
            this.message.add({ severity: 'info', summary: 'Sikeres törlés', detail: 'Doboz törölve.' });
            this.getBoxes();
          },
          error: (err) => {
            this.message.add({ severity: 'error', summary: 'Hiba a törlés közben', detail: err.error.error });
            this.getBoxes();
          }
        })
      },
      reject: () => {
      }
    });
  }
}
