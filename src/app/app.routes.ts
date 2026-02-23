import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NewBoxComponent } from './components/new-box/new-box.component';
import { PackingComponent } from './components/packing/packing.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrationComponent },
    { path: 'dashboard', component: DashboardComponent},
    { path: 'newbox', component: NewBoxComponent},
    { path: 'packing', component: PackingComponent},
];
