import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BookingManagementService,
  Booking,
} from '../../../services/booking/booking-management.service';

@Component({
  selector: 'app-booking-confirmation',
  standalone: false,
  templateUrl: './booking-confirmation.html',
  styleUrls: ['./booking-confirmation.css'],
})
export class BookingConfirmation implements OnInit {
  booking: Booking | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingManagementService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const confirmationNumber = params['confirmation'];

      if (confirmationNumber) {
        this.loadBookingDetails(confirmationNumber);
      } else {
        this.error = 'No confirmation number provided';
        this.loading = false;
      }
    });
  }

  private loadBookingDetails(confirmationNumber: string): void {
    this.bookingService.getBookingByConfirmation(confirmationNumber).subscribe({
      next: (booking: Booking | null) => {
        if (booking) {
          this.booking = booking;
        } else {
          this.error =
            'Booking not found with the provided confirmation number';
        }
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Error loading booking details';
        console.error('Error loading booking:', error);
        this.loading = false;
      },
    });
  }

  viewAllBookings(): void {
    this.router.navigate(['myBookings']);
  }

  backToDashboard(): void {
    this.router.navigate(['/userDashboard']);
  }

  printConfirmation(): void {
    window.print();
  }

  shareBooking(): void {
    if (this.booking) {
      const shareText = `My WagInn booking confirmation:\n\nProperty: ${
        this.booking.propertyTitle
      }\nLocation: ${this.booking.location}\nCheck-in: ${new Date(
        this.booking.checkIn
      ).toLocaleDateString()}\nCheck-out: ${new Date(
        this.booking.checkOut
      ).toLocaleDateString()}\nConfirmation: ${
        this.booking.confirmationNumber
      }`;

      if (navigator.share) {
        navigator
          .share({
            title: 'WagInn Booking Confirmation',
            text: shareText,
            url: window.location.href,
          })
          .catch((err) => console.log('Error sharing:', err));
      } else {
        navigator.clipboard
          .writeText(shareText)
          .then(() => {
            alert('Booking details copied to clipboard!');
          })
          .catch((err) => {
            console.log('Error copying to clipboard:', err);
            alert(`Share this booking:\n\n${shareText}`);
          });
      }
    }
  }
}
