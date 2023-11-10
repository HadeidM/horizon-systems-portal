import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../register.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  submitted = false;
  fb = inject(FormBuilder);
  success = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: RegisterService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

/*  get f() { return this.registerForm.controls; }*/

  onSubmit() {
    this.submitted = true;
    console.log(this.registerForm.value)
    this.userService.register(this.registerForm.value)
      .subscribe({
          next: (res) => {
            console.log('Registration successful');
            this.router.navigate(['/registration-success']);
        }, error: (err) => {
          console.log('Registration failed');
            console.log(err)
          }
        })
  }
}


interface RegisterResp {
  message: string;
}
