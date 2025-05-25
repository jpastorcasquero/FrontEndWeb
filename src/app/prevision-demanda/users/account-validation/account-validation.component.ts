// Importaciones necesarias de Angular
import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
	selector: 'app-account-validation',
	standalone: true, // El componente es independiente, no necesita estar en un módulo
	imports: [NgIf, NgFor, NgClass, ReactiveFormsModule, HttpClientModule], // Módulos importados necesarios para el template
	providers: [UserService], // Proveedor del servicio UserService
	templateUrl: './account-validation.component.html', // Ruta del archivo del template
	styleUrl: './account-validation.component.scss' // Ruta del archivo de estilos
})
export class AccountValidationComponent implements OnInit, OnDestroy {

	form?: FormGroup; // Formulario reactivo
	emailValid?: string; // Expresión regular para validar el email
	#subscription: Subscription = new Subscription(); // Suscripciones para manejo de eventos y observables

	// Inyección de dependencias necesarias
	constructor(
		protected router: Router,
		protected formBuilder: FormBuilder,
		protected readonly userService: UserService,
		protected activatedRoute: ActivatedRoute
	) { }

	// Método que se ejecuta al iniciar el componente
	ngOnInit() {
		this.getEmail(); // Obtiene el email de la ruta activa
	}

	// Método para obtener el email desde los parámetros de la ruta
	getEmail() {
		this.activatedRoute.params.subscribe((params: Params): void => {
			const EMAIL: string = params['email'];
			this.initForm(EMAIL); // Inicializa el formulario con el email obtenido
		});
	}

	// Método para inicializar el formulario
	initForm(email: string): void {
		this.emailValid = `^[a-zA-Z0-9.!#$%++/=?^_{|}-~]+@[a-zA-Z0-9.-]+(?:\\.[[a-zA-Z0-9]{2,4}$)`;
		this.form = new FormGroup(
			{
				// Campos del formulario con sus validaciones
				email: new FormControl({ value: email, disabled: true }, Validators.compose([
					Validators.required,
					Validators.minLength(6),
					Validators.maxLength(30),
					Validators.pattern(this.emailValid)])),
				numberInput1: new FormControl({ value: '', disabled: false }, [
					Validators.required,
					Validators.pattern('^[0-9]$')]),
				numberInput2: new FormControl({ value: '', disabled: true }, [
					Validators.required,
					Validators.pattern('^[0-9]$')]),
				numberInput3: new FormControl({ value: '', disabled: true }, [
					Validators.required,
					Validators.pattern('^[0-9]$')]),
				numberInput4: new FormControl({ value: '', disabled: true }, [
					Validators.required,
					Validators.pattern('^[0-9]$')]),
				numberInput5: new FormControl({ value: '', disabled: true }, [
					Validators.required,
					Validators.pattern('^[0-9]$')]),
				numberInput6: new FormControl({ value: '', disabled: true }, [
					Validators.required,
					Validators.pattern('^[0-9]$')]),
			});

		this.enableNumberInput(); // Habilita la entrada de números de validación
	}

	// Método para habilitar secuencialmente los campos de número de validación
	enableNumberInput(): void {
		for (let index = 1; index <= 6; index++) {
			if (this.form) {
				const CONTROL: AbstractControl<any, any> | null | undefined = this.form?.get(`numberInput${index}`);

				if (CONTROL) {
					const SUBSCRIPTION: Subscription = CONTROL.valueChanges.subscribe(value => {
						if (value !== null && value !== undefined) {
							const NEXT_CONTROL: AbstractControl<any, any> | null | undefined =
								this.form?.get(`numberInput${index + 1}`);
							if (NEXT_CONTROL) {
								NEXT_CONTROL.enable(); // Habilita el siguiente campo
								setTimeout(() => {
									document.getElementById(`numberInput${index + 1}`)?.focus(); // Enfoca el siguiente campo
								}, 0);
							}
						}
					});
					this.#subscription.add(SUBSCRIPTION); // Añade la suscripción al objeto de suscripciones
				}
			}
		}
	}

	// Método para guardar los datos del formulario
	save(): void {
		this.getAndValidateInputs(); // Valida y obtiene los datos de los campos
	}

	// Método para obtener y validar los valores de los campos de números de validación
	getAndValidateInputs(): void {
		if (this.form?.value) {
			let allFilled: boolean = true;
			let concatenatedValues: string = '';

			for (let i = 1; i <= 6; i++) {
				const inputControl = this.form.get(`numberInput${i}`);

				if (inputControl && inputControl.value) {
					concatenatedValues += inputControl.value; // Concatenar valores de los campos
				} else {
					allFilled = false;
					break;
				}
			}

			if (allFilled) {
				this.postAccountValidation(this.form.getRawValue().email.toLowerCase(), concatenatedValues);
			}
		}
	}

	// Método para enviar los datos de validación de la cuenta al servidor
	postAccountValidation(email: string, codeValidation: string): void {
		const BODY: any = {
			email: email,
			codeValidation: codeValidation
		};
		const SUBSCRIPTION: Subscription = this.userService.postAccountValidation(BODY)
			.subscribe((data: any): any => {
				if (data) {
					localStorage.setItem('user', JSON.stringify(data)); // Guarda los datos del usuario en localStorage
					this.router.navigate(['profile']); // Navega al perfil del usuario
				} else {
					alert('El inicio de sesion ha fallado'); // Alerta en caso de fallo
				}
			});
		this.#subscription.add(SUBSCRIPTION); // Añade la suscripción al objeto de suscripciones
	}

	// Método para navegar a la página de recuperación de contraseña
	goToRecoverPassword(): void {
		this.router.navigate(['recover-password']);
	}

	// Método que se ejecuta al destruir el componente
	ngOnDestroy(): void {
		this.#subscription.unsubscribe(); // Desuscribe todas las suscripciones
	}
}
