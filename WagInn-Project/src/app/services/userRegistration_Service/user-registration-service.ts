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
    // Send JSON directly, not FormData as backend accepts JSON
    const jsonData = {
      personalInfo: this.userRegistrationData.personalInfo,
      userPetInfo: this.userRegistrationData.userPetInfo,
    };

    // Debug: Log the JSON data being sent
    console.log('JSON data being sent:', jsonData);

    // Send JSON with proper headers
    return this.http.post(this.apiUrl, jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
