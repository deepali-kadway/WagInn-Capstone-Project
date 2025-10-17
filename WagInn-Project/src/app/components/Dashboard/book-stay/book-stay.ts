import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetDetailSelectedProperty } from '../../../services/userDashboard/get-detail-selected-property';
import { BookingManagementService } from '../../../services/booking/booking-management.service';

@Component({
  selector: 'app-book-stay',
  standalone: false,
  templateUrl: './book-stay.html',
  styleUrls: ['./book-stay.css'],
})
export class BookStay implements OnInit {
  property: any = null;
  loading: boolean = true;
  error: string = '';

  // Booking details from query params
  bookingDetails = {
    propertyId: '',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
    totalNights: 0,
    totalPrice: 0,
  };

  // Payment form data
  paymentForm = {
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  };

  // Form validation
  isProcessing: boolean = false;
  currentYear: number = new Date().getFullYear();
  years: number[] = [];
  months: string[] = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: GetDetailSelectedProperty,
    private bookingService: BookingManagementService
  ) {
    // Generate years for expiry dropdown (current year + 10 years)
    for (let i = 0; i < 11; i++) {
      this.years.push(this.currentYear + i);
    }
  }

  ngOnInit(): void {
    // Get property ID from route params
    const propertyId = this.route.snapshot.paramMap.get('propertyId');

    // Get booking details from query params
    this.route.queryParams.subscribe((params) => {
      this.bookingDetails.propertyId = propertyId || '';
      this.bookingDetails.checkIn = params['checkIn'] || '';
      this.bookingDetails.checkOut = params['checkOut'] || '';
      this.bookingDetails.adults = parseInt(params['adults']) || 1;
      this.bookingDetails.children = parseInt(params['children']) || 0;
      this.bookingDetails.infants = parseInt(params['infants']) || 0;
      this.bookingDetails.pets = parseInt(params['pets']) || 0;
      this.bookingDetails.totalNights = parseInt(params['totalNights']) || 0;
      this.bookingDetails.totalPrice = parseFloat(params['totalPrice']) || 0;
    });

    if (propertyId) {
      this.loadPropertyDetails(propertyId);
    } else {
      this.error = 'Property ID not found';
      this.loading = false;
    }
  }

  loadPropertyDetails(propertyId: string): void {
    this.propertyService.getPropertyDetails(propertyId).subscribe({
      next: (response) => {
        console.log('🏠 Property details for booking:', response);
        this.property = response.data || response;

        // Validate that we have all required property fields
        if (
          !this.property.propertyTitle ||
          !this.property.propertyType ||
          !this.property.firstName ||
          !this.property.lastName ||
          !this.property.city ||
          !this.property.province ||
          !this.property.country ||
          !this.property.totalGuestPrice
        ) {
          console.error('❌ Property data is incomplete:', this.property);
          this.error =
            'Property data is incomplete. Cannot proceed with booking.';
        } else {
          console.log('✅ Property data is complete for booking');
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading property for booking:', error);
        this.error = 'Failed to load property details';
        this.loading = false;
      },
    });
  }

  // Format card number with spaces
  formatCardNumber(event: any): void {
    //(\s/g, '') - remove all white space characters; (/[^0-9]/gi, '') - removes all non numeric characters
    // value.match(/.{1,4}/g) - splits the string into groups of 1-4 charcters
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length <= 19) {
      // 16 digits + 3 spaces
      this.paymentForm.cardNumber = formattedValue;
    }
  }

  // Only allow numbers for CVV
  formatCVV(event: any): void {
    let value = event.target.value.replace(/[^0-9]/gi, '');
    if (value.length <= 3) {
      this.paymentForm.cvv = value;
    }
  }

  // Validate form
  isFormValid(): boolean {
    const cardNumberDigits = this.paymentForm.cardNumber.replace(/\s/g, '');
    return (
      cardNumberDigits.length === 16 &&
      this.paymentForm.expiryMonth !== '' &&
      this.paymentForm.expiryYear !== '' &&
      this.paymentForm.cvv.length === 3 &&
      this.paymentForm.cardholderName.trim() !== '' &&
      this.paymentForm.billingAddress.street.trim() !== '' &&
      this.paymentForm.billingAddress.city.trim() !== '' &&
      this.paymentForm.billingAddress.state.trim() !== '' &&
      this.paymentForm.billingAddress.zipCode.trim() !== '' &&
      this.paymentForm.billingAddress.country.trim() !== ''
    );
  }

  // Get card type based on card number
  getCardType(): string {
    const cardNumber = this.paymentForm.cardNumber.replace(/\s/g, '');
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5') || cardNumber.startsWith('2'))
      return 'Mastercard';
    if (cardNumber.startsWith('3')) return 'American Express';
    return 'Unknown';
  }

  // Process payment (mock)
  processPayment(): void {
    if (!this.isFormValid()) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    // Check if user is logged in
    const userInfo = localStorage.getItem('USER_INFO');
    if (!userInfo) {
      alert(
        'You must be logged in to make a booking. Please log in and try again.'
      );
      this.router.navigate(['/userSignIn']);
      return;
    }

    this.isProcessing = true;

    // Mock payment processing delay
    setTimeout(() => {
      console.log('Mock payment processed successfully');
      console.log('Booking Details:', this.bookingDetails);
      console.log('Payment Details:', this.paymentForm);
      console.log('User Info:', JSON.parse(userInfo));

      // Create booking using BookingManagementService
      this.bookingService
        .addBooking(this.bookingDetails, this.property)
        .subscribe({
          next: (confirmationNumber) => {
            this.isProcessing = false;

            // Navigate to confirmation page with confirmation number
            this.router.navigate(['/bookingConfirmation'], {
              queryParams: { confirmation: confirmationNumber },
            });
          },
          error: (error) => {
            console.error('Error creating booking:', error);
            this.isProcessing = false;

            // Handle login required error
            if (error.message && error.message.includes('log in')) {
              alert(
                'You must be logged in to make a booking. Redirecting to login page...'
              );
              this.router.navigate(['/userSignIn']);
              return;
            }

            // Show more specific error message
            let errorMessage = 'Failed to create booking. Please try again.';
            if (error.message && error.message.includes('Bad Request')) {
              errorMessage = error.message;
            } else if (error.message) {
              errorMessage = error.message;
            }

            alert(errorMessage);
          },
        });
    }, 2000); // 2 second delay to simulate processing
  }

  goBack(): void {
    this.router.navigate(
      ['/propertyDetailsDashboard', this.bookingDetails.propertyId],
      {
        queryParams: {
          checkIn: this.bookingDetails.checkIn,
          checkOut: this.bookingDetails.checkOut,
          adults: this.bookingDetails.adults,
          children: this.bookingDetails.children,
          infants: this.bookingDetails.infants,
          pets: this.bookingDetails.pets,
        },
      }
    );
  }
}
