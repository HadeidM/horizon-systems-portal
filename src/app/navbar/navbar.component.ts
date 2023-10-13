import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  logoSource = '../../../assets/HSlogo.jpg'
  navOptions = ['Make A Payment','Report A Claim', 'Customer Care', 'Welcome User!']
}
