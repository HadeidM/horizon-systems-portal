import { Component, Input } from '@angular/core';
import { ColorService } from '../color.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

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
  MFAEnabled:boolean = false;
  MFAOption:string = '';
  
  constructor (private colorServ:ColorService) {}

  // ngOnInit() {
  //   this.subscription1 = this.colorServ.getColor1.subscribe(color1 => this.c1val = color1);
  //   this.subscription2 = this.colorServ.getColor2.subscribe(color2 => this.c2val = color2);

  // }
  MFAOptForm = new FormGroup({
    option: new FormControl('Email'),
  });

  // onColor1Selected(event: Event) {
  //   const target = event.target as HTMLInputElement;
  //   this.c1val = target.value;
  //   console.log(this.c1val)
    
  //   console.log("color1 set!!!!")

  // }
  updateColors(){
    this.colorServ.color1 = this.c1val
    this.colorServ.color2 = this.c2val
  }
  // onColor2Selected(event: Event) {
  //   const target = event.target as HTMLInputElement;
  //   this.c2val = target.value
  //   console.log(this.c2val)
  //   this.colorServ.setColor2(this.c2val)
  //   console.log("color2 set!!!!")
    
  // }
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
          console.log(this.url)
      }
      console.log(target.files)
      console.log(target.files[0].name);
    }
  }
}

    

    