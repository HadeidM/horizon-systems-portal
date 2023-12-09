import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ColorService } from '../color.service';
import { LogoService } from '../logo.service';

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
  constructor(private router: Router, private logoServ:LogoService, private authServ:AuthService, private colorServ:ColorService, private http: HttpClient) {
    
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
            this.colorServ.getColor1(this.authServ.getEmail());
            this.colorServ.getColor2(this.authServ.getEmail());
            this.logoServ.getLogo(this.authServ.getEmail());
            this.router.navigate(['/home']);
            this.verifySuccess = true;
          }
        }, error: (err) => {
          console.log(err)
          this.mfaWrong = true;
        }
      });
  }
  reqMfa() {
    this.authServ.sendMFAMessage(this.authServ.getUser());
    this.mfaWrong = false;
    this.router.navigate(['/mfa']);
  }

}


type Resp = {
  StatusCode: number;
  Message: string;
}