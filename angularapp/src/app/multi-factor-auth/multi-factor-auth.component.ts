import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-multi-factor-auth',
  templateUrl: './multi-factor-auth.component.html',
})
export class MultiFactorAuthComponent {
  // initialize variables for MFA verification
  mfaCode = 1234;
  usrCode : string = '';
  verifySuccess : boolean = false;
  mfaWrong : boolean = false;
  private verifyMfaUrl = 'https://localhost:7235/api/User/verify_mfa/';

  // configure HTTP headers
  private config = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': "*",
      'accept': '*/*'
    })
  };
  constructor(private router: Router, private authServ:AuthService, private http: HttpClient) {
    
  }
  // navigate to the home page after MFA verification
  async navHome () {
    let userbtoa: string = window.btoa(this.authServ.getUser());
    let data = {
      "username": userbtoa,
      "MFAToken": this.usrCode
    }
    this.http.post<Resp>(this.verifyMfaUrl, JSON.stringify(data), this.config)
     .subscribe({
        next: (res) => {
          console.log(res)
          // check if MFA verification is successful
          if (res.StatusCode == 200) {
            this.authServ.toggleLoggedIn();
            this.router.navigate(['/home']);
            this.verifySuccess = true;
          }
        }, error: (err) => {
          console.log(err)
          this.mfaWrong = true;
        }
      });
  }
}

type Resp = {
  StatusCode: number;
  Message: string;
}