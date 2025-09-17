import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserSignInService {
  private apiUrl = `${environment.apiUrlUserSignIn}`;

  constructor(private http: HttpClient) {}

  getUserSignIn(loginData: any): Observable<any> {
    console.log("Incoming data: ", loginData);
    
    return this.http.post(this.apiUrl, loginData);
  }
}
