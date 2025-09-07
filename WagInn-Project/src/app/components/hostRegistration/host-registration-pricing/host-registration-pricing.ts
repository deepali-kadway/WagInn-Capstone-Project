import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host-registration-pricing',
  standalone: false,
  templateUrl: './host-registration-pricing.html',
  styleUrl: './host-registration-pricing.css',
})
export class HostRegistrationPricing {
  pricingForm: FormGroup;
  guestServiceFee = 8; // Standard $8 fee
  taxes = 4; // Standard $4 fee
  serviceChargeRate = 0.03; // 3% per booking

  constructor(private fb: FormBuilder, private router: Router) {
    this.pricingForm = this.fb.group({
      basePrice: ['', [Validators.required, Validators.min(10)]],
    });
  }

  // Calculating base price, total price, service charges and earnings.
  get basePrice() {
    return this.pricingForm.get('basePrice');
  }

  get basePriceValue(): number {
    const value = this.pricingForm.get('basePrice')?.value;
    return value ? parseFloat(value) : 0;
  }

  get totalGuestPrice(): number {
    return this.basePriceValue + this.guestServiceFee + this.taxes;
  }

  get wagInnEarnings(): number {
    return this.totalGuestPrice * this.serviceChargeRate;
  }

  get hostEarnings(): number {
    return this.totalGuestPrice - this.wagInnEarnings;
  }

  nextStep() {}
  prevStep() {
    this.router.navigate(['propertyDetails']);
  }
}
