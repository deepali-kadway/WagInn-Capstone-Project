import { Component, OnInit } from '@angular/core';
import {
  HostFetchDetails,
  HostBooking,
  HostDashboardStats,
} from '../../../services/hostDashboard/host-fetch-details';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host-dashboard',
  standalone: false,
  templateUrl: './host-dashboard.html',
  styleUrl: './host-dashboard.css',
})
export class HostDashboard implements OnInit {
  // Navigation state
  activeSection: string = 'dashboard';
  sidebarOpen: boolean = false;

  // Host information (populated from auth service later)
  currentHost: any = null;

  // Dashboard stats (will be populated from API)
  dashboardStats: HostDashboardStats = {
    totalProperties: 1,
    activeBookings: 0,
    lastMonthRevenue: 0,
    pendingRequests: 0,
  };

  // Booking data (will come from backend)
  recentBookings: HostBooking[] = [];
  loadingBookings: boolean = false;
  bookingsError: string | null = null;

  constructor(private service: HostFetchDetails, private router: Router) {}

  ngOnInit(): void {
    const hostData = localStorage.getItem('USER_INFO');
    if (hostData) {
      this.currentHost = JSON.parse(hostData);
      this.loadHostData();
    }
  }

  // Load host dashboard data
  private loadHostData(): void {
    if (!this.currentHost?.id) {
      this.bookingsError = 'Host information not found';
      return;
    }

    this.loadingBookings = true;
    this.bookingsError = null;

    // Load dashboard statistics (commented out - UI section disabled)
    // this.service.getHostDashboardStats(this.currentHost.id).subscribe({
    //   next: (stats) => {
    //     this.dashboardStats = stats;
    //   },
    //   error: (error) => {
    //     console.error('Error loading dashboard stats:', error);
    //   },
    // });

    // Load host bookings
    this.service.getHostBookings(this.currentHost.id).subscribe({
      next: (bookings) => {
        console.log('Received bookings:', bookings);
        bookings.forEach((booking) => {
          console.log('Booking user:', booking.user);
          console.log('User pets:', booking.user?.pets);
        });
        this.recentBookings = bookings;
        this.loadingBookings = false;
      },
      error: (error) => {
        console.error('Error loading host bookings:', error);
        this.bookingsError = 'Failed to load bookings';
        this.loadingBookings = false;
      },
    });
  }

  // Helper method to get guest name from booking
  getGuestName(booking: HostBooking): string {
    if (booking.user) {
      return `${booking.user.firstName} ${booking.user.lastName}`;
    }
    return 'Guest Information Not Available';
  }

  // Helper method to get pet info
  getPetInfo(booking: HostBooking): string {
    console.log('getPetInfo called with booking:', booking);
    console.log('booking.user:', booking.user);
    console.log('booking.user?.pets:', booking.user?.pets);
    console.log('booking.pets count:', booking.pets);

    // Check if user has pets data from the API
    if (booking.user?.pets && booking.user.pets.length > 0) {
      const petNames = booking.user.pets.map((pet) => pet.petName).join(', ');
      console.log('Pet names found:', petNames);
      return `${petNames} (${booking.user.pets.length} pet${
        booking.user.pets.length > 1 ? 's' : ''
      })`;
    }
    // Fallback to pets count if no detailed pet data
    else if (booking.pets > 0) {
      console.log('Using fallback pets count');
      return `${booking.pets} Pet${booking.pets > 1 ? 's' : ''}`;
    }
    console.log('No pets found, returning No Pets');
    return 'No Pets';
  }

  // Helper method to format dates
  formatDateRange(checkIn: string, checkOut: string): string {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };

    return `${checkInDate.toLocaleDateString(
      'en-US',
      options
    )} - ${checkOutDate.toLocaleDateString('en-US', options)}`;
  }

  // Helper method to get status class for styling
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'completed':
        return 'status-completed';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  // Methods for UI interactions
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

  // Booking management methods
  viewBookingDetails(bookingId: string): void {
    this.router.navigate(['/hostBookingDetails', bookingId]);
  }

  messageGuest(bookingId: string): void {}

  updateBookingStatus(bookingId: string, status: string): void {
    console.log('Update booking status:', bookingId, status);
    // Logic will be implemented later
  }
}
