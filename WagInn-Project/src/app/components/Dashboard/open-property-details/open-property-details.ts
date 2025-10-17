import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFetchProperties } from '../../../services/userDashboard/user-fetch-properties';
import { GetDetailSelectedProperty } from '../../../services/userDashboard/get-detail-selected-property';
import { PropertyAvailabilityService } from '../../../services/availability/property-availability.service';

@Component({
  selector: 'app-open-property-details',
  standalone: false,
  templateUrl: './open-property-details.html',
  styleUrls: ['./open-property-details.css'],
})
export class OpenPropertyDetails implements OnInit {
  property: any = null;
  loading: boolean = true;
  error: string = '';

  // Booking parameters from search
  bookingParams = {
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
    totalNights: 0,
    totalPrice: 0,
  };

  // Image carousel state
  currentImageIndex = 0;
  images: string[] = [];

  // Blocked dates for availability
  blockedDates: string[] = [];
  loadingDates: boolean = false;

  // Calendar display
  currentMonth: Date = new Date(); // Current displayed month
  calendarDates: any[] = []; // Array of date objects
  showCalendar: boolean = false; // Calendar visibility

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: GetDetailSelectedProperty,
    private availabilityService: PropertyAvailabilityService
  ) {}

  ngOnInit(): void {
    // Initialize calendar to current month
    this.currentMonth = new Date();

    // Get property ID from route params
    // .snapshot - provide static snapshot of route information at the time of access. Used when ypu need route data once and don't need to react to changes
    // .paramMap - contains all route parameters from the URL path
    const propertyId = this.route.snapshot.paramMap.get('id');

    // Get booking parameters from query params
    this.route.queryParams.subscribe((params) => {
      this.bookingParams.checkIn = params['checkIn'] || '';
      this.bookingParams.checkOut = params['checkOut'] || '';
      this.bookingParams.adults = parseInt(params['adults']) || 1;
      this.bookingParams.children = parseInt(params['children']) || 0;
      this.bookingParams.infants = parseInt(params['infants']) || 0;
      this.bookingParams.pets = parseInt(params['pets']) || 0;

      this.calculateStayDetails();
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
        this.property = response.data || response;
        this.setupImages();
        this.calculateStayDetails();
        this.loadBlockedDates(propertyId); // Load blocked dates
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading property details:', error);
        this.error = 'Failed to load property details';
        this.loading = false;
      },
    });
  }

  setupImages(): void {
    // Handle property photos with proper error checking
    this.images = [];

    if (this.property && this.property.propertyPhotos) {
      try {
        let photos: string[] = [];

        // If it's already an array, use it directly
        if (Array.isArray(this.property.propertyPhotos)) {
          photos = this.property.propertyPhotos;
        }
        // If it's a string, try to parse it
        else if (
          typeof this.property.propertyPhotos === 'string' &&
          this.property.propertyPhotos.trim()
        ) {
          photos = JSON.parse(this.property.propertyPhotos);
        }

        // Ensure photos is an array and filter out empty strings
        if (Array.isArray(photos)) {
          this.images = photos
            .filter((photo) => photo && photo.trim())
            .map(
              (photo: string) =>
                `http://localhost:8080/uploads/property-photos/${photo.trim()}`
            );
        }

        console.log('Processed images:', this.images);
      } catch (e) {
        console.error('Error parsing property photos:', e);
        console.log('Raw propertyPhotos data:', this.property.propertyPhotos);
        this.images = [];
      }
    }

    // If no images found, add a placeholder
    if (this.images.length === 0) {
      this.images = ['assets/images/placeholder-property.svg'];
    }
  }

  calculateStayDetails(): void {
    if (this.bookingParams.checkIn && this.bookingParams.checkOut) {
      const checkIn = new Date(this.bookingParams.checkIn);
      const checkOut = new Date(this.bookingParams.checkOut);

      if (checkOut > checkIn) {
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        //ceil - rounds a number up to nearest whole number
        this.bookingParams.totalNights = Math.ceil(
          timeDiff / (1000 * 3600 * 24)
        );

        if (this.property && this.property.totalGuestPrice) {
          this.bookingParams.totalPrice =
            this.bookingParams.totalNights * this.property.totalGuestPrice;
        }
      } else {
        this.bookingParams.totalNights = 0;
        this.bookingParams.totalPrice = 0;
      }
    }
  }

  // Image carousel methods
  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }

  prevImage(): void {
    this.currentImageIndex =
      this.currentImageIndex === 0
        ? this.images.length - 1
        : this.currentImageIndex - 1;
  }

  goToImage(index: number): void {
    this.currentImageIndex = index;
  }

  // Booking methods
  bookNow(): void {
    if (!this.bookingParams.checkIn || !this.bookingParams.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    // Validate dates are not blocked
    if (this.isDateDisabled(this.bookingParams.checkIn)) {
      alert('Check-in date is not available. Please select a different date.');
      return;
    }

    if (this.isDateDisabled(this.bookingParams.checkOut)) {
      alert('Check-out date is not available. Please select a different date.');
      return;
    }

    // Navigate to booking page with all necessary data
    this.router.navigate(['/bookStay', this.property.id], {
      queryParams: {
        checkIn: this.bookingParams.checkIn,
        checkOut: this.bookingParams.checkOut,
        adults: this.bookingParams.adults,
        children: this.bookingParams.children,
        infants: this.bookingParams.infants,
        pets: this.bookingParams.pets,
        totalNights: this.bookingParams.totalNights,
        totalPrice: this.bookingParams.totalPrice,
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/userDashboard']);
  }

  // Load blocked dates for the property
  loadBlockedDates(propertyId: string): void {
    this.loadingDates = true;
    this.availabilityService.getBlockedDates(propertyId).subscribe({
      next: (blockedDates) => {
        this.blockedDates = blockedDates;
        this.loadingDates = false;
        if (this.showCalendar) {
          this.generateCalendar(); // Refresh calendar with blocked dates
        }
      },
      error: (error) => {
        console.error('Error loading blocked dates:', error);
        this.loadingDates = false;
      },
    });
  }

  // Check if a date should be disabled
  isDateDisabled(date: string): boolean {
    if (!date) return false;
    return this.blockedDates.includes(date);
  }

  // Get current date for min attribute
  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Get minimum checkout date (day after check-in)
  getMinCheckoutDate(): string {
    if (this.bookingParams.checkIn) {
      const checkIn = new Date(this.bookingParams.checkIn);
      checkIn.setDate(checkIn.getDate() + 1);
      return checkIn.toISOString().split('T')[0];
    }
    return this.getCurrentDate();
  }

  // Calendar methods
  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      this.generateCalendar();
    }
  }

  generateCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const today = new Date();

    console.log('Generating calendar for:', year, month + 1, 'Today:', today);

    // Get first day of month and how many days in month. Months marked from 0
    const firstDay = new Date(year, month, 1); // (2025, 8, 1) - 1st Sept 2025
    const lastDay = new Date(year, month + 1, 0); // (2025, 9, 0) - This is 9th is October, but since 0 it will return 1 day before 1st Oct
    const daysInMonth = lastDay.getDate(); // 30
    const startDate = firstDay.getDay(); // 0 = Sunday, 1 = Monday. Sept starts on Monday so 1.

    this.calendarDates = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startDate; i++) {
      this.calendarDates.push({ day: '', isCurrentMonth: false });
      //Loop from 0 to starting day. If Sept 1st is monday, create 1 empty cell for Sunday.
      // day: '' is empty sting - no day number to display
      // isCurrentMonth: false - marks as not part of current month (for styling)
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      //year: 2025, month:09 (add 0 using padstart) - day: 01 (add 0 using padstart)
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
      // thus dateStr = "2025-09-01"

      const currentDate = new Date(year, month, day);
      const isBlocked = this.blockedDates.includes(dateStr); // check if current date is in blockedArray
      const isToday = this.isSameDate(currentDate, today);
      const isPast = currentDate < today && !isToday; // Past but not today

      this.calendarDates.push({
        day: day, //say 15, day number
        dateStr: dateStr, // "2025-09-25". ISO date string
        isCurrentMonth: true, //part of displayed month
        isBlocked: isBlocked, //false, blocked by other bookings
        isToday: isToday, // false, if it;s todays date
        isPast: isPast, // false, is before today
        isSelected:
          dateStr === this.bookingParams.checkIn ||
          dateStr === this.bookingParams.checkOut,
      });
    }

    console.log(
      'Generated calendar dates:',
      this.calendarDates.length,
      'dates'
    );
  }

  // Helper method to compare dates accurately
  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  selectDate(dateObj: any): void {
    console.log('Date clicked:', dateObj);

    // Don't allow selection of past dates, today, blocked dates, or dates from other months
    if (
      !dateObj.isCurrentMonth ||
      dateObj.isPast ||
      dateObj.isToday ||
      dateObj.isBlocked
    ) {
      console.log('Date selection blocked:', {
        isCurrentMonth: dateObj.isCurrentMonth,
        isPast: dateObj.isPast,
        isToday: dateObj.isToday,
        isBlocked: dateObj.isBlocked,
      });
      return;
    }

    console.log('Date selection allowed');

    // If no check-in selected, set as check-in
    if (!this.bookingParams.checkIn) {
      this.bookingParams.checkIn = dateObj.dateStr;
      console.log('Check-in set to:', dateObj.dateStr);
    }
    // If check-in selected but no check-out, set as check-out
    else if (!this.bookingParams.checkOut) {
      if (new Date(dateObj.dateStr) > new Date(this.bookingParams.checkIn)) {
        this.bookingParams.checkOut = dateObj.dateStr;
        console.log('Check-out set to:', dateObj.dateStr);
        this.calculateStayDetails(); // Calculate stay details when both dates are selected
      } else {
        // If selected date is before check-in, reset and set as new check-in
        this.bookingParams.checkIn = dateObj.dateStr;
        this.bookingParams.checkOut = '';
        console.log('Reset - new check-in set to:', dateObj.dateStr);
      }
    }
    // If both selected, reset and start over
    else {
      this.bookingParams.checkIn = dateObj.dateStr;
      this.bookingParams.checkOut = '';
      console.log(
        'Both dates were selected - reset, new check-in:',
        dateObj.dateStr
      );
    }

    this.generateCalendar(); // Refresh to update selected dates
  }

  nextMonth(): void {
    console.log('Next month clicked - current month:', this.currentMonth);
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    console.log('New month set to:', this.currentMonth);
    this.generateCalendar();
  }

  prevMonth(): void {
    console.log('Previous month clicked - current month:', this.currentMonth);
    const today = new Date();
    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    const prevMonthStart = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );

    console.log('Today:', today);
    console.log('Current month start:', currentMonthStart);
    console.log('Previous month start:', prevMonthStart);

    // Don't allow going to months before current month
    if (prevMonthStart >= currentMonthStart) {
      this.currentMonth = prevMonthStart;
      console.log('Allowed to go to previous month:', this.currentMonth);
      this.generateCalendar();
    } else {
      console.log('Not allowed to go to previous month');
    }
  }

  getMonthYear(): string {
    return this.currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  contactHost(): void {
    console.log('Contact host for property:', this.property.id);
    // TODO: Implement host contact functionality
    alert('Host contact functionality will be implemented in the next phase');
  }

  // Image error handler
  onImageError(event: any): void {
    console.log('Image failed to load:', event.target.src);
    // Set a placeholder image when the original fails to load
    event.target.src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zNWVtIj5Qcm9wZXJ0eSBJbWFnZSBOb3QgQXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K';
  }
}
