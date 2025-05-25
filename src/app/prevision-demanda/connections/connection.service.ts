import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment.prod'; // Importa el entorno de producción

@Injectable({
	providedIn: 'root'
})
export class ConnectionService {

	// Definición de las URL de los endpoints de la API
	#GET_CONNECTION_ALL = `${environment.connection}`; // Endpoint para obtener todas las conexiones
   #GET_CONNECTION_USER = environment.connection + '/'; // Endpoint para obtener las conexiones de un usuario específico
	#GET_EXIST_USER_CONNECTION = environment.connection + '/'; // Endpoint para verificar si un usuario tiene una conexión existente

	constructor(
		private readonly httpClient: HttpClient
	) { }

	// Método para obtener todas las conexiones
	getConnectionAll(): Observable<any> {
		return this.httpClient
			.get<any[]>(this.#GET_CONNECTION_ALL) // Realiza una solicitud GET al endpoint correspondiente
			.pipe(catchError(this.handleError)); // Maneja cualquier error que ocurra durante la solicitud
	}

   // Método para obtener las conexiones de un usuario específico
	getConnectionUser(id: string): Observable<any> {
		return this.httpClient
			.get<any[]>(this.#GET_CONNECTION_USER + id) // Realiza una solicitud GET al endpoint correspondiente con el ID de usuario proporcionado
			.pipe(catchError(this.handleError)); // Maneja cualquier error que ocurra durante la solicitud
	}

	// Método para verificar si un usuario tiene una conexión existente
	getExistUser(id: string): Observable<any> {
		return this.httpClient
			.get<any[]>(this.#GET_EXIST_USER_CONNECTION + id) // Realiza una solicitud GET al endpoint correspondiente con el ID de usuario proporcionado
			.pipe(catchError(this.handleError)); // Maneja cualquier error que ocurra durante la solicitud
	}

	// Función para manejar errores de HTTP
	handleError(error: HttpErrorResponse): Observable<never> {
		let errorMessage = '';
		if (error.error instanceof ErrorEvent) {
			errorMessage = error.error.message;
		} else {
			errorMessage = `Error Code: $error.statusnMessage: $error.message`;
		}
		console.timeEnd(errorMessage); // Registra el tiempo de finalización del error en la consola
		return throwError(errorMessage); // Retorna un observable con el mensaje de error
	}
}
