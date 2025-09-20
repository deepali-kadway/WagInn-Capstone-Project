import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserFetchProperties {
  private apiUrl = `${environment.apiUrlFetchProperty}`;

  constructor(private http: HttpClient) {}

  searchProperties(searchParams: any): Observable<any> {
    const totalGuests =
      searchParams.adults + searchParams.children + searchParams.infants;

    const params = new HttpParams()
      .set('destination', searchParams.destination)
      .set('totalGuests', totalGuests.toString())
      .set('pets', searchParams.pets.toString());

    return this.http.get(this.apiUrl, { params });
  }
}
