import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private registerUrl = 'https://localhost:7235/api/User/register';

  constructor(private http: HttpClient) { }

  register(user: any) {
    let rr: RegisterResp;
    const data = {
      id: 0,
      firstName: user.firstName,
      lastName: user.lastName,
      address: 'NULL',
      phone: 'NULL',
      email: user.email,
      username: user.username,
      password: user.password,
    role: "user"
    };
    const config = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    };
   
    return this.http.post<any>(this.registerUrl, JSON.stringify(data), config);
  }
}


interface RegisterResp {
  message: string;
}
