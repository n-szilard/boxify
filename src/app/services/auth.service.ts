import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private tokenName = environment.tokenName;

  private isLoggedIn = new BehaviorSubject<boolean>(this.getToken());
  isLoggedIn$ = this.isLoggedIn.asObservable();

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

  login(token: string) {
    sessionStorage.setItem(this.tokenName, token);
    this.isLoggedIn.next(true);
  }

  logout() {
    sessionStorage.removeItem(this.tokenName);
    localStorage.removeItem(this.tokenName);
    this.isLoggedIn.next(false);
  }

  loggedUser() {
    const token = sessionStorage.getItem(this.tokenName);
    if (token) {
      return JSON.parse(token);
    }
    return null;
  }

  storeUser(token: string) {
    localStorage.setItem(this.tokenName, token);
  }

  isLoggedUser(): boolean {
    return this.isLoggedIn.value;
  }

  isAdmin(): boolean {
    const user: any = this.loggedUser();
    return user && user.role === 'admin';
  }
}
