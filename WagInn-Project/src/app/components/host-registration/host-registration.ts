import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-host-registration',
  standalone: false,
  templateUrl: './host-registration.html',
  styleUrls: ['./host-registration.css'],
})
export class HostRegistration implements OnInit {
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

  vaccinationsName: string[] = ['Rabies', 'Parovirus']



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
  get vaccinations() {
    return this.registrationForm.get('vaccinations')
  }

  currentStep: number = 1;
  registrationForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    this.years = [];
    for (let y = currentYear; y >= startYear; y--) {
      this.years.push(y);
    }
  }

  ngOnInit() {
    this.initializeForm();
    console.log('Vaccinations array:', this.vaccinationsName);
  }

  initializeForm() {
    this.registrationForm = this.fb.group({
      // Step 1 - Personal Info
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthMonth: ['', Validators.required],
      birthDay: ['', Validators.required],
      birthYear: ['', Validators.required],

      // Step 2 - Address Details
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],

      vaccinationsName: [['Rabies', 'Parovirus']],
    });
  }

  // *ngIf conditional execution based on output of this.currentStep++ or this.currentStep--

  nextStep() {
    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;
      console.log('Registration Data:', formData);
      // Here you would submit to your database
    }
  }
}
