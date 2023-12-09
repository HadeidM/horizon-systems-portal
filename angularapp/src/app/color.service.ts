import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  color1:string = "#0077B6"
  color2:string = "#03045E"
  private cssClass = new BehaviorSubject('px-10 flex justify-between items-center md:justify-evenly flex-row rounded-b-lg shadow-2xl bg-gradient-to-b from-[#0077B6] to-[#03045E]')
  private prefUrl = "https://localhost:7235/api/User/preferences"

  constructor(private http: HttpClient) { }
  private config = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*"
    })
  };

  getColor1(userEmail:String){
    let body = {
      "primaryColor": "",
      "secondaryColor": "",
      "logoUrl": "",
      "mfaOption": "",
      "email": userEmail
    }
    this.http.post<PrefResp>(this.prefUrl,body, this.config)
            .subscribe({
              next: (res) => {
                console.log("color1: " + res.PrimaryColor)
                this.color1 = res.PrimaryColor;
              }, error: (err) => {
                console.log(err)
              }
            });
    return "";
  }
  getColor2(userEmail:String){
    let body = {
      "primaryColor": "",
      "secondaryColor": "",
      "logoUrl": "",
      "mfaOption": "",
      "email": userEmail
    }
    this.http.post<PrefResp>(this.prefUrl,body, this.config)
            .subscribe({
              next: (res) => {
                console.log("color2: " + res.SecondaryColor)
                this.color2 = res.SecondaryColor;
              }, error: (err) => {
                console.log(err)
              }
            });
    return "";
  }
  updateColor1(color:string, userEmail:string){
    this.color1 = color;
    let body = {
      "primaryColor": color,
      "secondaryColor": "",
      "logoUrl": "",
      "mfaOption": "",
      "email": userEmail
    }
    this.http.put<PrefResp>(this.prefUrl,body, this.config)
      .subscribe({
        next: (res) => {
          console.log(res)
          console.log("update complete!")
        }, error: (err) => {
          console.log(err)
        }
      });
  }
  updateColor2(color:string, userEmail:string){
    this.color2 = color;
    let body = {
      "primaryColor": "",
      "secondaryColor": color,
      "logoUrl": "",
      "mfaOption": "",
      "email": userEmail
    }
    this.http.put<PrefResp>(this.prefUrl,body, this.config)
      .subscribe({
        next: (res) => {
          console.log(res)
          console.log("update complete!")
        }, error: (err) => {
          console.log(err)
        }
      });
  }
  updateColors(color1:string, color2:string, userEmail:string){
    this.color1 = color1;
    this.color2 = color2;
    let body = {
      "primaryColor": color1,
      "secondaryColor": color2,
      "logoUrl": "",
      "mfaOption": "",
      "email": userEmail
    }
    this.http.put<PrefResp>(this.prefUrl,body, this.config)
      .subscribe({
        next: (res) => {
          console.log(res)
          console.log("update complete: two colors!")
          this.getColor1(userEmail);
          this.getColor2(userEmail);
        }, error: (err) => {
          console.log(err)
        }
      });
  }
}
  
type PrefResp = {
  PrimaryColor : string,
  SecondaryColor : string,
  LogoUrl : string,
  MFAOption : string
}
