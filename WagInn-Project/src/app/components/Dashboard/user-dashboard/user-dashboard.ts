import { Component, OnInit } from '@angular/core';
import { UserFetchProperties } from '../../../services/userDashboard/user-fetch-properties';

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

  constructor(private service: UserFetchProperties) {}

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

    const totalGuests =
      this.searchParams.adults +
      this.searchParams.children +
      this.searchParams.infants;
    if (totalGuests === 0) {
      this.searchError = 'At least one guest is required';
      return;
    }

    // Clear previous errors and set loading state
    this.searchError = '';
    this.isSearching = true;
    this.searchResults = [];

    //call service
    this.service.searchProperties(this.searchParams).subscribe({
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
    // Logout logic will be implemented later
  }
}
