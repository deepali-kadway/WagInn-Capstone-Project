import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HostRegistrationServiceTs } from '../../../services/hostRegistration_Service/host-registration.service.ts';

@Component({
  selector: 'app-host-registration-idverification',
  standalone: false,
  templateUrl: './host-registration-idverification.html',
  styleUrl: './host-registration-idverification.css',
})
export class HostRegistrationIDVerification {
  registrationForm!: FormGroup;
  frontId: File | null = null;
  frontIdPreviewUrl: string = '';
  backId: File | null = null;
  backIdPreviewUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: HostRegistrationServiceTs
  ) {
    this.registrationForm = this.fb.group({
      identityPhotosFront: [null, Validators.required],
      identityPhotosBack: [null, Validators.required],
    });
  }

  onFrontIdSelected(event: any) {
    const file = event.target.files[0]; // stores element in a FileList object through which we can access it's metadata.
    //check console for debug
    if (file) {
      console.log('Selected File: ', file.name, file.type, file.size); // metadata
    }

    //clear previous selection
    if (this.frontIdPreviewUrl) {
      URL.revokeObjectURL(this.frontIdPreviewUrl);
    }

    if (file && this.isValidImage(file)) {
      this.frontId = file;
      this.frontIdPreviewUrl = URL.createObjectURL(file);
    } else {
      this.frontId = null;
      this.frontIdPreviewUrl = '';
    }

    this.registrationForm.get('identityPhotosFront')?.setValue(this.frontId);
  }

  onBackIdSelected(event: any) {
    const file = event.target.files[0];

    if (this.backIdPreviewUrl) {
      URL.revokeObjectURL(this.backIdPreviewUrl);
    }

    if (file && this.isValidImage(file)) {
      this.backId = file;
      this.backIdPreviewUrl = URL.createObjectURL(file);
    } else {
      this.backId = null;
      this.backIdPreviewUrl = '';
    }
    this.registrationForm.get('identityPhotosBack')?.setValue(this.frontId);
  }

  private isValidImage(file: File) {
    const allowedImgTypes = ['image/jpg', 'image/png', 'image/jpeg'];
    const maxSize = 5 * 1024 * 1024;
    return allowedImgTypes.includes(file.type) && file.size <= maxSize;
  }

  removeFrontId() {
    if (this.frontIdPreviewUrl) {
      URL.revokeObjectURL(this.frontIdPreviewUrl);
    }
    //assign null & empty to both properties
    this.frontId = null;
    this.frontIdPreviewUrl = '';
  }

  removeBackId() {
    if (this.backIdPreviewUrl) {
      URL.revokeObjectURL(this.backIdPreviewUrl);
    }
    this.backId = null;
    this.backIdPreviewUrl = '';
  }

  getFrontIdPreview(): string {
    return this.frontIdPreviewUrl;
  }

  getBackIdPreview(): string {
    return this.backIdPreviewUrl;
  }

  submitForm() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    } else {
      this.service.updateIdVerification(this.registrationForm.value);
      this.router.navigate([]);
    }
  }
}
