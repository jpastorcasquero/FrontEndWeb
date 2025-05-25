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
import { Router } from '@angular/router';

// Importaciones de validadores personalizados
import { EqualPasswordValidator } from '../../core/validators/equalPasswordValidator';
import { PasswordStrengthValidator } from '../../core/validators/passwordStrengthValidator';
import { UserMailValidator } from '../../core/validators/userMailValidator';

// Importaciones de modelos y servicios relacionados
import { IValidEqualPassword } from '../user.model';
import { UserService } from '../user.service';

@Component({
	selector: 'app-register', // Selector del componente
	standalone: true, // Indicador de que el componente es independiente
	imports: [NgIf, ReactiveFormsModule, HttpClientModule], // Importación de módulos necesarios
	providers: [UserService], // Proveedor del servicio de usuario
	templateUrl: './register.component.html', // Ruta de la plantilla HTML del componente
	styleUrl: './register.component.scss', // Ruta del archivo de estilos del componente
})
export class RegisterComponent implements OnInit {
	form?: FormGroup; // Formulario para el registro de usuario
	lettersAndAccents?: string; // Expresión regular para letras y acentos
	unaccentedLettersAndNumbers?: string; // Expresión regular para letras y números sin acentos
	emailValid?: string; // Expresión regular para validar correo electrónico
	selectedImage: string = "avatar1.png"; // Imagen seleccionada por defecto

	userForm?: FormGroup; 

	constructor(
		protected router: Router, // Servicio de enrutamiento
		protected userService: UserService, // Servicio de usuario
		protected formBuilder: FormBuilder, // Constructor de formularios
	) { }

	ngOnInit() {
		this.initForm(); // Inicializar el formulario al iniciar el componente
	}

	// Método para inicializar el formulario de registro
	initForm(): void {
		// Definición de expresiones regulares
		this.lettersAndAccents = `^([a-z A-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-z A-ZÀ-ÿ\u00f1\u00d1]*)*[a-z A-ZÀ-ÿ\u00f1\u00d1])+$`;
		this.unaccentedLettersAndNumbers = '[A-Za-z0-9]+';
		this.emailValid = `^[a-zA-Z0-9.!#$%++/=?^_{|}-~]+@[a-zA-Z0-9.-]+(?:\.[[a-zA-Z0-9]{2,4}$)`;
		// Creación del formulario con controles y validaciones
		this.form = new FormGroup(
			{
				name: new FormControl('', Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(33),
					Validators.pattern(this.lettersAndAccents)
				])),
				nickName: new FormControl('', Validators.compose([
					Validators.required,
					Validators.minLength(3),
					Validators.maxLength(33),
					Validators.pattern(this.unaccentedLettersAndNumbers)
				])),
				email: new FormControl('', Validators.compose([
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
				acept1: new FormControl('', Validators.compose([
					Validators.requiredTrue,
				])),
				acept2: new FormControl('', Validators.compose([
					Validators.requiredTrue
				]))
			}, (formGroup: AbstractControl): IValidEqualPassword | null => {
				return EqualPasswordValidator.validEqualPassword(formGroup);
			}
		);
	}

	// Método para seleccionar una imagen de perfil
	selectImage(event: any) {
		const checkbox = event.target as HTMLInputElement;
		if (checkbox.checked) {
			this.selectedImage = checkbox.value;
			// Desmarcar los demás checkboxes
			const checkboxes = document.querySelectorAll('input[type="checkbox"]');
			checkboxes.forEach((cb: Element) => { // Cambiado el tipo a Element
				const cbInput = cb as HTMLInputElement; // Convertir a HTMLInputElement
				if (cbInput !== checkbox) {
					cbInput.checked = false;
				}
			});
			console.log('Imagen seleccionada:', this.selectedImage);
		}
	}

	// Método para guardar el nuevo usuario
	save(): void {
		if (this.form?.value) {
			// Construir objeto de usuario
			const USER = {
				name: this.form.value.name,
				nickName: this.form.value.nickName,
				role: "USER",
				email: this.form.value.email,
				password: this.form.value.password,
				image: this.selectedImage,
			};
			console.log(USER); // Mostrar usuario en consola
			this.postRegister(USER); // Enviar solicitud de registro al servidor
		}
	}

	// Método para enviar la solicitud de registro al servidor
	postRegister(user: any): void {
		this.userForm = this.formBuilder.group(user)
		console.log(this.userForm)
		this.userService.postRegister(this.userForm.value)
			.subscribe((data: any): any => {
				if (data) {
					localStorage.setItem('user', JSON.stringify(data)); // Almacenar los datos del usuario en el almacenamiento local
					this.router.navigate(['conversations']); // Redirigir al perfil del usuario
				}
			});
	}
}
