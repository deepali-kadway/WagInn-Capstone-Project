import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host-registration-pet-info',
  standalone: false,
  templateUrl: './host-registration-pet-info.html',
  styleUrl: './host-registration-pet-info.css',
})
export class HostRegistrationPetInfo {
  registrationForm!: FormGroup;
  vaccinationsName = [
    { id: 1, name: 'Rabies' },
    { id: 2, name: 'Bordetella' },
    { id: 3, name: 'DHPP/DAPP' },
    { id: 4, name: 'CIV' },
    { id: 5, name: 'FVRCP' },
    { id: 6, name: 'FeLV' },
  ];

  //Getters:
  get allowedPetsType() {
    return this.registrationForm.get('allowedPetsType');
  }
  get requiredVaccinations() {
    return this.registrationForm.get('requiredVaccinations');
  }
  get petSizeRestrictions() {
    return this.registrationForm.get('petSizeRestrictions');
  }
  get numberOfPetsAllowed() {
    return this.registrationForm.get('numberOfPetsAllowed');
  }
  get houseRules() {
    return this.registrationForm.get('houseRules');
  }
  get neuteredSpayedRequired() {
    return this.registrationForm.get('neuteredSpayedRequired');
  }
  get fleaTickPreventionRequired() {
    return this.registrationForm.get('fleaTickPreventionRequired');
  }

  constructor(private fb: FormBuilder, private router: Router) {
    // Initialize the form with form controls
    this.registrationForm = this.fb.group({
      allowedPetsType: ['', Validators.required],
      petSizeRestrictions: this.fb.group(
        {
          small: [false],
          medium: [false],
          large: [false],
          none: [false],
        },
        { validators: this.petSizeValidator }
      ),
      numberOfPetsAllowed: ['', Validators.required],
      houseRules: [''], // Optional field
      requiredVaccinations: [''], // Optional field
      neuteredSpayedRequired: ['', Validators.required],
      fleaTickPreventionRequired: ['', Validators.required],
    });
  }

  // Custom validator for pet size restrictions
  petSizeValidator(control: AbstractControl): ValidationErrors | null {
    const formGroup = control as FormGroup;
    const small = formGroup.get('small')?.value;
    const medium = formGroup.get('medium')?.value;
    const large = formGroup.get('large')?.value;
    const none = formGroup.get('none')?.value;

    // Check if at least one option is selected
    const hasSelection = small || medium || large || none;
    if (!hasSelection) {
      return { required: true };
    }

    // Check if 'none' is selected with other options
    if (none && (small || medium || large)) {
      return { conflictingSelection: true };
    }

    return null;
  }

  nextStep() {
      this.router.navigate(['propertyDetails']);
    }
  
  prevStep() {
    this.router.navigate(['addressDetails']);
  }
}
