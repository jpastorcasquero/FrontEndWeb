// Importación de módulos y servicios necesarios desde Angular y RxJS
import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { map, switchMap, timer, of } from 'rxjs';
import { UserService } from '../../users/user.service';

@Injectable({
	providedIn: 'root' // Indica que el servicio es proporcionado en el nivel raíz de la aplicación
})
export class UserMailValidator {
	// Método estático que retorna una función que será utilizada como validador asíncrono personalizado para el control de formulario
	static validUserMail(userService: UserService) {
		return (control: AbstractControl) => {
			if (control.pristine) { // Si el control aún no ha sido tocado por el usuario, se considera válido
				return of(null); // Retorna un observable que emite un valor nulo indicando que la validación pasó
			}

			return timer(500).pipe( // Se utiliza un temporizador para evitar solicitudes excesivas al servidor
				switchMap(() => {
					return userService.getExistmail(control.value) // Realiza una solicitud al servidor para verificar si el correo ya existe
				}), 
				map(resp => resp ? { validUserMail: true } : null) // Mapea la respuesta del servidor a un objeto que indica si el correo ya está en uso
			);
		}
	}
}
