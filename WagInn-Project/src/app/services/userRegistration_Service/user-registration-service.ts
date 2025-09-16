import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserRegistrationData } from '../../model/userRegistration.interface';
import { HttpClient } from '@angular/common/http';

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
}
