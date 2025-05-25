import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
   providedIn: 'root'
})
export class PredictionService {

   private readonly GET_PREDICTION_URL = environment.getPrediction;

   constructor(private readonly httpClient: HttpClient) {}

   // Método para obtener la predicción
   getPrediction(): Observable<any> {
      return this.httpClient
         .get<any[]>(this.GET_PREDICTION_URL)
         .pipe(catchError(this.handleError));
   }

   // Manejo de errores HTTP
   private handleError(error: HttpErrorResponse): Observable<never> {
      const errorMessage = error.error instanceof ErrorEvent
         ? error.error.message
         : `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.error(errorMessage);
      return throwError(errorMessage);
   }
}
