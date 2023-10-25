import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multi-factor-auth',
  templateUrl: './multi-factor-auth.component.html',
})
export class MultiFactorAuthComponent {
  mfaCode = 1234;
  usrCode : number | undefined;
  constructor(private router: Router) {
    
  }
  navHome () {
    console.log("here")
    console.log(this.usrCode)
    if (this.usrCode == this.mfaCode) {
      console.log("matces")
      this.router.navigate(['/home']);
    }
      
  }
}
