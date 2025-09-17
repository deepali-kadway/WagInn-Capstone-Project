import { Injectable } from '@angular/core';
import { HostSignInData } from '../../model/hostSignIn.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HostSignInService {
  private apiUrl = `${environment.apiUrlHostSignIn}`;
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly USER_INFO = 'USER_INFO';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already logged in on service initialization
    this.checkInitialAuthState();
  }

  getHostSignIn(loginData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, loginData).pipe(
      tap((response) => {
        if (response.success && response.token) {
          this.doLoginHost(response.token, response.user);
        }
      })
    );
  }

  private doLoginHost(token: string, user: any) {
    // console.log('🎯 Login response received:', response);
    // console.log('✅ Token found in response, storing...');
    localStorage.setItem('JWT_TOKEN', token);
    localStorage.setItem('USER_INFO', JSON.stringify(user));
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(user);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  public getCurrentUser(): any {
    const userInfo = localStorage.getItem(this.USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    return !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); //atob converts the Base64 payload into a raw JSON string (if the input is valid).
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true; // If can't decode, consider expired
    }
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
      this.logout(); // Clear invalid/expired data
    }
  }

  public logout() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.USER_INFO);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }
}
