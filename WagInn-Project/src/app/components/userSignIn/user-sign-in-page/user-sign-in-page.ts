import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserSignInService } from '../../../services/userSignIn_Service/user-sign-in-service';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: UserSignInService
  ) {
    this.userSignIn = this.fb.group({
      userName: ['', [Validators.required, this.strictEmailValidator]],
      password: ['', Validators.required],
    });
  }

  // Custom strict email validator
  strictEmailValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    // Strict email pattern: must have proper domain
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(control.value)) {
      return { strictEmail: true };
    }

    return null;
  }

  userLogin() {
    if (this.userSignIn.valid) {
      const loginData = this.userSignIn.value;

      this.service.getUserSignIn(loginData).subscribe({
        next: (response) => {
          console.log('Login in successful!');
          this.router.navigate(['userDashboard']);
        },
        error: (error) => {
          console.log('Login Failed!', error);
        },
      });
    } else {
      Object.keys(this.userSignIn.controls).forEach((key) => {
        this.userSignIn.get('key')?.markAsTouched();
      });
    }
  }
}
