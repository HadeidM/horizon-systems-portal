import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../register.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  submitted = false;
  fb = inject(FormBuilder);

  constructor(private formBuilder: FormBuilder, private userService: RegisterService) {
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

    //if (this.registerForm.invalid) {
    //  return;
    //}
    console.log('hit')
    console.log(this.registerForm.value)
    this.userService.register(this.registerForm.value)
      .subscribe(
        data => {
          console.log('Registration successful');
        },
        error => {
          console.log('Registration failed');
        });
  }
}
