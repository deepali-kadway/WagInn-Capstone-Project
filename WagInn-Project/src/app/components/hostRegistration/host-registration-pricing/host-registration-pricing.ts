import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HostRegistrationServiceTs } from '../../../services/hostRegistration_Service/host-registration.service.ts';

@Component({
  selector: 'app-host-registration-pricing',
  standalone: false,
  templateUrl: './host-registration-pricing.html',
  styleUrls: ['./host-registration-pricing.css'],
})
export class HostRegistrationPricing {
  pricingForm: FormGroup;
  guestServiceFee = 8; // Standard $8 fee
  taxes = 4; // Standard $4 fee
  serviceChargeRate = 0.03; // 3% per booking

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: HostRegistrationServiceTs
  ) {
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

  // Navigation to next & previous steps
  nextStep() {
    if (this.pricingForm.valid) {
      // Create complete pricing object with calculated values
      const pricingData = {
        basePrice: this.basePriceValue,
        totalGuestPrice: this.totalGuestPrice,
        hostEarnings: this.hostEarnings,
      };

      this.service.updatePricing(pricingData);
      this.router.navigate(['idVerification']);
    }
  }

  prevStep() {
    this.router.navigate(['propertyDetails']);
  }
}
