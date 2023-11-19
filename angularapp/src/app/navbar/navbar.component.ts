import { Component, Input, ElementRef, HostListener,Injectable } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ColorService } from '../color.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common'; 
import { Inject }  from '@angular/core';
import { LogoService } from '../logo.service';
import { AuthService } from '../auth.service';


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
  dropdownOpen = false;
  hamdropdownOpen = false;

  
  constructor(private router:Router, private eRef: ElementRef, private authServ:AuthService, private colorService:ColorService, private logoServ:LogoService, @Inject(DOCUMENT) document: Document) {
    this.menuOpen = false
    this.customerCareMenuOpen = false
    this.innerWidth = window.innerWidth;
    this.logStr = localStorage.getItem("logStr");
  }
  
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  
  toggleMenuIfOpen() {
    if (this.menuOpen) {
      this.toggleMenu();
    }
    if (this.customerCareMenuOpen) {
      this.toggleCustomerCareMenu();
    }
    if (this.hamdropdownOpen) {
      this.toggleHamDropdown();
    }
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

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.customerCareMenuOpen = false;
    }
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.hamdropdownOpen = false;
    }
  }
  
  // Add a listener to register window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth > 768 && this.menuOpen) {
      // if the user forgot to close the menu but resized their screen, 
      // the button will be closed automatically
      this.toggleMenu()
    }
    if (this.innerWidth < 768 && this.customerCareMenuOpen) {
      // if the user forgot to close the menu but resized their screen, 
      // the dropdown will be closed automatically
      this.toggleCustomerCareMenu()
    }
  }
  





  getLogoUrl(){
    return this.logoServ.logoUrl;
  }
  isLoggedIn() {
    return this.authServ.getIsLoggedIn();
  }
  getUsername(){
    return this.authServ.getUser();
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
  toggleHamDropdown() {
    this.hamdropdownOpen = !this.hamdropdownOpen;
  }
  toggleCustomerCareMenu() {
    this.customerCareMenuOpen = !this.customerCareMenuOpen
  }
  logOut() {
    // console.log('logout!!!!!')
    // localStorage.setItem('logStr', 'Login')
    this.authServ.logout();
    location.reload();
  }
  navigateToLogin(){
    this.router.navigate(['/login']);
  }
  
}
