import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HostRegistrationServiceTs } from '../../../services/hostRegistration_Service/host-registration.service.ts';

@Component({
  selector: 'app-host-registration-address-details',
  standalone: false,
  templateUrl: './host-registration-address-details.html',
  styleUrl: './host-registration-address-details.css',
})
export class HostRegistrationAddressDetails {
  registrationForm!: FormGroup;

  //getters
  get streetAddress() {
    return this.registrationForm.get('streetAddress');
  }
  get city() {
    return this.registrationForm.get('city');
  }
  get province() {
    return this.registrationForm.get('province');
  }
  get zipCode() {
    return this.registrationForm.get('zipCode');
  }
  get country() {
    return this.registrationForm.get('country');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: HostRegistrationServiceTs
  ) {
    this.registrationForm = this.fb.group({
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  nextStep() {
    Object.keys(this.registrationForm.controls).forEach((key) => {
      const control = this.registrationForm.get(key);
      if (control?.errors) {
        console.log(`${key} errors: `, control.errors);
      }
    });

    if (this.registrationForm.valid) {
      //send form value directly, as form structure matched the desired output, hence no manual mapping needed.
      this.service.updateAddressDetails(this.registrationForm.value);
      this.router.navigate(['petInfo']);
    }
  }
  prevStep() {
    this.router.navigate(['']);
  }
}
