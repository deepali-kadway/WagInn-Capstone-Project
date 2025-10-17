import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HostFetchDetails,
  HostBooking,
} from '../../../services/hostDashboard/host-fetch-details';

@Component({
  selector: 'app-host-booking-details',
  standalone: false,
  templateUrl: './host-booking-details.html',
  styleUrls: ['./host-booking-details.css'],
})
export class HostBookingDetails implements OnInit {
  booking: HostBooking | null = null;
  loading: boolean = true;
  error: string | null = null;
  bookingId: string = '';

  // Check if booking can be completed (checkout date has passed)
  canCompleteBooking: boolean = false;
  completingBooking: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hostService: HostFetchDetails
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.bookingId = params['bookingId'];
      if (this.bookingId) {
        this.loadBookingDetails();
      } else {
        this.error = 'Invalid booking ID';
        this.loading = false;
      }
    });
  }

  loadBookingDetails(): void {
    this.loading = true;
    this.error = null;

    this.hostService.getBookingById(this.bookingId).subscribe({
      next: (booking) => {
        if (booking) {
          this.booking = booking;
          this.checkIfCanCompleteBooking();
        } else {
          this.error = 'Booking not found';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading booking details:', error);
        this.error = 'Failed to load booking details';
        this.loading = false;
      },
    });
  }

  checkIfCanCompleteBooking(): void {
    if (!this.booking) return;

    const checkoutDate = new Date(this.booking.check_out);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for date comparison
    checkoutDate.setHours(0, 0, 0, 0);

    // Can complete if checkout date has passed and status is confirmed
    this.canCompleteBooking =
      checkoutDate <= today && this.booking.status === 'confirmed';
  }

  completeBooking(): void {
    if (!this.booking || !this.canCompleteBooking) return;

    this.completingBooking = true;

    this.hostService
      .updateBookingStatus(this.booking.id, 'completed')
      .subscribe({
        next: (success) => {
          if (success) {
            // Update local booking status
            if (this.booking) {
              this.booking.status = 'completed';
              this.canCompleteBooking = false;
            }
            alert('Booking marked as completed successfully!');
          } else {
            alert('Failed to complete booking. Please try again.');
          }
          this.completingBooking = false;
        },
        error: (error) => {
          console.error('Error completing booking:', error);
          alert('Error completing booking. Please try again.');
          this.completingBooking = false;
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/hostDashboard']);
  }

  // Helper methods for display
  getGuestName(): string {
    if (this.booking?.user) {
      return `${this.booking.user.firstName} ${this.booking.user.lastName}`;
    }
    return 'Unknown Guest';
  }

  getPetNames(): string {
    if (this.booking?.user?.pets && this.booking.user.pets.length > 0) {
      return this.booking.user.pets.map((pet) => pet.petName).join(', ');
    }
    return 'No pets';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getStatusClass(): string {
    if (!this.booking) return '';

    switch (this.booking.status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  }

  // Helper method to check if user has pets
  hasPets(): boolean {
    return this.booking?.user?.pets ? this.booking.user.pets.length > 0 : false;
  }

  // Helper method to get user pets safely
  getUserPets(): any[] {
    return this.booking?.user?.pets || [];
  }

  // Helper method to get pets count
  getPetsCount(): number {
    return this.booking?.user?.pets?.length || 0;
  }

  // Helper method to get user phone safely
  getUserPhone(): string | undefined {
    return this.booking?.user?.phone;
  }

  // Helper method to check if value is an array
  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}
