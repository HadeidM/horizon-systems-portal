import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string | undefined;
  password: string | undefined;

  onSubmit() {
    console.log('Username: ' + this.username);
    console.log('Password: ' + this.password);
  }

  constructor(private router: Router) {}

  navigateToSSOPage() {
    this.router.navigate(['/multi-factor-auth']);
  }
}
