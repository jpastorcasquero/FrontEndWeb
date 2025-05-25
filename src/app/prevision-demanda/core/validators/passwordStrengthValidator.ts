import { AbstractControl } from '@angular/forms';
import { IValidPasswordStrength } from '../../users/user.model';

// Clase para validar la fortaleza de la contraseña
export class PasswordStrengthValidator {

	// Método estático para validar la fortaleza de la contraseña
	static validPasswordStrength(fc: AbstractControl): IValidPasswordStrength | null {
		const value: string = fc.value; // Obtiene el valor del control de formulario

		if (!value) {
			return null; // Si el valor es nulo, la validación es válida
		}

		// Comprueba si la contraseña contiene al menos una mayúscula, una minúscula y un número
		const hasUpperCase: boolean = new RegExp(/[A-Z]+/).test(value);
		const hasLowerCase: boolean = new RegExp(/[a-z]+/).test(value);
		const hasNumeric: boolean = new RegExp(/[0-9]+/).test(value);

		// Comprueba si la contraseña no contiene caracteres especiales
		const notSymbols: boolean = new RegExp(/[$%&? "'`]+/).test(value);

		// La contraseña es válida si contiene al menos una mayúscula, una minúscula y un número
		const passwordValid: boolean = hasUpperCase && hasLowerCase && hasNumeric;

		// Devuelve un objeto indicando los problemas de validación encontrados, si los hay
		if (!hasUpperCase) {
			return ({ noUpperCase: true }); // Indica que la contraseña no contiene mayúsculas
		}
		if (!hasLowerCase) {
			return ({ noLowerCase: true }); // Indica que la contraseña no contiene minúsculas
		}
		if (!hasNumeric) {
			return ({ noNumeric: true }); // Indica que la contraseña no contiene números
		}
		if (notSymbols) {
			return ({ notSymbols: true }); // Indica que la contraseña contiene caracteres especiales
		}

		// Si la contraseña no cumple con los requisitos mínimos de seguridad, devuelve un objeto de error
		return !passwordValid ? ({ validPasswordStrength: true }) : null;
	}
}
