import { Component, OnInit } from '@angular/core';

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
  ngOnInit(): void {
    const hostData = localStorage.getItem('USER_INFO');
    if (hostData) {
      this.currentHost = JSON.parse(hostData);
    }
  }
  // Dashboard stats (mock data for now)
  dashboardStats = {
    totalProperties: 1,
    activeBookings: 8,
    lastMonthRevenue: 1450,
    pendingRequests: 3,
  };

  // Sample booking data (will come from backend later)
  recentBookings = [
    {
      id: 'BK001',
      guestName: 'John Smith',
      petInfo: 'Golden Retriever - Max',
      property: 'Cozy Downtown Apartment',
      checkIn: '2025-09-25',
      checkOut: '2025-09-28',
      status: 'confirmed',
      revenue: 320,
      nights: 3,
    },
    {
      id: 'BK002',
      guestName: 'Emily Johnson',
      petInfo: 'Labrador & Cat - Luna & Whiskers',
      property: 'Pet-Friendly Beach House',
      checkIn: '2025-09-22',
      checkOut: '2025-09-24',
      status: 'pending',
      revenue: 280,
      nights: 2,
    },
    {
      id: 'BK003',
      guestName: 'Mike Wilson',
      petInfo: 'French Bulldog - Buddy',
      property: 'Modern City Loft',
      checkIn: '2025-09-20',
      checkOut: '2025-09-23',
      status: 'completed',
      revenue: 450,
      nights: 3,
    },
    {
      id: 'BK004',
      guestName: 'Lisa Anderson',
      petInfo: 'Border Collie - Rex',
      property: 'Suburban Family Home',
      checkIn: '2025-09-30',
      checkOut: '2025-10-03',
      status: 'confirmed',
      revenue: 375,
      nights: 3,
    },
  ];

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
    console.log('View booking details:', bookingId);
    // Logic will be implemented later
  }

  messageGuest(bookingId: string): void {
    console.log('Message guest for booking:', bookingId);
    // Logic will be implemented later
  }

  updateBookingStatus(bookingId: string, status: string): void {
    console.log('Update booking status:', bookingId, status);
    // Logic will be implemented later
  }
}
