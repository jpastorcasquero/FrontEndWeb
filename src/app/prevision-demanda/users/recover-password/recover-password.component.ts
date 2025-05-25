import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service';
import { NgIf, NgClass } from '@angular/common'; 

@Component({
	selector: 'app-recover-password',
	standalone: true,
	imports: [NgIf, ReactiveFormsModule, HttpClientModule, NgClass],
	providers: [UserService],
	templateUrl: './recover-password.component.html',
	styleUrl: './recover-password.component.scss'
})
export class RecoverPasswordComponent {
	form?: FormGroup;
	emailValid?: string;
	message: string = '';
	messageClass: string = ''; // ✅ clase para color del mensaje

	constructor(
		protected router: Router,
		protected formBuilder: FormBuilder,
		protected readonly userService: UserService
	) {}

	ngOnInit() {
		this.initForm();
	}

	initForm(): void {
		this.emailValid = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
		this.form = new FormGroup({
			email: new FormControl('', Validators.compose([
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(50),
				Validators.pattern(this.emailValid)
			]))
		});
	}

	save(): void {
		if (this.form?.valid && this.form.value?.email) {
			this.sendRecoverEmail(this.form.value.email.toLowerCase());
		}
	}

	sendRecoverEmail(email: string): void {
		this.message = '';
		this.messageClass = '';
		this.userService.postRecoverPassword(email).subscribe({
			next: () => {
				this.message = '✅ Revisa tu bandeja de entrada';
				this.messageClass = 'alert-success';
				setTimeout(() => {
					this.router.navigate(['login']);
				}, 2500);
			},
			error: (error: any) => {
				this.message = '❌ ' + error;
				this.messageClass = 'alert-danger';
			}
		});
	}
}
