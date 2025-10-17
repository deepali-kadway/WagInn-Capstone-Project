import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HostRegistrationData } from '../../../model/hostRegistration.interface';
import { HostRegistrationServiceTs } from '../../../services/hostRegistration_Service/host-registration.service.ts';

@Component({
  selector: 'app-host-registration-pet-info',
  standalone: false,
  templateUrl: './host-registration-pet-info.html',
  styleUrls: ['./host-registration-pet-info.css'],
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
  get houseRules() {
    return this.registrationForm.get('houseRules');
  }
  get neuteredSpayedRequired() {
    return this.registrationForm.get('neuteredSpayedRequired');
  }
  get fleaTickPreventionRequired() {
    return this.registrationForm.get('fleaTickPreventionRequired');
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: HostRegistrationServiceTs
  ) {
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
    if (this.registrationForm.valid) {
      const payload = { ...this.registrationForm.value };

      // Clean up allowedPetsType: Convert array to comma separated string
      if (Array.isArray(payload.allowedPetsType)) {
        payload.allowedPetsType = payload.allowedPetsType.join(', ');
      }

      // Clean up requiredVaccinations: Convert array to comma separated string
      if (Array.isArray(payload.requiredVaccinations)) {
        payload.requiredVaccinations = payload.requiredVaccinations.join(', ');
      }

      // Clean up petSizeRestrictions: Convert object to comma separated string of selected values
      if (
        payload.petSizeRestrictions &&
        typeof payload.petSizeRestrictions === 'object'
      ) {
        const selectedSizes = Object.keys(payload.petSizeRestrictions) // Gets all keys of the object, e.g. ["small", "medium", "large", "none"].
          .filter((key) => payload.petSizeRestrictions[key]) // Keeps only keys where the value is true
          .join(', '); // Turns the array into a string separated by commas
        payload.petSizeRestrictions = selectedSizes;
      }

      this.service.updatePetInfo(payload);
      this.router.navigate(['propertyDetails']);
    }
  }

  prevStep() {
    this.router.navigate(['addressDetails']);
  }
}
