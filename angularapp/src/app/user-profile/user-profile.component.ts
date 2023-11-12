
import { Component, OnInit } from '@angular/core';
import { UserProfile } from './user-profile.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: UserProfile = new UserProfile(0, '', '', '', '', '', '', '', ''); 
  editedUser: UserProfile = new UserProfile(0, '', '', '', '', '', '', '', ''); 
  isEditing: boolean = false; 

  constructor() {}

  ngOnInit() {
    this.user = new UserProfile(
      0,
      'user@email.com',
      'John',
      'Doe',
      '123 Main St',
      '555-555-5555',
      'johndoe',
      'password',
      'user'
    );
    this.editedUser = { ...this.user }; 
  }

  enableEditing() {
    this.isEditing = true;
  }

  saveData() {
    this.user = { ...this.editedUser };
    this.isEditing = false;
  }
}
