import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'HS Portal';
  constructor() {
    localStorage.setItem('logStr',"Login")
  }
}
