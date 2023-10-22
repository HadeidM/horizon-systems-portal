import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

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
  
  constructor(private router: Router, private nvComponent: NavbarComponent) {
    this.multiFactorSet = false;
  }
  onSubmit() {
    console.log('Username: ' + this.username);
    console.log('Password: ' + this.password);
    if (this.username == this.correctUser && this.password === this.correctPass) {
      this.multiFactorSet = true;
      this.nvComponent.logStr = "Welcome User!";
      localStorage.setItem('logStr', "Welcome User!");
      this.navigateToSSOPage()
    }
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