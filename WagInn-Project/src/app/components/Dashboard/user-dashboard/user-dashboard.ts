import { Component, OnInit } from '@angular/core';
import { UserFetchProperties } from '../../../services/userDashboard/user-fetch-properties';
import { Router } from '@angular/router';
import { UserSignInService } from '../../../services/userSignIn_Service/user-sign-in-service';

@Component({
  selector: 'app-user-dashboard',
  standalone: false,
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard implements OnInit {
  // Search parameters
  searchParams = {
    destination: '',
    checkInDate: '',
    checkOutDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  };
  searchResults: any[] = [];
  isSearching: boolean = false;
  searchError: string = '';

  // Navigation state
  activeSection: string = 'dashboard';
  sidebarOpen: boolean = false;

  constructor(
    private service: UserFetchProperties,
    private router: Router,
    private authService: UserSignInService
  ) {}

  // User information (will be populated from auth service later)
  currentUser: any = null;
  ngOnInit(): void {
    const userData = localStorage.getItem('USER_INFO');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  // Get comma-separated pet names
  getPetNames(): string {
    if (!this.currentUser?.pets || this.currentUser.pets.length === 0) {
      return 'No pets registered';
    }
    return this.currentUser.pets.map((pet: any) => pet.petName).join(', ');
  }

  // Called when user clicks on Search button
  onSearch(event: any): void {
    event?.preventDefault();

    // validation checks
    if (!this.searchParams.destination.trim()) {
      this.searchError = 'Please enter a destination';
      return;
    }

    // Convert to numbers to ensure proper addition (HTML forms return strings)
    const totalGuests =
      +this.searchParams.adults +
      +this.searchParams.children +
      +this.searchParams.infants;

    if (totalGuests === 0) {
      this.searchError = 'At least one guest is required';
      return;
    }

    // Clear previous errors and set loading state
    this.searchError = '';
    this.isSearching = true;
    this.searchResults = [];

    // Create search object with properly converted numeric values
    const searchData = {
      destination: this.searchParams.destination,
      adults: +this.searchParams.adults,
      children: +this.searchParams.children,
      infants: +this.searchParams.infants,
      pets: +this.searchParams.pets,
    };

    console.log('Search data being sent:', searchData);

    //call service
    this.service.searchProperties(searchData).subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        this.searchResults = response.properties || response.data || response;
        this.isSearching = false;

        if (this.searchResults.length > 0) {
          // Navigate to search results section
          this.setActiveSection('search-results');
          console.log('Found properties:', this.searchResults);
        } else {
          this.searchError =
            'No properties found matching your criteria. Try adjusting your search.';
        }
      },
      error: (error: any) => {
        console.error('Search failed:', error);
        this.isSearching = false;
        this.searchError =
          error.error?.message || 'Search failed. Please try again later.';
      },
    });
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
    this.closeSidebar(); // Close sidebar when section is selected
  }

  navigateToMyBookings(): void {
    this.closeSidebar();
    this.router.navigate(['/myBookingsUser']);
  }

  toggleSidebar(): void {
    console.log('Toggle sidebar clicked. Current state:', this.sidebarOpen);
    this.sidebarOpen = !this.sidebarOpen;
    console.log('New sidebar state:', this.sidebarOpen);
  }

  closeSidebar(): void {
    console.log('Close sidebar called');
    this.sidebarOpen = false;
  }

  onLogout(): void {
    console.log('Logout clicked');
    this.closeSidebar();

    // Show confirmation dialog
    const confirmLogout = confirm('Are you sure you want to logout?');

    if (confirmLogout) {
      console.log('Logout confirmed, clearing authentication...');

      // Call the logout method from auth service
      this.authService.logout();

      // Clear any additional local storage items that might cause conflicts
      localStorage.clear();
      sessionStorage.clear();

      // Force complete page reload to break any Angular state
      window.location.replace('/userSignIn');

      console.log('User logged out successfully');
    }
  }

  // Display details of select property, send search parameters along with property id
  viewProperty(propertyId: string): void {
    this.router.navigate(['propertyDetailsDashboard', propertyId], {
      queryParams: {
        checkIn: this.searchParams.checkInDate,
        checkOut: this.searchParams.checkOutDate,
        adults: this.searchParams.adults,
        children: this.searchParams.children,
        infants: this.searchParams.infants,
        pets: this.searchParams.pets,
      },
    });
  }

  contactHost(propertyId: string): void {
    console.log('Contact host for property:', propertyId);
  }
}
