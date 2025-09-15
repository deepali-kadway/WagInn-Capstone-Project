import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host-sign-in-page',
  standalone: false,
  templateUrl: './host-sign-in-page.html',
  styleUrl: './host-sign-in-page.css',
})
export class HostSignInPage {
  hostSignIn!: FormGroup;

  get userName() {
    return this.hostSignIn.get('userName');
  }

  get passCode() {
    return this.hostSignIn.get('passCode');
  }

  constructor(private fb: FormBuilder, private router: Router) {
    this.hostSignIn = this.fb.group({
      userName: ['', Validators.required],
      passCode: ['', Validators.required],
    });
  }
}
