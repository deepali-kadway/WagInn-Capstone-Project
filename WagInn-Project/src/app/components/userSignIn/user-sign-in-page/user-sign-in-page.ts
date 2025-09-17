import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-sign-in-page',
  standalone: false,
  templateUrl: './user-sign-in-page.html',
  styleUrl: './user-sign-in-page.css',
})
export class UserSignInPage {
  userSignIn!: FormGroup;

  get userName() {
    return this.userSignIn.get('userName');
  }

  get password() {
    return this.userSignIn.get('password');
  }

  constructor(private fb: FormBuilder, private router: Router) {
    this.userSignIn = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  userLogin() {
    if (this.userSignIn.valid) {
      this.router.navigate(['userDashboard']);
    }
  }
}
