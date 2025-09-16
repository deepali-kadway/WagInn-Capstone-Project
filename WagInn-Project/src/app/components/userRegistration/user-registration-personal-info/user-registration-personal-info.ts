import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserRegistrationService } from '../../../services/userRegistration_Service/user-registration-service';

@Component({
  selector: 'app-user-registration-personal-info',
  standalone: false,
  templateUrl: './user-registration-personal-info.html',
  styleUrls: [
    './user-registration-personal-info.css',
    '../shared/userRegistration-shared.css',
  ],
})
export class UserRegistrationPersonalInfo {
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1); // _ means ignoring the elements (since the 31 slots are anyways empty)
  years: number[];

  userRegistrationForm!: FormGroup;

  get firstName() {
    return this.userRegistrationForm.get('firstName');
  }

  get lastName() {
    return this.userRegistrationForm.get('lastName');
  }

  get birthMonth() {
    return this.userRegistrationForm.get('birthMonth');
  }
  get birthDay() {
    return this.userRegistrationForm.get('birthDay');
  }
  get birthYear() {
    return this.userRegistrationForm.get('birthYear');
  }

  get email() {
    return this.userRegistrationForm.get('email');
  }
  get phone() {
    return this.userRegistrationForm.get('phone');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: UserRegistrationService
  ) {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    this.years = [];
    for (let y = currentYear; y >= startYear; y--) {
      this.years.push(y);
    }

    this.userRegistrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthMonth: ['', Validators.required],
      birthDay: ['', Validators.required],
      birthYear: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  nextStep() {
    if (this.userRegistrationForm.valid) {
      // Get form data and add +1 prefix to phone number
      const formData = { ...this.userRegistrationForm.value };
      formData.phone = '+1' + formData.phone;

      this.service.updatePersonalInfo(formData);
      this.router.navigate(['userPetInfo']);
    } else {
      Object.keys(this.userRegistrationForm.controls).forEach((key) => {
        const control = this.userRegistrationForm.get(key);
        control?.markAsTouched;
      });
    }
  }
}
