import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private username: string = '';

  constructor() { }

  login(username: string) {
    this.isLoggedIn = true;
    this.username = username;
  }

  logout() {
    this.isLoggedIn = false;
    this.username = '';
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  getUser() {
    return this.username;
  }
}
