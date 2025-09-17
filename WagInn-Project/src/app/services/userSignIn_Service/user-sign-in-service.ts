import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserSignInService {
  private apiUrl = `${environment.apiUrlUserSignIn}`;
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly USER_INFO = 'USER_INFO';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();
  //isAuthenticated$ and currentUser$ are exposed as observables so components can subscribe and react to login/logout automatically

  constructor(private http: HttpClient) {
    //check is user is already logged in on service initialization
    this.checkInitialAuthState();
  }

  getUserSignIn(loginData: any): Observable<any> {
    return this.http
      .post<any>(this.apiUrl, loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        tap((response) => {
          // Handle successful response and JWT token
          if (response.success && response.token) {
            this.doLoginUser(response.token, response.user);
          }
        }),
        catchError(this.handleError)
      ); // Keep your existing error handling;
  }

  // saves token & user in local storage
  // Updates BehaviorSubjects so the UI knows the user is logged in.
  private doLoginUser(token: string, user: any) {
    localStorage.setItem('JWT_TOKEN', token);
    localStorage.setItem('USER_INFO', JSON.stringify(user));
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(user);
  }

  //helper fnction to get token
  public getToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  //helper function to get user
  public getCurrentUser(): any {
    const userInfo = localStorage.getItem(this.USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  //check token is present and call expiry method isTokenExpired
  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  // check token expiration
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); //atob converts the Base64 payload into a raw JSON string (if the input is valid).
      const currentTime = Math.floor(Date.now() / 1000); // JWT timestamps are in SECONDS since Unix epoch, hence divide by 1000
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  private handleError(error: HttpErrorResponse) {
    //parse backend error and return user friendly message
    return throwError(() => ({
      status: error.status,
      code: error.error?.error,
      message: error.error?.message || 'Login Failed',
    }));
  }

  // called at service initialization.
  // If there’s a valid token + user in storage → keep user logged in.
  // Otherwise, clear old data.

  private checkInitialAuthState() {
    const token = this.getToken();
    const user = this.getCurrentUser();

    if (token && user && !this.isTokenExpired(token)) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(user);
    } else {
      this.logout(); //clear invalid expired data
    }
  }

  public logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.USER_INFO);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }
}
