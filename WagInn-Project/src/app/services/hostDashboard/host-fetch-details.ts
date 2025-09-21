import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HostBooking {
  id: string;
  confirmation_number: string;
  property_title: string;
  property_type: string;
  host_name: string;
  location: string;
  check_in: string;
  check_out: string;
  total_nights: number;
  adults: number;
  children: number;
  infants: number;
  pets: number;
  total_price: number;
  price_per_night: number;
  booking_date: string;
  status: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    pets?: {
      id: string;
      petName: string;
      petType: string;
      breed: string;
      size: string;
      age: number;
      isVaccinated: string;
      vaccinations?: any;
      isNeutered: string;
      isFleaTickPrevented: string;
      concerns?: string;
    }[];
  };
}

export interface HostDashboardStats {
  totalProperties: number;
  activeBookings: number;
  lastMonthRevenue: number;
  pendingRequests: number;
}

@Injectable({
  providedIn: 'root',
})
export class HostFetchDetails {
  constructor(private http: HttpClient) {}

  // Get all bookings for a specific host
  getHostBookings(hostId: string): Observable<HostBooking[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any>(`${environment.apiUrlGetHostBookings}/${hostId}`, { headers })
      .pipe(
        map((response) => {
          if (response.success) {
            return response.bookings.map((booking: any) =>
              this.mapBookingFromAPI(booking)
            );
          }
          return [];
        }),
        catchError((error) => {
          console.error('Error fetching host bookings:', error);
          return of([]);
        })
      );
  }

  // Get dashboard statistics for a host
  getHostDashboardStats(hostId: string): Observable<HostDashboardStats> {
    return this.getHostBookings(hostId).pipe(
      map((bookings) => {
        const confirmedBookings = bookings.filter(
          (booking) => booking.status === 'confirmed'
        );
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const lastMonthBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.booking_date);
          return bookingDate >= lastMonth && booking.status === 'completed';
        });

        const lastMonthRevenue = lastMonthBookings.reduce((total, booking) => {
          return total + parseFloat(booking.total_price.toString());
        }, 0);

        return {
          totalProperties: 1, // For now, we'll keep this as 1
          activeBookings: confirmedBookings.length,
          lastMonthRevenue: Math.round(lastMonthRevenue),
          pendingRequests: bookings.filter(
            (booking) => booking.status === 'pending'
          ).length,
        };
      }),
      catchError((error) => {
        console.error('Error calculating dashboard stats:', error);
        return of({
          totalProperties: 1,
          activeBookings: 0,
          lastMonthRevenue: 0,
          pendingRequests: 0,
        });
      })
    );
  }

  // Helper method to map API response to HostBooking interface
  private mapBookingFromAPI(apiBooking: any): HostBooking {
    return {
      id: apiBooking.id.toString(),
      confirmation_number: apiBooking.confirmation_number,
      property_title: apiBooking.property_title,
      property_type: apiBooking.property_type,
      host_name: apiBooking.host_name,
      location: apiBooking.location,
      check_in: apiBooking.check_in,
      check_out: apiBooking.check_out,
      total_nights: apiBooking.total_nights,
      adults: apiBooking.adults,
      children: apiBooking.children,
      infants: apiBooking.infants,
      pets: apiBooking.pets,
      total_price: apiBooking.total_price,
      price_per_night: apiBooking.price_per_night,
      booking_date: apiBooking.booking_date,
      status: apiBooking.status,
      user: apiBooking.user
        ? {
            id: apiBooking.user.id,
            firstName: apiBooking.user.firstName,
            lastName: apiBooking.user.lastName,
            email: apiBooking.user.email,
            phone: apiBooking.user.phone,
            pets: apiBooking.user.pets || [],
          }
        : undefined,
    };
  }

  // Get a specific booking by ID with complete details
  getBookingById(bookingId: string): Observable<HostBooking | null> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .get<any>(`${environment.apiUrlGetBookingDetails}/${bookingId}`, {
        headers,
      })
      .pipe(
        map((response) => {
          if (response.success) {
            return this.mapBookingFromAPI(response.booking);
          }
          return null;
        }),
        catchError((error) => {
          console.error('Error fetching booking details:', error);
          return of(null);
        })
      );
  }

  // Update booking status
  updateBookingStatus(bookingId: string, status: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = { status };

    return this.http
      .put<any>(
        `${environment.apiUrlGetBookingDetails}/${bookingId}/status`,
        body,
        { headers }
      )
      .pipe(
        map((response) => {
          return response.success || false;
        }),
        catchError((error) => {
          console.error('Error updating booking status:', error);
          return of(false);
        })
      );
  }

  // Get current host ID from localStorage
  private getCurrentHostId(): string | null {
    const hostInfo = localStorage.getItem('USER_INFO');
    if (hostInfo) {
      try {
        const host = JSON.parse(hostInfo);
        return host.id || null;
      } catch (error) {
        console.error('Error parsing host info:', error);
      }
    }
    return null;
  }
}
