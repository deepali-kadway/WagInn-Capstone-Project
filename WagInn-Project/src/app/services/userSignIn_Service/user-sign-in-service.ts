import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserSignInService {
  private apiUrl = `${environment.apiUrlUserSignIn}`;

  constructor(private http: HttpClient) {}

  getUserSignIn(loginData: any): Observable<any> {
    console.log('Incoming data: ', loginData);

    return this.http
      .post(this.apiUrl, loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    //parse backend error and return user friendly message
    return throwError(() => ({
      status: error.status,
      code: error.error?.error,
      message: error.error?.message || 'Login Failed',
    }));
  }
}
