import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AvailabilityRequest {
  propertyId: string;
  checkIn: string;
  checkOut: string;
}

export interface AvailabilityResponse {
  success: boolean;
  property_id: string;
  check_in?: string;
  check_out?: string;
  is_available?: boolean;
  blocked_dates?: string[];
  conflicting_bookings?: {
    check_in: string;
    check_out: string;
    confirmation_number: string;
    status: string;
  }[];
  message: string;
  total_bookings?: number;
}

@Injectable({
  providedIn: 'root',
})
export class PropertyAvailabilityService {
  private apiUrl = environment.apiUrlCheckAvailability;

  constructor(private http: HttpClient) {}

  /**
   * Check if a property is available for specific dates
   */
  checkAvailability(
    propertyId: string,
    checkIn: string,
    checkOut: string
  ): Observable<AvailabilityResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const params = {
      checkIn: checkIn,
      checkOut: checkOut,
    };

    console.log(`🔍 Checking availability for property ${propertyId}:`, params);

    return this.http
      .get<AvailabilityResponse>(`${this.apiUrl}/${propertyId}`, {
        headers,
        params,
      })
      .pipe(
        map((response) => {
          console.log('✅ Availability response:', response);
          return response;
        }),
        catchError((error) => {
          console.error('❌ Error checking availability:', error);
          return of({
            success: false,
            property_id: propertyId,
            is_available: false,
            message: 'Failed to check availability',
            conflicting_bookings: [],
          });
        })
      );
  }

  /**
   * Get all blocked dates for a property (for calendar display)
   */
  getBlockedDates(propertyId: string): Observable<string[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    console.log(`📅 Getting blocked dates for property ${propertyId}`);

    return this.http
      .get<AvailabilityResponse>(`${this.apiUrl}/${propertyId}`, {
        headers,
      })
      .pipe(
        map((response) => {
          if (response.success && response.blocked_dates) {
            console.log(
              `📅 Found ${response.blocked_dates.length} blocked dates`
            );
            return response.blocked_dates;
          }
          return [];
        }),
        catchError((error) => {
          console.error('❌ Error getting blocked dates:', error);
          return of([]);
        })
      );
  }

  /**
   * Check if multiple properties are available for given dates (for search results)
   */
  checkMultipleAvailability(
    propertyIds: string[],
    checkIn: string,
    checkOut: string
  ): Observable<{ [propertyId: string]: boolean }> {
    const availabilityMap: { [propertyId: string]: boolean } = {};

    // Create an array of availability check observables
    const availabilityChecks = propertyIds.map((propertyId) =>
      this.checkAvailability(propertyId, checkIn, checkOut).pipe(
        map((response) => {
          availabilityMap[propertyId] = response.is_available || false;
          return { propertyId, isAvailable: response.is_available || false };
        })
      )
    );

    // Wait for all checks to complete
    return new Observable((observer) => {
      let completedChecks = 0;

      availabilityChecks.forEach((check) => {
        check.subscribe({
          next: () => {
            completedChecks++;
            if (completedChecks === propertyIds.length) {
              observer.next(availabilityMap);
              observer.complete();
            }
          },
          error: (error) => {
            console.error('Error in batch availability check:', error);
            completedChecks++;
            if (completedChecks === propertyIds.length) {
              observer.next(availabilityMap);
              observer.complete();
            }
          },
        });
      });
    });
  }

  /**
   * Get date range between two dates
   */
  getDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (
      let date = new Date(start);
      date < end;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
  }

  /**
   * Check if a specific date is blocked
   */
  isDateBlocked(date: string, blockedDates: string[]): boolean {
    return blockedDates.includes(date);
  }

  /**
   * Validate date range doesn't overlap with blocked dates
   */
  validateDateRange(
    checkIn: string,
    checkOut: string,
    blockedDates: string[]
  ): { isValid: boolean; blockedDatesInRange: string[] } {
    const requestedDates = this.getDateRange(checkIn, checkOut);
    const blockedDatesInRange = requestedDates.filter((date) =>
      this.isDateBlocked(date, blockedDates)
    );

    return {
      isValid: blockedDatesInRange.length === 0,
      blockedDatesInRange,
    };
  }
}
