import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host-registration-property-details',
  standalone: false,
  templateUrl: './host-registration-property-details.html',
  styleUrl: './host-registration-property-details.css',
})
export class HostRegistrationPropertyDetails {
  registrationForm!: FormGroup;
  counters: any = { guests: 0, bedrooms: 0, beds: 0, bathrooms: 0, pets: 0 };

  //getters
  get propertyTitle() {
    return this.registrationForm.get('propertyTitle');
  }
  get propertyType() {
    return this.registrationForm.get('propertyType');
  }
  get ammenities() {
    return this.registrationForm.get('ammenities');
  }
  get ammenitiesPets() {
    return this.registrationForm.get('ammenitiesPets');
  }

  constructor(private fb: FormBuilder, private router: Router) {
    this.registrationForm = this.fb.group({
      propertyTitle: ['', Validators.required],
      propertyType: ['', Validators.required],
      ammenities: ['', Validators.required],
      guests: [0, [Validators.required, Validators.min(1)]],
      bedrooms: [0, [Validators.required, Validators.min(1)]],
      beds: [0, [Validators.required, Validators.min(1)]],
      bathrooms: [0, [Validators.required, Validators.min(1)]],
      pets: [0, [Validators.required, Validators.min(1)]],
      ammenitiesPets: [''], //can be optional
    });
  }

  // Guest-Room-Pets counter
  updateCounter(counterName: string, operation: string) {
    if (operation === 'increment' && this.counters[counterName] < 10) {
      this.counters[counterName as keyof typeof this.counters]++;
    } else if (
      operation === 'decrement' &&
      this.counters[counterName as keyof typeof this.counters] > 0
    ) {
      this.counters[counterName as keyof typeof this.counters]--;
    }
    this.registrationForm
      .get(counterName)
      ?.setValue(this.counters[counterName as keyof typeof this.counters]);
  }

  nextStep() {}
  prevStep() {
    this.router.navigate(['petInfo']);
  }
}
