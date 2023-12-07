import { Component, EventEmitter, Output, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../auth.service';


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

  // create the login form
  fb = inject(FormBuilder);
  loginForm !: FormGroup;
  errorLogin: boolean = false;
  // create user login events
  @Output() userLoggedIn: EventEmitter<any> = new EventEmitter<any>();

  // initialize the form
  constructor(private router: Router, private nvComponent: NavbarComponent, private http: HttpClient, private authServ:AuthService) {
    this.multiFactorSet = true;
    this.loginForm = this.fb.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.required]
    });
  }

  // login function
  login(){
    let lr: LoginResp;
    // login data
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
      "resetPasswordExpiry": "2023-11-12T20:14:09.880Z" ,
      logourl: "",
    "mfaoption":"email",
    "primarycolor": "1",
    "secondarycolor": "1"}
    // configure HTTP headers
    const config = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    };
    // make a post request
    this.http.post<LoginResp>(this.authUrl, JSON.stringify(data), config)
      .subscribe({
        next: (res) => {
          // login successfully
          console.log(res)
          this.authServ.login(this.loginForm.value.username);
          let status = this.authServ.getMFAStatus();
          console.log("status: " +status)
          // redirect based on status
          if (status) {
            this.router.navigate(['/mfa'])
          }
          else {
            this.router.navigate(['/home'])
           } // navigate to home on successful login
        }, error: (err) => {
          this.errorLogin = true;
          console.log(err)
        }
      });
    
  }

  // get username of the logged in user
  getUsername() {
    return this.userLoggedIn;
  }

  // navigate to the SSO page
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

