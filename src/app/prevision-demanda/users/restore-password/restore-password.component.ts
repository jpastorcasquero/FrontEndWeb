// Importaciones de Angular y módulos relacionados
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

// Importaciones de validadores personalizados
import { EqualPasswordValidator } from '../../core/validators/equalPasswordValidator';
import { PasswordStrengthValidator } from '../../core/validators/passwordStrengthValidator';
import { UserMailValidator } from '../../core/validators/userMailValidator';

// Importación de la interfaz de validación de igualdad de contraseña
import { IValidEqualPassword } from '../user.model';

// Importación del servicio de usuario
import { UserService } from '../user.service';

@Component({
	selector: 'app-restore-password',
	standalone: true,

	// Importación de directivas y módulos
	imports: [NgIf, ReactiveFormsModule, HttpClientModule],

	// Proveedor del servicio de usuario
	providers: [UserService],

	// Plantilla y estilos del componente
	templateUrl: './restore-password.component.html',
	styleUrl: './restore-password.component.scss'
})
export class RestorePasswordComponent implements OnInit {
	form?: FormGroup; // Formulario para la restauración de contraseña
	lettersAndAccents?: string; // Expresión regular para letras y acentos
	emailValid?: string; // Expresión regular para validar correo electrónico

	constructor(
		protected router: Router,
		protected userService: UserService,
		protected formBuilder: FormBuilder,
		protected activatedRoute: ActivatedRoute
	) { }

	ngOnInit() {
		this.getEmail(); // Obtener el correo electrónico de los parámetros de la URL al inicializar el componente
	}

	// Método para obtener el correo electrónico de los parámetros de la URL
	getEmail() {
		this.activatedRoute.params.subscribe((params: Params): void => {
			const EMAIL: string = params['email']; // Obtener el correo electrónico de los parámetros
			this.initForm(EMAIL); // Inicializar el formulario con el correo electrónico obtenido
		});
	}

	// Método para inicializar el formulario de restauración de contraseña
	initForm(email: string): void {
		this.lettersAndAccents = `^([a-z A-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-z A-ZÀ-ÿ\u00f1\u00d1]*)*[a-z A-ZÀ-ÿ\u00f1\u00d1])+$`;
		this.emailValid = `^[a-zA-Z0-9.!#$%++/=?^_{|}-~]+@[a-zA-Z0-9.-]+(?:\.[[a-zA-Z0-9]{2,4}$)`;
		this.form = new FormGroup(
			{
				email: new FormControl({ value: email, disabled: true }, Validators.compose([
					Validators.required,
					Validators.minLength(6),
					Validators.maxLength(30),
					Validators.pattern(this.emailValid)]),
					UserMailValidator.validUserMail(this.userService)
				),
				password: new FormControl('', Validators.compose([
					PasswordStrengthValidator.validPasswordStrength,
					Validators.required,
					Validators.minLength(8),
					Validators.maxLength(20)
				])),
				passwordConfirm: new FormControl('', Validators.compose([
					PasswordStrengthValidator.validPasswordStrength,
					Validators.required,
					Validators.minLength(8),
					Validators.maxLength(20)
				])),
			}, (formGroup: AbstractControl): IValidEqualPassword | null => {
				return EqualPasswordValidator.validEqualPassword(formGroup);
			}
		);
	}

	// Método para guardar la nueva contraseña
	save(): void {
		if (this.form?.value) {
			this.getRestorePassword(this.form.getRawValue().email.toLowerCase(), this.form.value.password);
		}
	}

	// Método para enviar la solicitud de restauración de contraseña al servidor
	getRestorePassword(email: string, password: string): void {
		this.userService.getRestorePassword(email, password)
			.subscribe((data: any): any => {
				if (data) {
					localStorage.setItem('user', JSON.stringify(data)); // Almacenar los datos del usuario en el almacenamiento local
					this.router.navigate(['profile']); // Redirigir al perfil del usuario
				} else {
					alert('El inicio de sesion a fallado'); // Mostrar alerta si la restauración de contraseña falla
				}
			});
	}

}
