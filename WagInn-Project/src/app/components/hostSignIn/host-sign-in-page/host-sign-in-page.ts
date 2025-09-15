import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HostSignInService } from '../../../services/hostSignIn/host-sign-in-service';

@Component({
  selector: 'app-host-sign-in-page',
  standalone: false,
  templateUrl: './host-sign-in-page.html',
  styleUrl: './host-sign-in-page.css',
})
export class HostSignInPage {
  hostSignIn!: FormGroup;

  get userName() {
    return this.hostSignIn.get('userName');
  }

  get passCode() {
    return this.hostSignIn.get('passCode');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: HostSignInService
  ) {
    this.hostSignIn = this.fb.group({
      userName: ['', Validators.required],
      passCode: ['', Validators.required],
    });
  }

  hostLogin() {
    if (this.hostSignIn.valid) {
      const loginData = this.hostSignIn.value;
      this.service.getHostSignIn(loginData).subscribe({
        next: (response) => {
          console.log('Login successful!');
          this.router.navigate(['hostDashboard']);
        },
        error: (error) => {
          console.log('Login Failed: ', error);
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.hostSignIn.controls).forEach((key) => {
        this.hostSignIn.get('key')?.markAsTouched;
      });
    }
  }
}
