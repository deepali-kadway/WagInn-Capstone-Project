import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  constructor(private router: Router) {}

  navigateToRegister() {
    this.router.navigate(['']);
  }
}
