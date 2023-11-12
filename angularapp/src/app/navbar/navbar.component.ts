import { Component, Input, ElementRef, HostListener,Injectable } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ColorService } from '../color.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common'; 
import { Inject }  from '@angular/core';
import { LogoService } from '../logo.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  animations: [
    trigger("openClose", [
      state(
        "open",
        style({
          opacity: 1,
          transform: "scale(1)"
        })
      ),
      state(
        "med",
        style({
          opacity: 0.8,
          transform: "scale(1.2)"
        })
      ),
      state(
        "closed",
        style({
          opacity: 0,
          transform: "scaleY(0)"
        })
      ),
      transition("open => closed", [animate("0.5s ease-in-out")]),
      transition("closed => open", [animate("0.5s ease-in-out")])
    ])
  ],
})

export class NavbarComponent {
  logoSource = '../../../assets/HSlogo.jpg'
  loggedIn = false
  logStr : string|null;
  menuOpen: boolean;
  customerCareMenuOpen: boolean;
  innerWidth : number;
  subscription1!: Subscription;
  subscription2!: Subscription;
  subscription3!: Subscription;
  color1!: string;
  color2!: string;
  cssClass!: string;
  
  constructor(private router:Router, private colorService:ColorService, private logoServ:LogoService, @Inject(DOCUMENT) document: Document) {
    this.menuOpen = false
    this.customerCareMenuOpen = false
    this.innerWidth = window.innerWidth;
    this.logStr = localStorage.getItem("logStr");
  }
 
  getGradientStyle() {
    return {
      'background': `linear-gradient(to bottom, ${this.colorService.color1}, ${this.colorService.color2})`,
    };
  }
  ngOnChanges(){
    this.logStr = localStorage.getItem("logStr");
  }
  navOptions = ['Make A Payment','Report A Claim', 'Customer Care']
  
  // Add a listener to register window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 768 && this.menuOpen) {
      // if the user forgot to close the menu but resized their screen, 
      // the button will be closed automatically
      this.toggleMenu()
    }
  }

  getLogoUrl(){
    return this.logoServ.logoUrl;
  }
  
  // getter function that returns whether the menu is open or not
  get openCloseTrigger() {
    return this.menuOpen ? "open" : "closed";
  }

  get openCloseCustomerCare() {
    return this.customerCareMenuOpen ? "open" : "closed";
  }
  // toggles MenuOpen
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleCustomerCareMenu() {
    this.customerCareMenuOpen = !this.customerCareMenuOpen
  }
  logOut() {
    console.log('logout!!!!!')
    localStorage.setItem('logStr', 'Login')
    location.reload();
  }
  navigateToLogin(){
    this.router.navigate(['/login']);
  }
  
}
