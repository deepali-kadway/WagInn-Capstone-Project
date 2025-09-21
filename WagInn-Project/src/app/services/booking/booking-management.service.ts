import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  status: 'confirmed' | 'pending' | 'cancelled';
  confirmationNumber: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingManagementService {
  private bookingsSubject = new BehaviorSubject<Booking[]>([]);
  public bookings$ = this.bookingsSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load bookings from localStorage on service initialization
    this.loadBookingsFromStorage();
  }

  // Get all bookings for current user
  getUserBookings(): Observable<Booking[]> {
    return this.bookings$;
  }

  // Add a new booking
  addBooking(bookingData: any, propertyData: any): Observable<string> {
    const confirmationNumber = this.generateConfirmationNumber();
    const userId = this.getCurrentUserId();

    console.log('🔍 Debug - Creating booking with user ID:', userId);
    console.log(
      '🔍 Debug - Property ID (from booking data):',
      bookingData.propertyId
    );
    console.log('🔍 Debug - Booking data:', bookingData);
    console.log('🔍 Debug - Property data:', propertyData);

    // Check if userId is valid
    if (!userId) {
      const userInfo = localStorage.getItem('USER_INFO');
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          if (user.role === 'host' || user.propertyTitle || user.hostEarnings) {
            console.error(
              '❌ Host account detected - hosts cannot book properties'
            );
            alert(
              'Hosts cannot book properties with their host account. Please log in with a user account to make bookings.'
            );
            throw new Error('Host accounts cannot make bookings');
          }
        } catch (e) {
          // Continue with generic error below
        }
      }

      console.error('❌ No user ID found - user must be logged in to book');
      alert(
        'You must be logged in with a user account to make a booking. Please log in and try again.'
      );
      throw new Error('User not logged in');
    }

    // Validate that we have a property ID
    if (!bookingData.propertyId) {
      console.error('❌ No property ID found in booking data');
      throw new Error('Property ID is required');
    }

    // Prepare booking data for API
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
      '📤 Sending booking payload to API:',
      JSON.stringify(bookingPayload, null, 2)
    );

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>(environment.apiUrlCreateBooking, bookingPayload, { headers })
      .pipe(
        map((response) => {
          if (response.success) {
            // Also save to localStorage as backup
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
          console.error('❌ Error creating booking:', error);
          console.error('❌ Error status:', error.status);
          console.error('❌ Error body:', error.error);

          // Provide more specific error message
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
  }

  // Get booking by confirmation number
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

  // Cancel a booking
  cancelBooking(bookingId: string): boolean {
    const currentBookings = this.bookingsSubject.value;
    const bookingIndex = currentBookings.findIndex(
      (booking) => booking.id === bookingId
    );

    if (bookingIndex !== -1) {
      const updatedBookings = [...currentBookings];
      updatedBookings[bookingIndex].status = 'cancelled';

      this.bookingsSubject.next(updatedBookings);
      this.saveBookingsToStorage(updatedBookings);
      return true;
    }

    return false;
  }

  // Generate unique booking ID
  private generateBookingId(): string {
    return 'BK' + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  // Generate confirmation number
  private generateConfirmationNumber(): string {
    const prefix = 'WI';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  // Save bookings to localStorage
  private saveBookingsToStorage(bookings: Booking[]): void {
    const userId = this.getCurrentUserId();
    if (userId) {
      localStorage.setItem(`bookings_${userId}`, JSON.stringify(bookings));
    }
  }

  // Load bookings from localStorage
  private loadBookingsFromStorage(): void {
    const userId = this.getCurrentUserId();
    if (userId) {
      const storedBookings = localStorage.getItem(`bookings_${userId}`);
      if (storedBookings) {
        try {
          const bookings: Booking[] = JSON.parse(storedBookings);
          this.bookingsSubject.next(bookings);
        } catch (error) {
          console.error('Error loading bookings from storage:', error);
        }
      }
    }
  }

  // Get current user ID from localStorage
  private getCurrentUserId(): string | null {
    console.log('🔍 Checking localStorage for USER_INFO...');
    const userInfo = localStorage.getItem('USER_INFO');
    console.log('🔍 USER_INFO from localStorage:', userInfo);

    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        console.log('🔍 Parsed user object:', user);

        // Check if this is a host token (has host-specific properties)
        if (user.role === 'host' || user.propertyTitle || user.hostEarnings) {
          console.log('❌ Current session is for a HOST, not a USER');
          console.log(
            '❌ Users must log in with a USER account to make bookings'
          );
          return null;
        }

        // Check if this is a user token (has user-specific properties)
        if (
          user.role === 'user' ||
          user.pets ||
          (!user.propertyTitle && !user.hostEarnings)
        ) {
          const userId = user.id || user.email; // Use ID or email as fallback
          console.log('✅ Found USER session, user ID:', userId);
          return userId;
        }

        console.log('⚠️ Unknown user type in localStorage');
        return user.id || user.email;
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }

    console.log('❌ No user info found in localStorage');
    return null;
  }

  // Clear all bookings (for testing)
  clearAllBookings(): void {
    this.bookingsSubject.next([]);
    const userId = this.getCurrentUserId();
    if (userId) {
      localStorage.removeItem(`bookings_${userId}`);
    }
  }

  // Helper method to map API response to Booking interface
  private mapApiBookingToInterface(apiBooking: any): Booking {
    return {
      id: apiBooking.id.toString(),
      propertyId: apiBooking.property_id,
      propertyTitle: apiBooking.property_title,
      propertyType: apiBooking.property_type,
      hostName: apiBooking.host_name,
      location: apiBooking.location,
      checkIn: apiBooking.check_in,
      checkOut: apiBooking.check_out,
      totalNights: apiBooking.total_nights,
      adults: apiBooking.adults,
      children: apiBooking.children,
      infants: apiBooking.infants,
      pets: apiBooking.pets,
      totalPrice: apiBooking.total_price,
      pricePerNight: apiBooking.price_per_night,
      bookingDate: apiBooking.booking_date,
      status: apiBooking.status,
      confirmationNumber: apiBooking.confirmation_number,
    };
  }
}
