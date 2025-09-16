import { PetInfo } from "./petsInfo.interface";

export interface UserRegistrationData {
  personalInfo: {
    firstName: string;
    lastName: string;
    birthMonth: string;
    birthDay: string;
    birthYear: string;
    email: string;
    phone: string;
    passwordInput: string;
  };
  userPetInfo: {
    pets: PetInfo[]
  };
}
