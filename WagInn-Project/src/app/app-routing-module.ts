import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostRegistrationPersonalInfo } from './components/hostRegistration/host-registration-personal-info/host-registration-personal-info';
import { HostRegistrationAddressDetails } from './components/hostRegistration/host-registration-address-details/host-registration-address-details';
import { HostRegistrationPetInfo } from './components/hostRegistration/host-registration-pet-info/host-registration-pet-info';
import { HostRegistrationPropertyDetails } from './components/hostRegistration/host-registration-property-details/host-registration-property-details';
import { HostRegistrationPricing } from './components/hostRegistration/host-registration-pricing/host-registration-pricing';
import { HostRegistrationIDVerification } from './components/hostRegistration/host-registration-idverification/host-registration-idverification';
import { HostDashboard } from './components/Dashboard/host-dashboard/host-dashboard';
import { HostSignInPage } from './components/hostSignIn/host-sign-in-page/host-sign-in-page';
import { authGuard } from './auth-guard';
import { UserRegistrationPersonalInfo } from './components/userRegistration/user-registration-personal-info/user-registration-personal-info';
import { UserRegistrationPetInfo } from './components/userRegistration/user-registration-pet-info/user-registration-pet-info';
import { UserDashboard } from './components/Dashboard/user-dashboard/user-dashboard';
import { UserSignInPage } from './components/userSignIn/user-sign-in-page/user-sign-in-page';
import { OpenPropertyDetails } from './components/Dashboard/open-property-details/open-property-details';
import { BookStay } from './components/Dashboard/book-stay/book-stay';
import { BookingConfirmation } from './components/Dashboard/booking-confirmation/booking-confirmation';
import { MyUserBookings } from './components/UserBookings/my-user-bookings/my-user-bookings';
import { HostBookingDetails } from './components/Dashboard/host-booking-details/host-booking-details';
import { MyBookingsUser } from './components/Dashboard/my-bookings-user/my-bookings-user';

const routes: Routes = [
  { path: '', component: HostRegistrationPersonalInfo },
  { path: 'addressDetails', component: HostRegistrationAddressDetails },
  { path: 'petInfo', component: HostRegistrationPetInfo },
  { path: 'propertyDetails', component: HostRegistrationPropertyDetails },
  { path: 'pricing', component: HostRegistrationPricing },
  { path: 'idVerification', component: HostRegistrationIDVerification },
  {
    path: 'hostDashboard',
    component: HostDashboard,
    canActivate: [authGuard],
    data: { role: 'host' }, // Protect this route
  },
  { path: 'hostSignIn', component: HostSignInPage },
  { path: 'userRegistration', component: UserRegistrationPersonalInfo },
  { path: 'userPetInfo', component: UserRegistrationPetInfo },
  {
    path: 'userDashboard',
    component: UserDashboard,
    canActivate: [authGuard],
    data: { role: 'user' },
  }, //protected route
  { path: 'userSignIn', component: UserSignInPage },
  {
    path: 'propertyDetailsDashboard/:id',
    component: OpenPropertyDetails,
    canActivate: [authGuard],
    data: { role: 'user' },
  },
  {
    path: 'bookStay/:propertyId',
    component: BookStay,
    canActivate: [authGuard],
    data: { role: 'user' },
  },
  {
    path: 'bookingConfirmation',
    component: BookingConfirmation,
    canActivate: [authGuard],
    data: { role: 'user' },
  },
  {
    path: 'myBookings',
    component: MyUserBookings,
    canActivate: [authGuard],
    data: { role: 'user' },
  },
  {
    path: 'hostBookingDetails/:bookingId',
    component: HostBookingDetails,
    canActivate: [authGuard],
    data: { role: 'host' },
  },
  {
    path: 'myBookingsUser',
    component: MyBookingsUser,
    canActivate: [authGuard],
    data: { role: 'user' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
