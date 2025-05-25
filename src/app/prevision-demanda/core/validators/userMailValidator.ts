import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { map, switchMap, timer, of } from 'rxjs';
import { UserService } from '../../users/user.service';

@Injectable({
	providedIn: 'root'
})
export class UserMailValidator {
	static validUserMail(userService: UserService) {
		return (control: AbstractControl) => {
			if (control.pristine) {
				return of(null);
			}

			return timer(500).pipe(
				switchMap(() => userService.getExistmail(control.value)),
				map(resp => (resp.exists ? { validUserMail: true } : null))  // <-- Aquí se accede a resp.exists
			);
		};
	}
}
