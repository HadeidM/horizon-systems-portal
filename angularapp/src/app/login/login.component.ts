import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
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
  private authUrl = 'http://localhost:5177/api/User/login';
  
  constructor(private router: Router, private nvComponent: NavbarComponent, private http: HttpClient) {
    this.multiFactorSet = true;
  }
  async onSubmit() {
    //console.log('Username: ' + this.username);
    //console.log('Password: ' + this.password);
    if (this.username !== undefined && this.username !== '' && this.password !== undefined && this.password !== '') {
      await this.login(this.username, this.password)
      //console.log(lr.message)
    }
  }

  login(username: string, password: string){
    let lr: LoginResp;
    const data = {  
      id: 0,
      firstName: "string",
      lastName: "string",
      address: "string",
      phone: "string",
      email: "string",
      username: username,
      password: password,
      role: "string" };
    const config = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    };
    this.http.post<LoginResp>(this.authUrl, JSON.stringify(data), config)
    .subscribe((res) => {
      console.log(res)
      this.navigateToLogin() // navigate to home on successful login
    }, (err) => {
      console.log(err)
    })
    
  }

  navigateToLogin() {
    this.router.navigate(['/home'])
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

