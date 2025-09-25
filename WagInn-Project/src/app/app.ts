import { Component, signal, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('WagInn-Project');
  isHostRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Listen to route changes to determine which header to show
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.url);
      });

    // Check initial route
    this.checkRoute(this.router.url);
  }

  private checkRoute(url: string): void {
    // Define routes that should use the host header
    const hostRoutes = [
      '/hostDashboard',
      '/hostBookingDetails',
      '/hostEarnings',
      '/hostProfile',
      '/hostSettings',
    ];
    this.isHostRoute = hostRoutes.some((route) => url.includes(route));

    console.log('Current URL:', url, 'Is Host Route:', this.isHostRoute); // Debug log
  }
}
