import { HttpInterceptorFn } from '@angular/common/http';

// interceptors adds authentication token and authorization headers to outgoing HTTP requests
// request received is first intercepted by the interceptor, which checks for an existing authentication token
// clones the request and adds the bearer/authorization information in the req headers

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
