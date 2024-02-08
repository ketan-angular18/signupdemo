import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * @function passwordsMatchValidator for match the password and confirm password
 * @if for check  password and confirm password
 * @returns true if password is not match and set error passwordDontmatch true at control
 */
export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => { 
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    const confirmPassworderro = control.get('confirmPassword')
    if (password && confirmPassword && password !== confirmPassword) {
      confirmPassworderro?.setErrors({passwordDontmatch:true})
      return {
        passwordsDontMatch: true,
      };
    }
    return null;
  };
}
