import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host-registration-address-details',
  standalone: false,
  templateUrl: './host-registration-address-details.html',
  styleUrl: './host-registration-address-details.css'
})
export class HostRegistrationAddressDetails {

  registrationForm!: FormGroup;

  //getters
  get streetAddress(){return this.registrationForm.get('streetAddress')}
  get city(){return this.registrationForm.get('city')}
  get state(){return this.registrationForm.get('state')}
  get zipCode(){return this.registrationForm.get('zipCode')}
  get country(){return this.registrationForm.get('country')}

  constructor(private fb: FormBuilder, private router: Router){
    this.registrationForm = this.fb.group({
      streetAddress: ['', Validators.required],
      city: ['',Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required]
    })
  }
  
  nextStep(){
    this.router.navigate(['petInfo'])
  }
  prevStep(){
    this.router.navigate([''])
  }

}
