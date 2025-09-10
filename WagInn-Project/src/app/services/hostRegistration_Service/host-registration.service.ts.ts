import { Injectable } from '@angular/core';
import { HostRegistrationData } from '../../model/hostRegistration.interface';

@Injectable({
  providedIn: 'root'
})
export class HostRegistrationServiceTs {
private hostregistrationData: Partial<HostRegistrationData> = {}

//step wise data updates
updatePersonalInfo(data: any){
  this.hostregistrationData.personalInfo = data;
}

updateAddressDetails(data: any) {
    this.hostregistrationData.addressDetails = data;
  }
  
updatePropertyDetails(data: any) {
    this.hostregistrationData.propertyDetails = data;
  }
  
updatePetInfo(data: any) {
    this.hostregistrationData.petInfo = data;
  }
  
updatePricing(data: any) {
    this.hostregistrationData.pricing = data;
  }
 
updateIdVerification(data: any) {
    this.hostregistrationData.idVerification = data;
  }

//get complete data
getRegistrationData(): Partial<HostRegistrationData> {
  return this.hostregistrationData;
}

//submit to backend
async submitRegistration(): Promise<any> {}

}
