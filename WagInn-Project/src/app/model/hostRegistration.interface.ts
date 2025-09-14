export interface HostRegistrationData {
  personalInfo: {
    firstName: string;
    lastName: string;
    birthMonth: string;
    birthDay: number;
    birthYear: number;
    email: string;
  };
  addressDetails: {
    streetAddress: string;
    city: string;
    province: string;
    zipCode: string;
    country: string;
  };
  petInfo: {
    allowedPetsType: string;
    petSizeRestrictions: string;
    houseRules: string;
    requiredVaccinations: string;
    neuteredSpayedRequired: string;
    fleaTickPreventionRequired: string;
  };
  propertyDetails: {
    propertyTitle: string;
    propertyType: string;
    ammenities: string;
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    pets: number;
    ammenitiesPets: string;
    propertyPhotos: File[];
  };
  pricing: {
    basePrice: number;
    totalGuestPrice: number;
    hostEarnings: number;
  };
  idVerification: {
    frontIdFile: File | null;
    backIdFile: File | null;
  };
}
