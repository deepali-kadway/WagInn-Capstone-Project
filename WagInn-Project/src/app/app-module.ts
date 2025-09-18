import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HostRegistrationPersonalInfo } from './components/hostRegistration/host-registration-personal-info/host-registration-personal-info';
import { HostRegistrationAddressDetails } from './components/hostRegistration/host-registration-address-details/host-registration-address-details';
import { HostRegistrationPetInfo } from './components/hostRegistration/host-registration-pet-info/host-registration-pet-info';
import { HostRegistrationPropertyDetails } from './components/hostRegistration/host-registration-property-details/host-registration-property-details';
import { HostRegistrationPricing } from './components/hostRegistration/host-registration-pricing/host-registration-pricing';
import { HostRegistrationIDVerification } from './components/hostRegistration/host-registration-idverification/host-registration-idverification';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HostDashboard } from './components/Dashboard/host-dashboard/host-dashboard';
import { HostSignInPage } from './components/hostSignIn/host-sign-in-page/host-sign-in-page';
import { authInterceptor } from './auth-interceptor';
import { UserRegistrationPersonalInfo } from './components/userRegistration/user-registration-personal-info/user-registration-personal-info';
import { UserRegistrationPetInfo } from './components/userRegistration/user-registration-pet-info/user-registration-pet-info';
import { UserDashboard } from './components/Dashboard/user-dashboard/user-dashboard';
import { UserSignInPage } from './components/userSignIn/user-sign-in-page/user-sign-in-page';

@NgModule({
  declarations: [
    App,
    Header,
    Footer,
    HostRegistrationPersonalInfo,
    HostRegistrationAddressDetails,
    HostRegistrationPetInfo,
    HostRegistrationPropertyDetails,
    HostRegistrationPricing,
    HostRegistrationIDVerification,
    HostDashboard,
    HostSignInPage,
    UserRegistrationPersonalInfo,
    UserRegistrationPetInfo,
    UserDashboard,
    UserSignInPage,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
  bootstrap: [App],
})
export class AppModule {}
