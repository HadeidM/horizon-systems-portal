import { Component, Input, ElementRef, HostListener } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  navOptions = ['Make A Payment','Report A Claim', 'Customer Care', 'Welcome User!']
  menuOpen : boolean;
  innerWidth : number;
  constructor() {
    this.menuOpen = false
    this.innerWidth = window.innerWidth;
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
  }
  
  // getter function that returns whether the menu is open or not
  get openCloseTrigger() {
    return this.menuOpen ? "open" : "closed";
  }

  // toggles MenuOpen
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  
}
