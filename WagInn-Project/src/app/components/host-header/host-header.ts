import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HostSignInService } from '../../services/hostSignIn/host-sign-in-service';

interface Notification {
  id: string;
  message: string;
  time: string;
  icon: string;
  read: boolean;
}

@Component({
  selector: 'app-host-header',
  standalone: false,
  templateUrl: './host-header.html',
  styleUrls: ['./host-header.css'],
})
export class HostHeader implements OnInit {
  // Current host data
  currentHost: any = null;

  // UI State
  showNotifications: boolean = false;
  showProfileMenu: boolean = false;
  showMobileMenu: boolean = false;

  // Host profile
  hostProfileImage: string | null = null;

  constructor(private router: Router, private authService: HostSignInService) {}

  ngOnInit(): void {
    this.loadHostData();
    this.setupClickOutsideListeners();
  }

  // Load host data from storage/service
  private loadHostData(): void {
    const hostData = localStorage.getItem('USER_INFO');
    if (hostData) {
      this.currentHost = JSON.parse(hostData);
    }
  }

  // Setup click outside listeners to close dropdowns
  private setupClickOutsideListeners(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      // Close notifications dropdown
      if (!target.closest('.notification-center') && this.showNotifications) {
        this.showNotifications = false;
      }

      // Close profile dropdown
      if (!target.closest('.host-profile-dropdown') && this.showProfileMenu) {
        this.showProfileMenu = false;
      }
    });
  }

  // Host information getters
  getHostDisplayName(): string {
    if (
      this.currentHost &&
      this.currentHost.firstName &&
      this.currentHost.lastName
    ) {
      return `${this.currentHost.firstName} ${this.currentHost.lastName}`;
    }
    return 'Host User';
  }

  getHostEmail(): string {
    return this.currentHost?.email || 'host@waginn.com';
  }

  getPropertyTitle(): string {
    if (this.currentHost && this.currentHost.propertyTitle) {
      return this.currentHost.propertyTitle;
    }
    return 'Property Name';
  }

  getPropertyLocation(): string {
    if (this.currentHost) {
      const city = this.currentHost.city || '';
      const province = this.currentHost.province || '';
      const street = this.currentHost.streetAddress || '';
      const zipCode = this.currentHost.zipCode || '';

      const locationParts = [street, city, province, zipCode].filter(
        (part) => part.trim() !== ''
      );
      return locationParts.join(', ') || 'Location';
    }
    return 'Location';
  }

  // Navigation methods
  navigateToSection(section: string): void {
    console.log('Navigating to section:', section);
    // Emit event to parent component or use router
    switch (section) {
      case 'dashboard':
        this.router.navigate(['/hostDashboard']);
        break;
      case 'bookings':
        // Navigate to bookings section
        break;
      case 'earnings':
        // Navigate to earnings section
        break;
      case 'messages':
        // Navigate to messages section
        break;
    }
    this.closeMobileMenu();
  }

  navigateToProfile(): void {
    console.log('Navigate to host profile');
    this.showProfileMenu = false;
  }

  navigateToSettings(): void {
    console.log('Navigate to settings');
    this.showProfileMenu = false;
  }

  navigateToHelp(): void {
    console.log('Navigate to help');
    this.showProfileMenu = false;
  }

  // Notification methods
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showProfileMenu = false; // Close other dropdowns
  }

  // Profile menu methods
  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
    this.showNotifications = false; // Close other dropdowns
  }

  // Mobile menu methods
  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;

    // Prevent body scroll when menu is open
    if (this.showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
    document.body.style.overflow = 'auto';
  }

  // Logout functionality
  onLogout(): void {
    const confirmLogout = confirm('Are you sure you want to logout?');

    if (confirmLogout) {
      // Clear storage
      localStorage.clear();
      sessionStorage.clear();

      // Call auth service logout
      this.authService.logout();

      // Close all dropdowns
      this.showProfileMenu = false;
      this.showNotifications = false;
      this.closeMobileMenu();

      // Navigate to host sign in
      window.location.replace('/hostSignIn');
    }
  }
}
