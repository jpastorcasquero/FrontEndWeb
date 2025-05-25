import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PhoneService {

  private readonly BASE_URL = environment.phone; // Ej: https://jpastorcasquero.pythonanywhere.com/phones

  constructor(private readonly httpClient: HttpClient) {}

  // Obtener teléfonos por id de usuario
  getPhone(idUser: number): Observable<any[]> {
    return this.httpClient
      .get<any[]>(`${this.BASE_URL}/${idUser}`)
      .pipe(catchError(this.handleError));
  }

  // Editar un teléfono por id del teléfono
  getEdit(phone: any): Observable<any> {
    return this.httpClient
      .put<any>(`${this.BASE_URL}/${phone.id}`, phone)
      .pipe(catchError(this.handleError));
  }

  // Registrar un nuevo teléfono
  postRegister(phone: any): Observable<any> {
    return this.httpClient
      .post<any>(this.BASE_URL, phone)
      .pipe(catchError(this.handleError));
  }

  // Eliminar un teléfono por id del teléfono
  deletePhone(phoneId: number): Observable<any> {
    return this.httpClient
      .delete<any>(`${this.BASE_URL}/${phoneId}`)
      .pipe(catchError(this.handleError));
  }

  // Manejo centralizado de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
