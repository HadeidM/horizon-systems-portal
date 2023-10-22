import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  displayDescriptions = [
    { 
      imgUrl: 'https://www.growthforce.com/hs-fs/hubfs/Billing%20Fraud.jpg?width=1112&name=Billing%20Fraud.jpg', 
      descriptor: "Billing Center", 
      items: ["View Billing Summary", "Make A Payment"] 
    }, 
    { 
      imgUrl: 'https://media.freshbooks.com/wp-content/uploads/2022/03/business-insurance-claims.jpg', 
      descriptor: "Claims Center", 
      items: ["View Claims History", "Report A Claim"] 
    },
    { 
      imgUrl: 'https://www.kbb.com/wp-content/uploads/2021/09/stacked-insurance.jpeg', 
      descriptor: "Policy Center", 
      items: ["View Policies", "Print Documents"] 
    }
  ]
}
