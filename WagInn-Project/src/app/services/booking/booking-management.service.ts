import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { PropertyAvailabilityService } from '../availability/property-availability.service';

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyType: string;
  hostName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  adults: number;
  children: number;
  infants: number;
  pets: number;
  totalPrice: number;
  pricePerNight: number;
  bookingDate: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  confirmationNumber: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingManagementService {
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  public bookings$ = this.bookingsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private availabilityService: PropertyAvailabilityService
  ) {
    this.loadBookingsFromStorage();
  }

  // Get all bookings for current user
  getUserBookings(): Observable<Booking[]> {
    // First return local bookings for immediate display
    const localBookings = this.bookings$;

    // Also fetch fresh data from API
    this.fetchUserBookingsFromAPI();

    return localBookings;
  }

  fetchUserBookingsFromAPI(): void {
    try {
      const userId = this.getCurrentUserId();
      const url = `${environment.apiUrlGetUserBookings}/${userId}`;

      console.log('🔍 Fetching user bookings from API:', url);

      this.http.get<any>(url).subscribe({
        next: (response) => {
          console.log('📋 API Response for user bookings:', response);

          if (response.success && response.bookings) {
            // Transform API response to match our Booking interface
            const bookings: Booking[] = response.bookings.map(
              (booking: any) => ({
                id: booking.id,
                propertyId: booking.property_id,
                propertyTitle: booking.property_title,
                propertyType: booking.property_type,
                hostName: booking.host_name,
                location: booking.location,
                checkIn: booking.check_in,
                checkOut: booking.check_out,
                totalNights: booking.total_nights,
                adults: booking.adults,
                children: booking.children || 0,
                infants: booking.infants || 0,
                pets: booking.pets || 0,
                totalPrice: booking.total_price,
                pricePerNight: booking.price_per_night,
                bookingDate: booking.booking_date || booking.createdAt,
                status: booking.status,
                confirmationNumber: booking.confirmation_number,
              })
            );

            // Update the subject with fresh data
            this.bookingsSubject.next(bookings);

            // Also save to localStorage for offline access
            this.saveBookingsToStorage(bookings);

            console.log('✅ Updated bookings from API:', bookings);
          }
        },
        error: (error) => {
          console.error('❌ Error fetching user bookings from API:', error);
          // If API fails, we'll still show local bookings
        },
      });
    } catch (error) {
      console.error('❌ Error getting user ID for bookings fetch:', error);
      // If user not logged in, we'll still show local bookings (empty)
    }
  }

  // Add new booking
  addBooking(bookingData: any, propertyData: any): Observable<string> {
    const confirmationNumber = this.generateConfirmationNumber();

    let userId: string;
    try {
      userId = this.getCurrentUserId();
    } catch (error) {
      console.error('User not logged in:', error);
      return throwError(() => new Error('Please log in to make a booking'));
    }

    console.log('🔍 Debug - Creating booking with user ID:', userId);

    if (!bookingData.propertyId) {
      console.error('❌ No property ID found in booking data');
      throw new Error('Property ID is required');
    }

    console.log('🔍 Checking property availability before creating booking...');

    return this.availabilityService
      .checkAvailability(
        bookingData.propertyId,
        bookingData.checkIn,
        bookingData.checkOut
      )
      .pipe(
        switchMap((availabilityResponse) => {
          if (
            !availabilityResponse.success ||
            !availabilityResponse.is_available
          ) {
            const errorMessage =
              'Property is not available for the selected dates.';
            console.error(errorMessage);
            alert(
              'Sorry, this property is not available for your selected dates. Please choose different dates.'
            );
            throw new Error('Property not available for selected dates');
          }

          console.log(
            ' Property is available, proceeding with booking creation...'
          );

          const bookingPayload = {
            user_id: userId,
            property_id: bookingData.propertyId,
            confirmation_number: confirmationNumber,
            property_title: propertyData.propertyTitle,
            property_type: propertyData.propertyType,
            host_name: `${propertyData.firstName} ${propertyData.lastName}`,
            location: `${propertyData.city}, ${propertyData.province}, ${propertyData.country}`,
            check_in: bookingData.checkIn,
            check_out: bookingData.checkOut,
            total_nights: bookingData.totalNights,
            adults: bookingData.adults,
            children: bookingData.children,
            infants: bookingData.infants,
            pets: bookingData.pets,
            total_price: bookingData.totalPrice,
            price_per_night: propertyData.totalGuestPrice,
            status: 'confirmed',
          };

          console.log(
            ' Sending booking payload to API:',
            JSON.stringify(bookingPayload, null, 2)
          );

          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
          });

          return this.http
            .post<any>(environment.apiUrlCreateBooking, bookingPayload, {
              headers,
            })
            .pipe(
              map((response) => {
                if (response.success) {
                  const newBooking: Booking = {
                    id: response.booking.id.toString(),
                    propertyId: bookingData.propertyId,
                    propertyTitle: propertyData.propertyTitle,
                    propertyType: propertyData.propertyType,
                    hostName: `${propertyData.firstName} ${propertyData.lastName}`,
                    location: `${propertyData.city}, ${propertyData.province}, ${propertyData.country}`,
                    checkIn: bookingData.checkIn,
                    checkOut: bookingData.checkOut,
                    totalNights: bookingData.totalNights,
                    adults: bookingData.adults,
                    children: bookingData.children,
                    infants: bookingData.infants,
                    pets: bookingData.pets,
                    totalPrice: bookingData.totalPrice,
                    pricePerNight: propertyData.totalGuestPrice,
                    bookingDate: new Date().toISOString(),
                    status: 'confirmed',
                    confirmationNumber: confirmationNumber,
                  };

                  const currentBookings = this.bookingsSubject.value;
                  const updatedBookings = [...currentBookings, newBooking];
                  this.bookingsSubject.next(updatedBookings);
                  this.saveBookingsToStorage(updatedBookings);

                  return confirmationNumber;
                } else {
                  throw new Error('Failed to create booking');
                }
              }),
              catchError((error) => {
                console.error(' Error creating booking:', error);
                let errorMessage = 'Failed to create booking';
                if (error.status === 400) {
                  errorMessage = `Bad Request: ${
                    error.error?.message || 'Invalid data provided'
                  }`;
                } else if (error.status === 500) {
                  errorMessage = 'Server error occurred while creating booking';
                }
                throw new Error(errorMessage);
              })
            );
        }),
        catchError((error) => {
          console.error(
            ' Error checking availability or creating booking:',
            error
          );
          return throwError(() => error);
        })
      );
  }

  getBookingByConfirmation(
    confirmationNumber: string
  ): Observable<Booking | null> {
    return this.http
      .get<any>(
        `${environment.apiUrlGetBookingByConfirmation}/${confirmationNumber}`
      )
      .pipe(
        map((response) => {
          if (response.success && response.booking) {
            return this.mapApiBookingToInterface(response.booking);
          }
          return null;
        }),
        catchError((error) => {
          console.error('Error fetching booking by confirmation:', error);
          // Fallback to localStorage
          const bookings = this.bookingsSubject.value;
          const booking =
            bookings.find(
              (booking) => booking.confirmationNumber === confirmationNumber
            ) || null;
          return of(booking);
        })
      );
  }

  private generateConfirmationNumber(): string {
    const prefix = 'WI';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  private getCurrentUserId(): string {
    const userInfo = localStorage.getItem('USER_INFO');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        return user.id || user.user_id || user.userId;
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }

    // If no user info found, throw an error instead of using guest_user
    throw new Error('User not logged in. Please log in to make a booking.');
  }

  private saveBookingsToStorage(bookings: Booking[]): void {
    localStorage.setItem('userBookings', JSON.stringify(bookings));
  }

  private loadBookingsFromStorage(): void {
    const savedBookings = localStorage.getItem('userBookings');
    if (savedBookings) {
      try {
        const bookings = JSON.parse(savedBookings);
        this.bookingsSubject.next(bookings);
      } catch (error) {
        console.error('Error loading bookings from storage:', error);
      }
    }
  }

  private mapApiBookingToInterface(apiBooking: any): Booking {
    return {
      id: apiBooking.id?.toString() || this.generateBookingId(),
      propertyId: apiBooking.property_id,
      propertyTitle: apiBooking.property_title || '',
      propertyType: apiBooking.property_type || '',
      hostName: apiBooking.host_name || '',
      location: apiBooking.location || '',
      checkIn: apiBooking.check_in,
      checkOut: apiBooking.check_out,
      totalNights: apiBooking.total_nights || 0,
      adults: apiBooking.adults || 0,
      children: apiBooking.children || 0,
      infants: apiBooking.infants || 0,
      pets: apiBooking.pets || 0,
      totalPrice: apiBooking.total_price || 0,
      pricePerNight: apiBooking.price_per_night || 0,
      bookingDate: apiBooking.created_at || new Date().toISOString(),
      status: apiBooking.status || 'confirmed',
      confirmationNumber: apiBooking.confirmation_number || '',
    };
  }

  private generateBookingId(): string {
    return 'BK' + Date.now() + Math.random().toString(36).substr(2, 9);
  }
}
