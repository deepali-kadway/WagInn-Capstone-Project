import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HostRegistrationServiceTs } from '../../../services/hostRegistration_Service/host-registration.service.ts';
import { HostRegistrationData } from '../../../model/hostRegistration.interface';

@Component({
  selector: 'app-host-registration-personal-info',
  standalone: false,
  templateUrl: './host-registration-personal-info.html',
  styleUrls: ['./host-registration-personal-info.css'],
})
export class HostRegistrationPersonalInfo {
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

  registrationForm!: FormGroup;

  get firstName() {
    return this.registrationForm.get('firstName');
  }
  get lastName() {
    return this.registrationForm.get('lastName');
  }
  get birthMonth() {
    return this.registrationForm.get('birthMonth');
  }
  get birthDay() {
    return this.registrationForm.get('birthDay');
  }
  get birthYear() {
    return this.registrationForm.get('birthYear');
  }
  get email() {
    return this.registrationForm.get('email');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: HostRegistrationServiceTs
  ) {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    this.years = [];
    for (let y = currentYear; y >= startYear; y--) {
      this.years.push(y);
    }

    // Initialize form with validators
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      birthMonth: ['', Validators.required],
      birthDay: ['', Validators.required],
      birthYear: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  nextStep() {
    //error handling & debugging
    Object.keys(this.registrationForm.controls).forEach((key) => {
      //Object.keys gets an array of the control names: firstname, lastname, birthMonth...
      const control = this.registrationForm.get(key);
      if (control?.errors) {
        console.log(`${key} errors: `, control.errors);
      }
    });

    if (this.registrationForm.valid) {
      //not calling .subscribe as service is currently storing data locally and not making HTTP requests
      this.service.updatePersonalInfo(this.registrationForm.value);
      this.router.navigate(['addressDetails']);
    }
  }
}
