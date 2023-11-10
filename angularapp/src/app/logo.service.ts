import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogoService {
  logoUrl:string = 'data:image/jpeg;base64,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'
  constructor() { }
}