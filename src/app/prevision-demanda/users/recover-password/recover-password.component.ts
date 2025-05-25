// Importación de módulos y clases necesarias desde Angular
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Importación de clases relacionadas con formularios reactivos
import { Router } from '@angular/router'; // Importación del enrutador de Angular
import { HttpClientModule } from '@angular/common/http'; // Importación del módulo para realizar solicitudes HTTP
import { NgIf } from '@angular/common'; // Importación de la directiva NgIf de Angular

// Importación del servicio UserService
import { UserService } from '../user.service';

@Component({
	selector: 'app-recover-password', // Selector del componente
	standalone: true, // Indicación de que el componente es independiente
	imports: [NgIf, ReactiveFormsModule, HttpClientModule], // Importación de módulos necesarios
	providers: [UserService], // Proveedor del servicio UserService
	templateUrl: './recover-password.component.html', // Ruta al archivo HTML del componente
	styleUrl: './recover-password.component.scss' // Ruta al archivo de estilos del componente
})
export class RecoverPasswordComponent {

	form?: FormGroup; // Variable para almacenar el formulario
	emailValid?: string; // Variable para almacenar la expresión regular para validar el correo electrónico

	constructor(
		protected router: Router, // Inyección del servicio Router
		protected formBuilder: FormBuilder, // Inyección del constructor de formularios
		protected readonly userService: UserService, // Inyección del servicio UserService
	) { }

	ngOnInit() {
		this.initForm(); // Método que inicializa el formulario
	}

	initForm(): void {
		// Expresión regular para validar el formato del correo electrónico
		this.emailValid = `^[a-zA-Z0-9.!#$%++/=?^_{|}-~]+@[a-zA-Z0-9.-]+(?:\\.[[a-zA-Z0-9]{2,4}$)`;
		// Creación del formulario reactivo
		this.form = new FormGroup(
			{
				email: new FormControl('', Validators.compose([
					Validators.required, // Campo obligatorio
					Validators.minLength(6), // Longitud mínima del correo electrónico
					Validators.maxLength(30), // Longitud máxima del correo electrónico
					Validators.pattern(this.emailValid) // Validación del formato del correo electrónico
				]))
			}
		);
	}

	save(): void {
		if (this.form?.value) { // Verificación de que el formulario tenga un valor
			this.getRecoverPassword(this.form.value.email.toLowerCase()); // Llamada a la función para recuperar la contraseña
		}
	}

	// Función para recuperar la contraseña
	getRecoverPassword(email: string): void {
		// Llamada al servicio UserService para recuperar la contraseña
		this.userService.getRecoverPassword(email)
			.subscribe((data: any): any => {
				if (data) { // Verificación de que se recibió una respuesta
					alert('Revise la vandeja de entrada'); // Alerta de éxito
					this.router.navigate(['login']); // Redirección a la página de inicio de sesión
				} else {
					alert('El inicio de sesion a fallado'); // Alerta de fallo
				}
			});
	}

}
