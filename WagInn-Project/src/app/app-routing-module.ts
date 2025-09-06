import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostRegistrationPersonalInfo } from './components/hostRegistration/host-registration-personal-info/host-registration-personal-info';
import { HostRegistrationAddressDetails } from './components/hostRegistration/host-registration-address-details/host-registration-address-details';
import { HostRegistrationPetInfo } from './components/hostRegistration/host-registration-pet-info/host-registration-pet-info';
import { HostRegistrationPropertyDetails } from './components/hostRegistration/host-registration-property-details/host-registration-property-details';


const routes: Routes = [{ path: '', component: HostRegistrationPersonalInfo },
  {path: 'addressDetails', component: HostRegistrationAddressDetails},
  {path: 'petInfo', component: HostRegistrationPetInfo},
  {path: 'propertyDetails', component: HostRegistrationPropertyDetails}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
