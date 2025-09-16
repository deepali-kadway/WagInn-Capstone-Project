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
    petName: string;
    petAge: string;
    petType: string;
    petBreed: string;
    petSize: string;
    isVaccinated: string;
    vaccinesProvided: string;
    isNeutered: string;
    isFleaTickPrevented: string;
    concerns: string;
  };
}
