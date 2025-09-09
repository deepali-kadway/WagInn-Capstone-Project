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

  // File upload properties
  selectedFiles: File[] = [];
  filePreviewUrls: string[] = [];
  maxFiles = 10;
  minFiles = 5;

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

  nextStep() {
    this.router.navigate(['pricing']);
  }
  prevStep() {
    this.router.navigate(['petInfo']);
  }
}
