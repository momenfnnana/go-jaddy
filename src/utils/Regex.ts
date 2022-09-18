export const lowerCaseRegex = /^(?=.*[a-z])/gm;
export const upperCaseRegex = /^(?=.*[A-Z])/gm;
export const specialCharactersRegex =
  /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/gm;
// To add numbers: (?=.*\d)
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-~=[\]{};':"\\|,.<>/?]).{8,}$/gm;
