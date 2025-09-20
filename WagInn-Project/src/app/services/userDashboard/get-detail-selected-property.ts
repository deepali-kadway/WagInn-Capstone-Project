import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GetDetailSelectedProperty {
  private apiUrl = `${environment.apiUrlFetchProperty}`;

  constructor(private http: HttpClient) {}

  //method to fetch single property detail
  getPropertyDetails(propertyId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${propertyId}`);
  }

  // method for booking (future implementation)
  // createBooking(bookingData: any): Observable<any> {
  //   return this.http.post(`${environment.apiUrlBooking}`, bookingData);
  // }
}
