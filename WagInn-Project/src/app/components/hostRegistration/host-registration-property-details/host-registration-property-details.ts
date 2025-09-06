import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host-registration-property-details',
  standalone: false,
  templateUrl: './host-registration-property-details.html',
  styleUrl: './host-registration-property-details.css',
})
export class HostRegistrationPropertyDetails {
  registrationForm!: FormGroup;

  constructor(private router: Router) {}

  nextStep() {}
  prevStep() {
    this.router.navigate(['petInfo']);
  }
}
