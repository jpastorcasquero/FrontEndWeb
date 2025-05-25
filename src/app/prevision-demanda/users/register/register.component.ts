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
	selector: 'app-register',
	standalone: true,
	imports: [NgIf, ReactiveFormsModule, HttpClientModule],
	providers: [UserService],
	templateUrl: './register.component.html',
	styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
	form?: FormGroup;
	lettersAndAccents?: string;
	unaccentedLettersAndNumbers?: string;
	emailValid?: string;
	selectedImage: string = "avatar1.png";

	userForm?: FormGroup;

	constructor(
		protected router: Router,
		protected userService: UserService,
		protected formBuilder: FormBuilder,
	) { }

	ngOnInit() {
		this.initForm();
	}

	initForm(): void {
		this.lettersAndAccents = `^([a-z A-ZÀ-ÿ\u00f1\u00d1]+(\\s*[a-z A-ZÀ-ÿ\u00f1\u00d1]*)*[a-z A-ZÀ-ÿ\u00f1\u00d1])+$`;
		this.unaccentedLettersAndNumbers = '^[A-Za-z0-9]+$';
		this.emailValid = `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`;

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
					Validators.pattern(this.emailValid)
				]), UserMailValidator.validUserMail(this.userService)),
				password: new FormControl('', Validators.compose([
					Validators.required,
					Validators.minLength(8),
					Validators.maxLength(20),
					PasswordStrengthValidator.validPasswordStrength
				])),
				passwordConfirm: new FormControl('', Validators.compose([
					Validators.required,
					Validators.minLength(8),
					Validators.maxLength(20),
					PasswordStrengthValidator.validPasswordStrength
				])),
				acept1: new FormControl('', Validators.requiredTrue),
				acept2: new FormControl('', Validators.requiredTrue)
			},
			(formGroup: AbstractControl): IValidEqualPassword | null => {
				return EqualPasswordValidator.validEqualPassword(formGroup);
			}
		);
	}

	selectImage(event: any) {
		const checkbox = event.target as HTMLInputElement;
		if (checkbox.checked) {
			this.selectedImage = checkbox.value;
			const checkboxes = document.querySelectorAll('input[type="checkbox"]');
			checkboxes.forEach((cb: Element) => {
				const cbInput = cb as HTMLInputElement;
				if (cbInput !== checkbox) {
					cbInput.checked = false;
				}
			});
			console.log('Imagen seleccionada:', this.selectedImage);
		}
	}

	// Validación manual extra por si el validador personalizado falla silenciosamente
	isPasswordComplex(password: string): boolean {
		const hasUpper = /[A-Z]/.test(password);
		const hasLower = /[a-z]/.test(password);
		const hasNumber = /[0-9]/.test(password);
		const hasSymbol = /[^A-Za-z0-9]/.test(password);
		return hasUpper && hasLower && hasNumber && hasSymbol;
	}

	save(): void {
		if (this.form?.pending) {
			alert("⏳ Aún se están validando los campos. Espera un momento.");
			return;
		}

		if (this.form?.valid) {
			const password = this.form.value.password;

			if (!this.isPasswordComplex(password)) {
				alert("❌ La contraseña debe contener mayúsculas, minúsculas, números y símbolos.");
				return;
			}

			const USER = {
				name: this.form.value.name,
				email: this.form.value.email,
				nick_name: this.form.value.nickName,
				role: "user",
				password: password,
				image: this.selectedImage,
			};

			console.log("✅ Registrando usuario:", USER);
			this.postRegister(USER);
		} else {
			console.warn("❌ Formulario inválido:", this.form?.errors, this.form?.value);

			// Ver qué campo está mal
			Object.keys(this.form?.controls || {}).forEach(key => {
				const control = this.form?.get(key);
				console.log(`  ${key}:`, {
					valid: control?.valid,
					errors: control?.errors
				});
			});

			alert("❌ El formulario contiene errores. Revisa los campos obligatorios.");
		}
	}



	postRegister(user: any): void {
		this.userForm = this.formBuilder.group(user);
		this.userService.postRegister(this.userForm.value)
			.subscribe({
				next: (data: any) => {
					if (data) {
						localStorage.setItem('user', JSON.stringify(data));
						alert("✅ Usuario creado con éxito. Ahora puedes iniciar sesión.");
						this.router.navigate(['/login']);
					}
				},
				error: (err) => {
					console.error("❌ Error al registrar:", err);
					alert("❌ Error al registrar usuario. Inténtalo de nuevo.");
				}
			});
	}
}
