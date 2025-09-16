import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtToken = getJWTToken();

  if (jwtToken) {
    // Clone the request and add the authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return next(authReq);
  }

  // If no token, proceed with original request
  return next(req);
};

function getJWTToken(): string | null {
  return localStorage.getItem('JWT_TOKEN');
}
