import { AbstractControl } from '@angular/forms';
import { IValidEqualPassword } from '../../users/user.model';

// Clase para validar si las contraseñas son iguales
export class EqualPasswordValidator {

	// Método estático para validar si las contraseñas son iguales
	static validEqualPassword(formGroup: AbstractControl): IValidEqualPassword | null {
		// Comprueba si el valor de 'password' es igual al valor de 'passwordConfirm'
		if (formGroup.value?.password === formGroup.value?.passwordConfirm) {
			return null; // Si son iguales, la validación es válida y devuelve null
		} else {
			return ({ validEqualPassword: true }); // Si no son iguales, devuelve un objeto de error
		}
	}
}
