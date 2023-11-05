import { Component, HostListener } from '@angular/core';
import { ColorService } from '../color.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  constructor (private colorService:ColorService) {}
  getGradientStyle() {
    return {
      'background': `linear-gradient(to top, ${this.colorService.color1}, ${this.colorService.color2})`,
    };
  }
  gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }
}
