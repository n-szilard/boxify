import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private server = environment.serverUrl;
  private tokenName = environment.tokenName;

  constructor(
    private http: HttpClient
  ) { }

  tokenHeader(): { headers: HttpHeaders } {
    let token = this.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return { headers };
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenName) || sessionStorage.getItem(this.tokenName);
  }

  // public endpoints

  registration(table: string, data: object) {
    return this.http.post(`${this.server}/${table}/registration`, data);
  }

  login(table: string, data: object): Observable<User & { token: string }> {
    return this.http.post<User & { token: string }>(`${this.server}/${table}/login`, data);
  }

  //lostpass() { }

  //restorepass() { }

  readById(table: string, id: string) {
    return this.http.get(`${this.server}/public/${table}/${id}`);
  }

  readByField(table: string, field: string, op: string, value: string) {
    return this.http.get(`${this.server}/public/${table}/${field}/${op}/${value}`);
  }

  readAll(table: string) {
    return this.http.get(`${this.server}/public/${table}`);
  }

  sendMail(data: object) {
    return this.http.post(`${this.server}/sendmail`, data);
  }

  // private endpoints

  selectById(table: string, id: string) {
    return this.http.get(`${this.server}/${table}/${id}`, this.tokenHeader());
  }

  selectByField(table: string, field: string, op: string, value: string) {
    return this.http.get(`${this.server}/${table}/${field}/${op}/${value}`, this.tokenHeader());
  }

  selectAll(table: string) {
    return this.http.get(`${this.server}/${table}`, this.tokenHeader());
  }

  insert(table: string, data: object) {
    return this.http.post(`${this.server}/${table}`, data, this.tokenHeader());
  }

  update(table: string, id: string, data: object) {
    return this.http.patch(`${this.server}/${table}/${id}`, data, this.tokenHeader());
  }

  delete(table: string, id: string) {
    return this.http.delete(`${this.server}/${table}/${id}`, this.tokenHeader());
  }

  deleteAll(table: string) {
    return this.http.delete(`${this.server}/${table}`, this.tokenHeader());
  }

  emptyBox(boxId: string) {
    return this.http.delete(`${this.server}/boxitems/empty/${boxId}`, this.tokenHeader());
  }

  // /api/boxitems/:boxId/fill
  getBoxFullness(boxId: string) {
    return this.http.get(`${this.server}/boxitems/${boxId}/fill`, this.tokenHeader());
  }

  uploadFile() { }

  downloadFile() { }

  deleteFile() { }

  getBreakDays(year: number) {
    return this.http.get(`${this.server}/breakdays/szunetek/${year}`);
  }

  getNameDays(year: number) {
    return this.http.get(`${this.server}/breakdays/nevnapok/${year}`)
  }
}
