import { Component, Input } from '@angular/core';
import { ColorService } from '../color.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { LogoService } from '../logo.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',

})
export class PreferencesComponent {
  currentInput!: Input;
  url?: string | ArrayBuffer | null;
  c1val = '#0077B6';
  c2val = '#03045E';
  color1!:Input;
  color2!:Input;
  subscription1!: Subscription;
  subscription2!: Subscription;
  MFAEnabled:boolean = this.authServ.getMFAOption() == "email" || "phone" ? true : false;
  MFAOption:string = '';
  
  constructor (private colorServ:ColorService, private logoserv:LogoService, private authServ:AuthService) {}

 
  MFAOptForm = new FormGroup({
    option: new FormControl(this.authServ.getMFAOption()),
  });


  updateColors(){
    this.colorServ.color1 = this.c1val
    this.colorServ.color2 = this.c2val
  }

  toggleMFA() {
    this.MFAEnabled = !this.MFAEnabled
  }
  onChangeOption() {
    console.log(this.MFAOptForm.value.option)  
 }
  onFileSelected(event : Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const mimeType = target.files[0].type;
      if (mimeType.match(/image\/*/) == null) {
          return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(target.files[0]); 
      reader.onload = (_event) => { 
          this.url = reader.result; 
          this.logoserv.logoUrl = this.url as string
          console.log(this.url)
      }
      console.log(target.files)
      console.log(target.files[0].name);
    }
  }
}

    

    