import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  color1:string = "#0077B6"
  color2:string = "#03045E"
  private cssClass = new BehaviorSubject('px-10 flex justify-between items-center md:justify-evenly flex-row rounded-b-lg shadow-2xl bg-gradient-to-b from-[#0077B6] to-[#03045E]')
  // getColor1 = this.color1.asObservable();
  // getColor2 = this.color2.asObservable();
  // getCss = this.cssClass.asObservable();

  constructor() { }

  // setColor1(color: string){
  //   this.color1.next(color)
  // }
  // setColor2(color: string){
  //   this.color2.next(color)
  //   this.cssClass.next(`px-10 flex justify-between items-center md:justify-evenly flex-row rounded-b-lg shadow-2xl bg-gradient-to-b from-[${this.color1.getValue().toUpperCase()}] to-[${this.color2.getValue().toUpperCase()}]`)
  // }

}
