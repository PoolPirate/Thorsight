import { AbstractControl, ValidationErrors } from "@angular/forms";

export class ThorValidators {
  static address(control: AbstractControl): ValidationErrors | null {
    const address = (control.value as string).trim();
    if (!address.startsWith("thor")) {
      return {
        address: "Thorchain addresses must start with 'thor'"
      };
    }
    if (address.length != 43) {
      return {
        address: "Thorchain addresses must be 43 characters long"
      };
    }

    return null;
  }
}
