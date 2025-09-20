import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFetchProperties } from '../../../services/userDashboard/user-fetch-properties';
import { GetDetailSelectedProperty } from '../../../services/userDashboard/get-detail-selected-property';

@Component({
  selector: 'app-open-property-details',
  standalone: false,
  templateUrl: './open-property-details.html',
  styleUrl: './open-property-details.css',
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: GetDetailSelectedProperty
  ) {}

  ngOnInit(): void {
    // Get property ID from route params
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
      const timeDiff = checkOut.getTime() - checkIn.getTime();
      this.bookingParams.totalNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (this.property && this.property.totalGuestPrice) {
        this.bookingParams.totalPrice =
          this.bookingParams.totalNights * this.property.totalGuestPrice;
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

    const bookingData = {
      propertyId: this.property.id,
      hostId: this.property.hostId,
      checkInDate: this.bookingParams.checkIn,
      checkOutDate: this.bookingParams.checkOut,
      totalGuests:
        this.bookingParams.adults +
        this.bookingParams.children +
        this.bookingParams.infants,
      adults: this.bookingParams.adults,
      children: this.bookingParams.children,
      infants: this.bookingParams.infants,
      pets: this.bookingParams.pets,
      totalNights: this.bookingParams.totalNights,
      totalPrice: this.bookingParams.totalPrice,
    };

    // For now, just console log - implement booking service later
    console.log('Booking data:', bookingData);
    alert('Booking functionality will be implemented in the next phase');
  }

  goBack(): void {
    this.router.navigate(['/userDashboard']);
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
