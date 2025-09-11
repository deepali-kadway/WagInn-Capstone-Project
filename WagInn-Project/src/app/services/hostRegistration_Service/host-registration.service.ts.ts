import { Injectable } from '@angular/core';
import { HostRegistrationData } from '../../model/hostRegistration.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HostRegistrationServiceTs {
  private apiUrl = `${environment.apiUrlHostRegister}`;

  private hostregistrationData: Partial<HostRegistrationData> = {};

  constructor(private http: HttpClient) {}

  //step wise data updates
  updatePersonalInfo(data: any) {
    this.hostregistrationData.personalInfo = data;
  }

  updateAddressDetails(data: any) {
    this.hostregistrationData.addressDetails = data;
  }

  updatePropertyDetails(data: any) {
    this.hostregistrationData.propertyDetails = data;
  }

  updatePetInfo(data: any) {
    this.hostregistrationData.petInfo = data;
  }

  updatePricing(data: any) {
    this.hostregistrationData.pricing = data;
  }

  updateIdVerification(data: any) {
    this.hostregistrationData.idVerification = data;
  }

  //get complete data. Further code: users to edit previous steps.
  getRegistrationData(): Partial<HostRegistrationData> {
    return this.hostregistrationData;
  }

  //submit to backend
  submitRegistration(): Observable<any> {
    const formData = new FormData();

    formData.append(
      'personalInfo',
      JSON.stringify(this.hostregistrationData.personalInfo)
    );
    formData.append(
      'addressDetails',
      JSON.stringify(this.hostregistrationData.addressDetails)
    );
    formData.append(
      'propertyDetails',
      JSON.stringify(this.hostregistrationData.propertyDetails)
    );
    formData.append(
      'petInfo',
      JSON.stringify(this.hostregistrationData.petInfo)
    );
    formData.append(
      'pricing',
      JSON.stringify(this.hostregistrationData.pricing)
    );
    formData.append(
      'idVerification',
      JSON.stringify(this.hostregistrationData.idVerification)
    );

    if (this.hostregistrationData.propertyDetails?.propertyPhotos) {
      this.hostregistrationData.propertyDetails.propertyPhotos.forEach(
        (file, index) => {
          formData.append(`propertyPhoto_${index}`, file);
        }
      );
    }

    if (this.hostregistrationData.idVerification?.frontIdFile) {
      formData.append(
        'frontId',
        this.hostregistrationData.idVerification.frontIdFile
      );
    }

    if (this.hostregistrationData.idVerification?.backIdFile) {
      formData.append(
        'backId',
        this.hostregistrationData.idVerification.backIdFile
      );
    }

    return this.http.post(this.apiUrl, formData);
  }
  clearRegistrationData() {
    this.hostregistrationData = {};
  }
}
