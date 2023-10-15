import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
})
export class InfoBoxComponent {
  @Input() descriptor : string = '';
  @Input() imgUrl : string = '';
  @Input() items : string[] = [];
}
