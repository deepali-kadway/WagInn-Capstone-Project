import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserRegistrationData } from '../../model/userRegistration.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserRegistrationService {
  private apiUrl = `${environment.apiUrlUserRegister}`;

  private userRegistrationData: Partial<UserRegistrationData> = {};

  constructor(private http: HttpClient) {}

  //step wise data update
  updatePersonalInfo(data: any) {
    this.userRegistrationData.personalInfo = data;
  }

  updatePetInfo(data: any) {
    this.userRegistrationData.userPetInfo = data;
  }

  submitRegistration(): Observable<any> {
    const formData = new FormData();

    // Add data to FormData first
    formData.append(
      'personalInfo',
      JSON.stringify(this.userRegistrationData.personalInfo)
    );
    formData.append(
      'userPetInfo',
      JSON.stringify(this.userRegistrationData.userPetInfo)
    );

    // Debug: Log the raw data before FormData
    console.log('Raw registration data:', this.userRegistrationData);

    // Debug: Log FormData contents (after data is added)
    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    return this.http.post(this.apiUrl, formData);
  }
}
