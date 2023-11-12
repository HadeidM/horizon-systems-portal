import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Component({
  selector: 'app-login',
  
  templateUrl: './login.component.html',

})
export class LoginComponent {
  username: string | undefined;
  correctPass = 'pass';
  correctUser = 'correct';
  password: string | undefined;
  multiFactorSet: boolean | undefined;
  loginResp?: LoginResp;
  private authUrl = 'https://localhost:7235/api/User/login';
  fb = inject(FormBuilder);
  loginForm !: FormGroup;
  errorLogin: boolean = false;
  @Output() userLoggedIn: EventEmitter<any> = new EventEmitter<any>();

  
  constructor(private router: Router, private nvComponent: NavbarComponent, private http: HttpClient) {
    this.multiFactorSet = true;
    this.loginForm = this.fb.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.required]
    });
  }


  login(){
    let lr: LoginResp;
    const data = {  
      id: 0,
      firstName: "string",
      lastName: "string",
      address: "string",
      phone: "string",
      email: "string",
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
      role: "string",
      "token": "string",
      "resetPasswordToken": "string",
      "resetPasswordExpiry": "2023-11-12T20:14:09.880Z" };
    const config = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    };
    this.http.post<LoginResp>(this.authUrl, JSON.stringify(data), config)
      .subscribe({
        next: (res) => {
          console.log(res)
          localStorage.setItem('logStr', `Welcome ${this.loginForm.value.username}!`)
          this.userLoggedIn.emit({ username: this.loginForm.value.username })
          this.router.navigate(['/home']) // navigate to home on successful login
        }, error: (err) => {
          this.errorLogin = true;
          console.log(err)
        }
      });
    
  }

  getUsername() {
    return this.userLoggedIn;
  }
  navigateToSSOPage() {
    if (this.multiFactorSet) {
      this.router.navigate(['/mfa']);
    }
    else {
      console.log("Multifactor not set yet!");
    }
    
  }
}


interface LoginResp {
  message: string;
}

