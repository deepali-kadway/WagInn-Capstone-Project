import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HostSignInService } from './services/hostSignIn/host-sign-in-service';
import { UserSignInService } from './services/userSignIn_Service/user-sign-in-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // get role from route data
  const requiredRole = route.data?.['role']; //host or user

  if (requiredRole === 'host') {
    const hostAuthService = inject(HostSignInService);
    if (hostAuthService.isAuthenticated()) {
      return true;
    } else {
      router.navigate(['hostSignIn'], {
        queryParams: { returnUrl: state.url }, //preserve users intended destination
      });
      return false;
    }
  } else if (requiredRole === 'user') {
    const userAuthService = inject(UserSignInService);
    if (userAuthService.isAuthenticated()) {
      return true;
    } else {
      router.navigate(['userSignIn'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }
  }
  // Default: no role specified
  router.navigate(['/']);
  return false;
};
