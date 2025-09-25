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
    this.router.events // observable that emits various router events. Router events include: NavigationStart, NavigatioEnd, NavigationCancel, NavigationError, etc
      //pipe(): allows to apply operators to transform observable stream
      //filter(): RxJS operator that only lets certain events pass through
      // event instanceof NavigationEnd: checks if it is a NavigationEnd event, because we want to update the header only after navigation is complete not during.
      // Eg: Navigation from /userDashboard to /hostDashboard, NavigationEnd event fires with URL /hostDashboard
      .pipe(filter((event) => event instanceof NavigationEnd))
      //When a NavigationEnd event occurs, this callback function runs
      //event.url contains the new URL after navigation is complete
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.url);
        // Eg continued: subscribe() callback runs → this.checkRoute('/hostDashboard')
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
