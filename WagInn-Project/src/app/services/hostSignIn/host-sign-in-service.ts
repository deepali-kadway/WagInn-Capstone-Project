import { Injectable } from '@angular/core';
import { HostSignInData } from '../../model/hostSignIn.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HostSignInService {
  private apiUrl = `${environment.apiUrlHostSignIn}`;
  constructor(private http: HttpClient) {}

  getHostSignIn(loginData: any): Observable<any> {
    return this.http.post(this.apiUrl, loginData);
  }
}
