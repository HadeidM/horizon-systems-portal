import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  userEmail:string = '';
  invalidEmail:boolean = false;
  errorReset:boolean = false;
  emailSent:boolean = false;
  private authUrl = 'https://localhost:7235/api/User/send_reset_email/';

  constructor(private http: HttpClient, private router:Router) {}

  onSubmit() {
    console.log(this.userEmail)
    if (this.userEmail == '' || !this.userEmail.includes('@')) {
      this.invalidEmail = true;
      console.log('invalid email')
      return;
    } else {
      const config = {
        headers: new HttpHeaders({
          'accept': '*/*',
        })
      };
      this.http.post<ResetResp>(this.authUrl+this.userEmail,{}, config)
      .subscribe({
        next: (res) => {
          console.log(res)
          // this.router.navigate(['/home']) // navigate to home on successful login
          this.emailSent = true;
        }, error: (err) => {
          this.errorReset = true;
          console.log(err)
        }
      });
    }
  }
}

interface ResetResp {
    StatusCode: number,
    Message:string
}
