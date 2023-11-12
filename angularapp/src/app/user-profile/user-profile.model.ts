export class UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
    username: string;
    password: string;
    role: string;
  
    constructor(
      id: number,
      email: string,
      firstName: string,
      lastName: string,
      address: string,
      phone: string,
      username: string,
      password: string,
      role: string
    ) {
      this.id = id;
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.address = address;
      this.phone = phone;
      this.username = username;
      this.password = password;
      this.role = role;
    }
  }
  