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

  // Message Box properties
  showMessageBox: boolean = false;
  messageBoxTitle: string = '';
  messageBoxContent: string = '';
  messageBoxType: string = '';
  pendingUser: boolean = false;

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
          this.showSuccessMessage();
        },
        error: (error) => {
          console.log('Login Failed: ', error);
          this.handleLoginError(error);
        },
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.hostSignIn.controls).forEach((key) => {
        this.hostSignIn.get(key)?.markAsTouched();
      });
    }
  }

  private handleLoginError(error: any) {
    const errorMessage =
      error.error?.message || 'Login failed. Please try again.';

    if (errorMessage.toLowerCase().includes('pending')) {
      this.showPendingMessage(errorMessage);
    } else {
      this.showErrorMessage(errorMessage);
    }
  }

  private showSuccessMessage() {
    this.messageBoxTitle = 'Login Successful!';
    this.messageBoxContent =
      'Welcome! You will be redirected to your dashboard.';
    this.messageBoxType = 'success';
    this.pendingUser = false;
    this.showMessageBox = true;
  }

  private showPendingMessage(message: string) {
    this.messageBoxTitle = 'Registration Pending';
    this.messageBoxContent = message;
    this.messageBoxType = 'pending';
    this.pendingUser = true;
    this.showMessageBox = true;
  }

  private showErrorMessage(message: string) {
    this.messageBoxTitle = 'Login Failed';
    this.messageBoxContent = message;
    this.messageBoxType = 'error';
    this.pendingUser = false;
    this.showMessageBox = true;
  }

  closeMessageBox() {
    this.showMessageBox = false;

    // If login was successful, navigate to dashboard
    if (this.messageBoxType === 'success' && !this.pendingUser) {
      this.router.navigate(['hostDashboard']);
    }

    // Reset message box properties
    this.messageBoxTitle = '';
    this.messageBoxContent = '';
    this.messageBoxType = '';
    this.pendingUser = false;
  }
}
