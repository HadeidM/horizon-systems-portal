import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private username: string = '';
  private email: string = '';
  private phone: string = '';
  private mfaoption: string = '';
  private mfaEnabled: boolean = true;
  private mfaEmailUrl = 'https://localhost:7235/api/User/send_otp/';
  private mfaPhoneUrl = 'https://localhost:7235/api/User/send_otp_phone/';
  private mfaUrl = 'https://localhost:7235/api/User/get_mfaOpt/';
  private phoneUrl = 'https://localhost:7235/api/User/get_phone/';
  private emailUrl = 'https://localhost:7235/api/User/get_email/';
  
  private config = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': "*",
      'accept': '*/*'
    })
  };
  constructor(private http: HttpClient ) { }
  async sendMFAMessage(username: string) {
    this.http.get<Resp>(this.mfaUrl + username, this.config)
      .subscribe({
        next: (res) => {
          console.log(res)
          this.mfaoption = res.Message;
          if (this.mfaoption == 'email') {
            this.sendMFAEmail(username);
          } else if (this.mfaoption == 'phone') {
            this.sendMFAtext(username);
          }
        }, error: (err) => {
          console.log(err)
        }
      });
  }
  async sendMFAtext(username: string) {
    this.http.get<Resp>(this.phoneUrl + username, this.config)
      .subscribe({
        next: (res) => {
          console.log(res)
          this.phone = res.Message;
          this.http.post(this.mfaPhoneUrl+ this.phone, this.config)
            .subscribe({
              next: (res) => {
                console.log("message with MFA code sent to phone successfully!!!")
              }, error: (err) => {
                console.log(err)
              }
            });
        }, error: (err) => {
          console.log(err)
        }
      });
  }
  toggleLoggedIn() {
    this.isLoggedIn = !this.isLoggedIn;
  }
  async sendMFAEmail(username: string) {
    this.http.get<Resp>(this.emailUrl + username, this.config)
      .subscribe({
        next: (res) => {
          console.log(res)
          this.email = res.Message;
          this.http.post(this.mfaEmailUrl + this.email, this.config)
            .subscribe({
              next: (res) => {
                console.log("MFA code sent to email successfully!!!")
              }, error: (err) => {
                console.log(err)
              }
            });
        }, error: (err) => {
          console.log(err)
        }
      });
  }

  async login(username: string) {
    this.username = username;
    if (this.mfaEnabled) {
      this.sendMFAMessage(username);
    } else {
      this.isLoggedIn = true;
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.username = '';
  }
  getMFAStatus() {
    return this.mfaEnabled;
  }
  getIsLoggedIn() {
    return this.isLoggedIn;
  }
  getEmail(){
    return this.email;
  }
  getUser() {
    return this.username;
  }
  getMFAOption() {
    return this.mfaoption;
  }
  
}

type Resp = {
  "StatusCode": number,
  "Message": string,
}