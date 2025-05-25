import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface AddressDTO {
  id?: number;
  user_id: number;
  country: string;
  city: string;
  address: string;
  postal_code: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddressesService {
  private readonly BASE_URL = environment.addresses; // https://.../addresses/

  constructor(private readonly httpClient: HttpClient) {}

  /** Obtener direcciones de un usuario por su ID */
  getAddress(userId: number): Observable<AddressDTO[]> {
    return this.httpClient
      .get<AddressDTO[]>(`${this.BASE_URL}${userId}`)
      .pipe(catchError(this.handleError));
  }

  /** Crear una nueva dirección */
  postAddress(address: AddressDTO): Observable<{ message: string }> {
    return this.httpClient
      .post<{ message: string }>(this.BASE_URL, address)
      .pipe(catchError(this.handleError));
  }

  /** Editar dirección existente por user_id */
  editAddress(address: AddressDTO): Observable<{ message: string }> {
    return this.httpClient
      .put<{ message: string }>(`${this.BASE_URL}${address.user_id}`, address)
      .pipe(catchError(this.handleError));
  }

  /** Eliminar dirección por user_id */
  deleteAddress(userId: number): Observable<{ message: string }> {
    return this.httpClient
      .delete<{ message: string }>(`${this.BASE_URL}${userId}`)
      .pipe(catchError(this.handleError));
  }

  /** Manejo de errores HTTP */
  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error instanceof ErrorEvent
      ? error.error.message
      : `Error Code: ${error.status}\nMessage: ${error.message}`;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
