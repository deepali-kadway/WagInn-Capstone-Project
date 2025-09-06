import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host-registration-pet-info',
  standalone: false,
  templateUrl: './host-registration-pet-info.html',
  styleUrl: './host-registration-pet-info.css',
})
export class HostRegistrationPetInfo {
  registrationForm!: FormGroup;
  vaccinationsName: string[] = ['Rabies', 'Parovirus'];

  constructor(private router: Router) {}

  nextStep() {
    this.router.navigate(['propertyDetails']);
  }
  prevStep() {
    this.router.navigate(['addressDetails']);
  }
}
