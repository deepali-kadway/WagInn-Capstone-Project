import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host-registration-address-details',
  standalone: false,
  templateUrl: './host-registration-address-details.html',
  styleUrl: './host-registration-address-details.css'
})
export class HostRegistrationAddressDetails {

  registrationForm!: FormGroup;
  constructor(private router: Router){}
  
  nextStep(){
    this.router.navigate(['petInfo'])
  }
  prevStep(){
    this.router.navigate([''])
  }

}
