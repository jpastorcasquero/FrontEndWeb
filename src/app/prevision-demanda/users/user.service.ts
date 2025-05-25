import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	// Definición de las URLs de los endpoints del servicio de usuario
	private readonly GET_USER = `${environment.user}`;
	private readonly GET_EXIST_MAIL = environment.user+'check_email';
	private readonly GET_LOGIN = `${environment.user}login`;
	private readonly POST_REGISTER = 'https://jpastorcasquero.pythonanywhere.com/api/users/';//`${environment.user}`;
	private readonly PUT_EDIT_USER = `${environment.user}`;
	private readonly DELETE_USER = `${environment.user}`;
	private readonly POST_ACCOUNT_VALIDATION = `${environment.user}account-validation`;
	private readonly GET_RECOVER_PASSWORD = `${environment.user}recover-password`;
	private readonly GET_RESTORE_PASSWORD = `${environment.user}restore-password`

	constructor(
		private readonly httpClient: HttpClient
	) { }

	// Método para obtener todos los usuarios
	getUser(): Observable<any> {
		return this.httpClient
			.get<any[]>(this.GET_USER)
			.pipe(catchError(this.handleError));
	}

	// Método para verificar si existe un correo electrónico
	getExistmail(email: string): Observable<any> {
		return this.httpClient
			.post<any>(this.GET_EXIST_MAIL, { email })
			.pipe(catchError(this.handleError));
	}

	// Método para iniciar sesión
	getLogin(email: string, password: string): Observable<any> {
		return this.httpClient
			.post<any>(this.GET_LOGIN, { email, password })
			.pipe(catchError(this.handleError));
	}

	// Método para registrar un nuevo usuario
	postRegister(user: any): Observable<any> {
		return this.httpClient
			.post<any>(this.POST_REGISTER, user)
			.pipe(catchError(this.handleError));
	}

	// Método para editar un usuario existente
	putEditUser(user: any): Observable<any> {
		return this.httpClient
			.put<any>(`${this.PUT_EDIT_USER}${user.id}`, user)
			.pipe(catchError(this.handleError));
	}

	// Método para eliminar un usuario
	deleteUser(id: any): Observable<any> {
		return this.httpClient
			.delete<any>(`${this.DELETE_USER}${id}`)
			.pipe(catchError(this.handleError));
	}

	// Método para validar una cuenta
	postAccountValidation(body: any): Observable<any> {
		return this.httpClient
			.post<any>(this.POST_ACCOUNT_VALIDATION, body)
			.pipe(catchError(this.handleError));
	}

	// Método para recuperar contraseña
	getRecoverPassword(email: string): Observable<any> {
		return this.httpClient
			.get<any>(`${this.GET_RECOVER_PASSWORD}/${email}`)
			.pipe(catchError(this.handleError));
	}

	// Método para restaurar contraseña
	getRestorePassword(email: string, password: string): Observable<any> {
		return this.httpClient
			.post<any>(this.GET_RESTORE_PASSWORD, { email, password })
			.pipe(catchError(this.handleError));
	}

	postRecoverPassword(email: string): Observable<any> {
	return this.httpClient
		.post<any>('https://jpastorcasquero.pythonanywhere.com/users/reset_password', { email })
		.pipe(catchError(this.handleError));
	}


	// Función para manejar los errores de HTTP
	handleError(error: HttpErrorResponse): Observable<never> {
		let errorMessage = '';
		if (error.error instanceof ErrorEvent) {
			errorMessage = error.error.message; // Error del lado del cliente
		} else {
			errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; // Error del lado del servidor
		}
		console.error(errorMessage); // Registrando el error
		return throwError(errorMessage); // Lanzando el error
	}
}
