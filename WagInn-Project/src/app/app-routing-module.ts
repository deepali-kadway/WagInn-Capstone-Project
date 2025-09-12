import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostRegistrationPersonalInfo } from './components/hostRegistration/host-registration-personal-info/host-registration-personal-info';
import { HostRegistrationAddressDetails } from './components/hostRegistration/host-registration-address-details/host-registration-address-details';
import { HostRegistrationPetInfo } from './components/hostRegistration/host-registration-pet-info/host-registration-pet-info';
import { HostRegistrationPropertyDetails } from './components/hostRegistration/host-registration-property-details/host-registration-property-details';
import { HostRegistrationPricing } from './components/hostRegistration/host-registration-pricing/host-registration-pricing';
import { HostRegistrationIDVerification } from './components/hostRegistration/host-registration-idverification/host-registration-idverification';

const routes: Routes = [
  { path: '', component: HostRegistrationPersonalInfo },
  { path: 'addressDetails', component: HostRegistrationAddressDetails },
  { path: 'petInfo', component: HostRegistrationPetInfo },
  { path: 'propertyDetails', component: HostRegistrationPropertyDetails },
  { path: 'pricing', component: HostRegistrationPricing },
  { path: 'idVerification', component: HostRegistrationIDVerification },
  { path: 'hostDashboard', component: HostRegistrationIDVerification },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
