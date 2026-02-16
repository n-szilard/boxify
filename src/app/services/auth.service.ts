import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private api: ApiService) { }

  private tokenName = environment.tokenName;
  private userDataname = 'boxifyData'

  private isLoggedIn = new BehaviorSubject<boolean>(this.getToken());
  isLoggedIn$ = this.isLoggedIn.asObservable();

  loggedUserData: User = {
    id: '',
    name: '',
    email: '',
    role: '',
    status: false
  }

  getToken() {
    const sess = sessionStorage.getItem(this.tokenName);
    if (sess) return true;

    const locs = localStorage.getItem(this.tokenName);
    if (locs) {
      sessionStorage.setItem(this.tokenName, locs);
      return true;
    }

    return false;
  }

  login(token: string, userData: User) {
    sessionStorage.setItem(this.tokenName, token);
    sessionStorage.setItem(this.userDataname, JSON.stringify(userData))
    this.loggedUserData = userData;
    this.isLoggedIn.next(true);
  }

  logout() {
    sessionStorage.removeItem(this.tokenName);
    localStorage.removeItem(this.tokenName);
    sessionStorage.removeItem(this.userDataname);
    localStorage.removeItem(this.userDataname);
    this.isLoggedIn.next(false);
  }

  loggedUser() {
    const userData = sessionStorage.getItem(this.userDataname);
    if (userData) {
      return JSON.parse(userData) as User;
    }
    return null;
  }

  storeUser(token: string, userData: User) {
    localStorage.setItem(this.tokenName, token);
    localStorage.setItem(this.userDataname, JSON.stringify(userData));
  }

  isLoggedUser(): boolean {
    return this.isLoggedIn.value;
  }

  isAdmin(): boolean {
    const user: any = this.loggedUser();
    return user && user.role === 'admin';
  }
}
