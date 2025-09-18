import { Component } from '@angular/core';

@Component({
  selector: 'app-user-dashboard',
  standalone: false,
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css',
})
export class UserDashboard {
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

  // Navigation state
  activeSection: string = 'dashboard';
  sidebarOpen: boolean = false;

  // User information (will be populated from auth service later)
  currentUser: any = {
    firstName: 'John',
    email: 'user@example.com',
  };

  // Methods for UI interactions
  onSearch(): void {
    console.log('Search params:', this.searchParams);
    // Search logic will be implemented later
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
