import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username: string | undefined;
  password: string | undefined;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;

  private authUrl = 'http://localhost:5177/api/User/register'; 

  constructor(private router: Router, private http: HttpClient) {}

  onRegister() {
    if (this.username && this.password && this.email && this.firstName && this.lastName) {
      this.register(this.username, this.password, this.email, this.firstName, this.lastName);
    }
  }

  register(username: string, password: string, email: string, firstName: string, lastName: string) {
    const data = {  
      id: 0,
      email: email,
      firstName: firstName,
      lastName: lastName,
      address: "string",
      phone: "string",
      username: username,
      password: password,
      role: "string"
     };

    const config = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
      }),
    };

    this.http.post(this.authUrl, JSON.stringify(data), config)
      .subscribe((res) => {
        console.log('Registration successful:', res);
        this.router.navigate(['/login']); 
      }, (err) => {
        console.error('Registration error:', err);
      });
  }
}
