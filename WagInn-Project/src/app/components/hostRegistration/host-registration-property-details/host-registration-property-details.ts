import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HostRegistrationServiceTs } from '../../../services/hostRegistration_Service/host-registration.service.ts';

@Component({
  selector: 'app-host-registration-property-details',
  standalone: false,
  templateUrl: './host-registration-property-details.html',
  styleUrl: './host-registration-property-details.css',
})
export class HostRegistrationPropertyDetails {
  registrationForm!: FormGroup;
  counters: any = { guests: 0, bedrooms: 0, beds: 0, bathrooms: 0, pets: 0 };

  // File upload properties
  selectedFiles: File[] = [];
  filePreviewUrls: string[] = [];
  maxFiles = 10;
  minFiles = 5;

  // Track selected amenities
  selectedAmenities: string[] = [];
  petsAmmenities: string[] = [];

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: HostRegistrationServiceTs
  ) {
    this.registrationForm = this.fb.group({
      propertyTitle: ['', Validators.required],
      propertyType: ['', Validators.required],
      ammenities: [
        '',
        [Validators.required, this.amenitiesValidator.bind(this)],
      ],
      guests: [0, [Validators.required, Validators.min(1)]],
      bedrooms: [0, [Validators.required, Validators.min(1)]],
      beds: [0, [Validators.required, Validators.min(1)]],
      bathrooms: [0, [Validators.required, Validators.min(1)]],
      pets: [0, [Validators.required, Validators.min(1)]],
      ammenitiesPets: [''],
      propertyPhotos: [
        0,
        [Validators.required, this.imageCountValidate.bind(this)],
      ],
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

  //File Selection Logic
  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];

    // Clear previous selection and revoke old blob URLs
    this.filePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    this.selectedFiles = [];
    this.filePreviewUrls = [];

    files.forEach((file) => {
      if (
        this.isValidImage(file) &&
        this.selectedFiles.length < this.maxFiles
      ) {
        this.selectedFiles.push(file);
        this.filePreviewUrls.push(URL.createObjectURL(file));
      }
    });

    // Update form control with file count only (not the actual files)
    this.registrationForm
      .get('propertyPhotos')
      ?.setValue(this.selectedFiles.length);
    this.registrationForm.get('propertyPhotos')?.markAsTouched();
  }

  private isValidImage(file: File) {
    const allowedImgTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; //5MB
    return allowedImgTypes.includes(file.type) && file.size <= maxSize;
  }

  private imageCountValidate(control: any) {
    const fileCount = control.value || 0;
    if (fileCount < this.minFiles) {
      return { minImages: { required: this.minFiles, actual: fileCount } };
    }
    if (fileCount > this.maxFiles) {
      return { maxImages: { max: this.maxFiles, actual: fileCount } };
    }
    return null;
  }

  private amenitiesValidator(control: any) {
    const amenitiesValue = control.value || '';
    if (this.selectedAmenities.length === 0) {
      return { noAmenities: { message: 'Please select at least one amenity' } };
    }
    return null;
  }

  getFilePreview(index: number): string {
    return this.filePreviewUrls[index];
  }

  removeImage(index: number) {
    // Revoke the blob URL to prevent memory leaks
    URL.revokeObjectURL(this.filePreviewUrls[index]);

    this.selectedFiles.splice(index, 1);
    this.filePreviewUrls.splice(index, 1);

    // Update form control with new file count
    this.registrationForm
      .get('propertyPhotos')
      ?.setValue(this.selectedFiles.length);
  }

  // Handle amenity selection
  onAmenityChange(amenity: string, event: any) {
    if (event.target.checked) {
      this.selectedAmenities.push(amenity);
    } else {
      const index = this.selectedAmenities.indexOf(amenity);
      if (index > -1) {
        this.selectedAmenities.splice(index, 1);
      }
    }

    // Update form control with comma-separated string
    this.registrationForm
      .get('ammenities')
      ?.setValue(this.selectedAmenities.join(', '));
  }

  // Handle ammenity selection for pets
  onPetsAmmenityChange(ammenity: string, event: any) {
    if (event.target.checked) {
      this.petsAmmenities.push(ammenity);
    } else {
      const index = this.petsAmmenities.indexOf(ammenity);
      if (index > -1) {
        this.petsAmmenities.splice(index, 1);
      }
    }
    this.registrationForm
      .get('ammenitiesPets')
      ?.setValue(this.petsAmmenities.join(', '));
  }

  nextStep() {
    console.log('Form valid:', this.registrationForm.valid);
    console.log('Form errors:', this.registrationForm.errors);
    console.log('Form value:', this.registrationForm.value);
    console.log('Selected files count:', this.selectedFiles.length);
    console.log('Selected amenities:', this.selectedAmenities);

    // Check individual control errors
    Object.keys(this.registrationForm.controls).forEach((key) => {
      const control = this.registrationForm.get(key);
      if (control?.errors) {
        console.log(`${key} errors:`, control.errors);
      }
    });

    if (this.registrationForm.valid) {
      // Create the property details data with actual files
      const propertyDetailsData = {
        ...this.registrationForm.value,
        propertyPhotos: this.selectedFiles, // Pass the actual File objects
      };

      this.service.updatePropertyDetails(propertyDetailsData);
      this.router.navigate(['/pricing']);
    } else {
      console.error('Form is invalid. Check individual field errors above.');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.registrationForm.controls).forEach((key) => {
      const control = this.registrationForm.get(key);
      control?.markAsTouched();
    });
  }

  prevStep() {
    this.router.navigate(['/petInfo']);
  }
}
