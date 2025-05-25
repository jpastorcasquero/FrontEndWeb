import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
   providedIn: 'root'
})
export class ClassifierService {
   private readonly GET_CLASSIFIER_URL = environment.getClassifier;

   constructor(private readonly httpClient: HttpClient) {}

   getClassifier(): Observable<any> {
      return this.httpClient
         .get<any[]>(this.GET_CLASSIFIER_URL)
         .pipe(catchError(this.handleError));
   }

   private handleError(error: HttpErrorResponse): Observable<never> {
      const errorMessage = error.error instanceof ErrorEvent
         ? error.error.message
         : `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.error(errorMessage);
      return throwError(errorMessage);
   }
}
