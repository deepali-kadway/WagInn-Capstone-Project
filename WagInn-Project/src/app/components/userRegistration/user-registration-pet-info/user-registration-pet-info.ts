import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserRegistrationService } from '../../../services/userRegistration_Service/user-registration-service';

@Component({
  selector: 'app-user-registration-pet-info',
  standalone: false,
  templateUrl: './user-registration-pet-info.html',
  styleUrls: [
    './user-registration-pet-info.css',
    '../shared/userRegistration-shared.css',
  ],
})
export class UserRegistrationPetInfo {
  userRegistrationForm!: FormGroup;

  // Breed options based on pet type
  breedOptions = {
    dog: [
      'Labrador',
      'Golden Retriever',
      'German Shepherd',
      'Bernese Mountain Dog',
      'Poodle',
      'Beagle',
      'Rottweiler',
      'Yorkshire Terrier',
      'Mixed Breed',
      'Other',
    ],
    cat: [
      'DSH',
      'Persian',
      'Siamese',
      'Maine Coon',
      'British Shorthair',
      'Ragdoll',
      'Russian Blue',
      'American Shorthair',
      'Mixed Breed',
      'Other',
    ],
    bird: [
      'Parakeet',
      'Canary',
      'Cockatiel',
      'Parrot',
      'Finch',
      'Lovebird',
      'Conure',
      'Other',
    ],
  };

  // Message Box properties
  showMessageBox: boolean = false;
  messageBoxTitle: string = '';
  messageBoxContent: string = '';
  messageBoxType: string = '';
  pendingUser: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: UserRegistrationService
  ) {
    this.initializeForm();
  }

  initializeForm() {
    this.userRegistrationForm = this.fb.group({
      pets: this.fb.array([this.createPetFormGroup()]),
      //Declared pets, which is a form array, initialized with one formgroup created by createPetFormGroup()
    });
  }

  createPetFormGroup(): FormGroup {
    return this.fb.group({
      petName: ['', [Validators.required, Validators.minLength(2)]],
      petType: ['', Validators.required],
      breed: ['', Validators.required],
      size: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0), Validators.max(30)]],
      isVaccinated: ['', Validators.required],
      vaccinations: [[]], // Initialize as empty array for multi-select
      isNeutered: ['', Validators.required],
      isFleaTickPrevented: ['', Validators.required],
      concerns: [''],
    });
  }

  get pets(): FormArray {
    return this.userRegistrationForm.get('pets') as FormArray;
  }

  getPetControl(index: number, controlName: string) {
    return this.pets.at(index).get(controlName);
  }

  getBreedOptions(petType: string): string[] {
    if (!petType) return [];
    return this.breedOptions[petType as keyof typeof this.breedOptions] || [];
  }

  addPet() {
    this.pets.push(this.createPetFormGroup());
  }

  removePet(index: number) {
    if (this.pets.length > 1) {
      this.pets.removeAt(index);
    }
  }

  previousStep() {
    this.router.navigate(['/userRegistration']);
  }

  nextStep() {
    // Set conditional validators for vaccination field
    this.setConditionalValidators();

    if (this.userRegistrationForm.valid) {
      const petData = this.userRegistrationForm.value;

      // Process the data (clean up vaccination field for pets that aren't vaccinated)
      const processedData = {
        pets: petData.pets.map((pet: any) => ({
          ...pet,
          vaccinations:
            pet.isVaccinated === 'yes'
              ? Array.isArray(pet.vaccinations)
                ? pet.vaccinations.join(', ')
                : pet.vaccinations
              : null,
        })),
      };

      this.service.updatePetInfo(processedData);

      this.service.submitRegistration().subscribe({
        next: (response) => {
          console.log('Registration Successful!');
          this.showSuccessMessage();
        },
        error: (error) => {
          console.log('Registration Failed:', error);
        },
      });
      // this.router.navigate(['/nextStep']);
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  private setConditionalValidators() {
    this.pets.controls.forEach((petGroup) => {
      const isVaccinated = petGroup.get('isVaccinated')?.value;
      const vaccinationsControl = petGroup.get('vaccinations');

      if (isVaccinated === 'yes') {
        vaccinationsControl?.setValidators([Validators.required]);
      } else {
        vaccinationsControl?.clearValidators();
      }
      vaccinationsControl?.updateValueAndValidity();
    });
  }

  private showSuccessMessage() {
    this.messageBoxTitle = 'Registration Completed!';
    this.messageBoxContent = 'Click OK to access your user dashboard';
    this.messageBoxType = 'success';
    this.showMessageBox = true;
  }

  closeMessageBox() {
    this.showMessageBox = false;
    this.router.navigate(['nextStep']);
  }

  private markAllFieldsAsTouched() {
    this.pets.controls.forEach((petGroup) => {
      const group = petGroup as FormGroup;
      Object.keys(group.controls).forEach((key) => {
        group.get(key)?.markAsTouched();
      });
    });
  }
}
