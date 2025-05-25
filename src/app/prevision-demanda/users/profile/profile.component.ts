// Importaciones necesarias de Angular y otras dependencias
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
import { Router } from '@angular/router';
import { EqualPasswordValidator } from '../../core/validators/equalPasswordValidator';
import { PasswordStrengthValidator } from '../../core/validators/passwordStrengthValidator';
import { UserMailValidator } from '../../core/validators/userMailValidator';
import { IValidEqualPassword } from '../user.model';
import { UserService } from '../user.service';

// Decorador @Component que define metadatos del componente
@Component({
	selector: 'app-profile',  // Nombre del selector del componente
	standalone: true,  // Indica que este componente es independiente
	imports: [NgIf, ReactiveFormsModule, HttpClientModule],  // Módulos importados
	providers: [UserService],  // Servicios proporcionados por el componente
	templateUrl: './profile.component.html',  // Ruta de la plantilla HTML
	styleUrl: './profile.component.scss',  // Ruta de la hoja de estilos
})
export class ProfileComponent implements OnInit {
	// Declaración de propiedades del componente
	form?: FormGroup;  // Formulario reactivo
	lettersAndAccents?: string;  // Expresión regular para validar letras y acentos
	unaccentedLettersAndNumbers?: string;  // Expresión regular para validar letras y números sin acentos
	emailValid?: string;  // Expresión regular para validar correos electrónicos

	// Constructor con inyección de dependencias
	constructor(
		protected router: Router,  // Servicio de enrutamiento
		protected userService: UserService,  // Servicio de usuario
		protected formBuilder: FormBuilder,  // Constructor de formularios
	) { }

	// Método del ciclo de vida OnInit que se ejecuta al inicializar el componente
	ngOnInit() {
		this.initForm();  // Inicializa el formulario
	}

	// Método para inicializar el formulario reactivo
	initForm(): void {
		// Definición de expresiones regulares para validación
		this.lettersAndAccents = `^([a-z A-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-z A-ZÀ-ÿ\u00f1\u00d1]*)*[a-z A-ZÀ-ÿ\u00f1\u00d1])+$`;
		this.unaccentedLettersAndNumbers = '[A-Za-z0-9]+';
		this.emailValid = `^[a-zA-Z0-9.!#$%++/=?^_{|}-~]+@[a-zA-Z0-9.-]+(?:\.[[a-zA-Z0-9]{2,4}$)`;
		
		// Inicialización del formulario reactivo con validadores
		this.form = new FormGroup(
			{
				name: new FormControl('', Validators.compose([
					Validators.minLength(3),
					Validators.maxLength(33),
					Validators.pattern(this.lettersAndAccents)
				])),
				nickName: new FormControl('', Validators.compose([
					Validators.minLength(3),
					Validators.maxLength(33),
					Validators.pattern(this.unaccentedLettersAndNumbers)
				])),
				email: new FormControl('', Validators.compose([
					Validators.minLength(6),
					Validators.maxLength(30),
					Validators.pattern(this.emailValid)]),
					UserMailValidator.validUserMail(this.userService)
				),
				password: new FormControl('', Validators.compose([
					PasswordStrengthValidator.validPasswordStrength,
					Validators.minLength(8),
					Validators.maxLength(20)
				])),
				passwordConfirm: new FormControl('', Validators.compose([
					PasswordStrengthValidator.validPasswordStrength,
					Validators.minLength(8),
					Validators.maxLength(20)
				]))
			}, (formGroup: AbstractControl): IValidEqualPassword | null => {
				return EqualPasswordValidator.validEqualPassword(formGroup);
			}
		);
	}

	// Método para guardar los cambios en el perfil del usuario
	save(): void {
		if (this.form?.value) {
			const userStorage = localStorage.getItem('user');  // Obtener usuario almacenado en localStorage
			if (userStorage) {
				const userFormat = JSON.parse(userStorage);  // Parsear usuario almacenado
				const USER = {
					id: userFormat.id,
					name: this.form.value.name ? this.form.value.name : userFormat.name,
					nickName: this.form.value.nickName ? this.form.value.nickName : userFormat.nickName,
					email: this.form.value.email ? this.form.value.email : userFormat.email,
					password: this.form.value.password ? this.form.value.password : userFormat.password,
				};

				this.putEditUser(USER);  // Llamar al método para editar el usuario
			}
		}
	}

	// Método para enviar la solicitud de edición de usuario
	putEditUser(user: any): void {
		this.userService.putEditUser(user)
			.subscribe((data: any): any => {
				if (data) {
					localStorage.setItem('user', JSON.stringify(data));  // Actualizar usuario en localStorage
					this.router.navigate(['profile']);  // Navegar a la página de perfil
				}
			});
	}

	// Método para eliminar el usuario
	deleteUser(): void {
		const userStorage = localStorage.getItem('user');  // Obtener usuario almacenado en localStorage
		if (userStorage) {
			const userFormat = JSON.parse(userStorage);  // Parsear usuario almacenado
			this.userService.deleteUser(userFormat.id)
				.subscribe((data: any): any => {
					if (data) {
						localStorage.removeItem('user');  // Remover usuario de localStorage
						this.router.navigate(['register']);  // Navegar a la página de registro
					}
				});
		}
	}
}
