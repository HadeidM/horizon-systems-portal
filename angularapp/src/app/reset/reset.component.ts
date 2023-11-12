import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
})
export class ResetComponent {
  emailToken:string = '';
  email:string = '';
  newPass:string = '';
  confPass:string = '';
  emptyPass = false;
  private resetUrl = 'https://localhost:7235/api/User/reset_password';
  urlData = {
    email: "",
    emailToken: "",
    newPassword: "",
    confirmPassword: ""
  }
  resetSuccess: boolean = false;

  constructor(private route: ActivatedRoute, private http:HttpClient) { }

  ngOnInit() {
    // or if you're using query parameters (?id=1 for example)
    this.route.queryParams.subscribe(params => {
      console.log(params); // log the entire params object
      console.log(params['code']); // log the value of id
      this.emailToken = params['code'];
      this.email = params['email'];
      this.urlData.emailToken = this.emailToken.replace(' ','+');
      this.urlData.email = this.email;
      console.log(params['email']); 
    });
  }

  onSubmit() {
    if (this.confPass != this.newPass) {
      console.log('passwords do not match')
      return;
    }
    if (this.confPass === '' || this.newPass === '') {
      this.emptyPass = true;
      console.log('passwords cannot be empty')
      return;
    }
    this.emptyPass = false;
    this.urlData.newPassword = this.newPass;
    this.urlData.confirmPassword = this.confPass;
    const config = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*"
      })
    };
    this.http.post<ResetResp>(this.resetUrl, JSON.stringify(this.urlData), config)
      .subscribe({
        next: (res) => {
          console.log(res)
          this.resetSuccess = true;
        }, error: (err) => {
          console.log(err)
        }
      });
  }
}

interface ResetResp {
  message: string;
}

