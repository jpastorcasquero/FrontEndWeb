import { AbstractControl } from '@angular/forms';
import { IValidPasswordStrength } from '../../users/user.model';

export class PasswordStrengthValidator {
	static validPasswordStrength(fc: AbstractControl): IValidPasswordStrength | null {
		const value: string = fc.value;

		if (!value) {
			return null;
		}

		const hasUpperCase = /[A-Z]/.test(value);
		const hasLowerCase = /[a-z]/.test(value);
		const hasNumeric = /[0-9]/.test(value);
		const hasSymbol = /[^A-Za-z0-9]/.test(value); // permite cualquier símbolo

		const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSymbol;

		if (!hasUpperCase) {
			return { noUpperCase: true };
		}
		if (!hasLowerCase) {
			return { noLowerCase: true };
		}
		if (!hasNumeric) {
			return { noNumeric: true };
		}
		if (!hasSymbol) {
			return { notSymbols: true }; // <== mantenemos el nombre original
		}

		return passwordValid ? null : { validPasswordStrength: true };
	}
}
