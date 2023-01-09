export const lowerCaseRegex = /^(?=.*[a-z])/gm;
export const upperCaseRegex = /^(?=.*[A-Z])/gm;
export const digitRegex = /\d/;
export const specialCharactersRegex =
  /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/gm;
// To add numbers: (?=.*\d)
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+\-~=[\]{};':"\\|,.<>/?]).{8,}$/gm;

export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export function numberWithCommas(x: number | string) {
  return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
