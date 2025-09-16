import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HostSignInService } from './services/hostSignIn/host-sign-in-service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(HostSignInService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    // Redirect to login page with return url
    router.navigate(['hostSignIn'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
};
