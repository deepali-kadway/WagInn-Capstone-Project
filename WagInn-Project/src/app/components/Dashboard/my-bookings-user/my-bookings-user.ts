import { Component, OnInit } from '@angular/core';
import {
  BookingManagementService,
  Booking,
} from '../../../services/booking/booking-management.service';

@Component({
  selector: 'app-my-bookings-user',
  standalone: false,
  templateUrl: './my-bookings-user.html',
  styleUrls: ['./my-bookings-user.css'],
})
export class MyBookingsUser implements OnInit {
  bookings: Booking[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private bookingService: BookingManagementService) {}

  ngOnInit(): void {
    this.loadUserBookings();
  }

  loadUserBookings(): void {
    this.loading = true;
    this.error = '';

    this.bookingService.getUserBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
        console.log('📋 Loaded user bookings:', bookings);
      },
      error: (error) => {
        console.error('❌ Error loading bookings:', error);
        this.error = 'Failed to load your bookings. Please try again.';
        this.loading = false;
      },
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-default';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  calculateDaysBetween(checkIn: string, checkOut: string): number {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
}
