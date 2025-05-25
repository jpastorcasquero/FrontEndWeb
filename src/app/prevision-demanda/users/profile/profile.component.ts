import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { UserService } from '../user.service';
import { EqualPasswordValidator } from '../../core/validators/equalPasswordValidator';
import { PasswordStrengthValidator } from '../../core/validators/passwordStrengthValidator';
import { UserMailValidator } from '../../core/validators/userMailValidator';
import { IValidEqualPassword } from '../user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, HttpClientModule],
  providers: [UserService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  form?: FormGroup;
  lettersAndAccents = '^([a-z A-ZÀ-ÿ\u00f1\u00d1]+(\\s*[a-z A-ZÀ-ÿ\u00f1\u00d1]*)*[a-z A-ZÀ-ÿ\u00f1\u00d1])+$';
  unaccentedLettersAndNumbers = '^[A-Za-z0-9]+$';
  emailValid = '^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

  constructor(
    protected router: Router,
    protected userService: UserService,
    protected formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
  }

  initForm(): void {
    this.form = new FormGroup(
      {
        name: new FormControl('', [
          Validators.minLength(3),
          Validators.maxLength(33),
          Validators.pattern(this.lettersAndAccents),
        ]),
        nickName: new FormControl('', [
          Validators.minLength(3),
          Validators.maxLength(33),
          Validators.pattern(this.unaccentedLettersAndNumbers),
        ]),
        email: new FormControl(
          '',
          [
            Validators.minLength(6),
            Validators.maxLength(30),
            Validators.pattern(this.emailValid),
          ],
          UserMailValidator.validUserMail(this.userService)
        ),
        password: new FormControl('', [
          Validators.minLength(8),
          Validators.maxLength(20),
          PasswordStrengthValidator.validPasswordStrength,
        ]),
        passwordConfirm: new FormControl('', [
          Validators.minLength(8),
          Validators.maxLength(20),
          PasswordStrengthValidator.validPasswordStrength,
        ]),
      },
      {
        validators: EqualPasswordValidator.validEqualPassword,
      }
    );
  }

  loadUserData(): void {
    const userData = localStorage.getItem('user');
    if (userData && this.form) {
      const user = JSON.parse(userData);
      this.form.patchValue({
        name: user.name || '',
        nickName: user.nick_name || '',
        email: user.email || '',
      });
    }
  }

  save(): void {
    if (!this.form?.valid) return;

    const userData = localStorage.getItem('user');
    if (!userData) return;

    const storedUser = JSON.parse(userData);
    const formValue = this.form.value;

    const updatedUser = {
      id: storedUser.id,
      name: formValue.name || storedUser.name,
      nick_name: formValue.nickName || storedUser.nick_name,
      email: formValue.email || storedUser.email,
      password: formValue.password || storedUser.password,
      role: storedUser.role,
      image: storedUser.image,
    };

    this.userService.putEditUser(updatedUser).subscribe({
      next: (data: any) => {
        if (data) {
          // Fusionar con los datos anteriores
          const mergedUser = {
            ...storedUser,
            ...data
          };
          localStorage.setItem('user', JSON.stringify(mergedUser));
          this.router.navigate(['profile']);
        }
      },
      error: (error) => {
        console.error('❌ Error al actualizar el usuario:', error);
        const errorMsg = error?.error?.error || 'Error interno del servidor.';
        alert(`⚠️ ${errorMsg}`);
      }
    });
  }

  deleteUser(): void {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const storedUser = JSON.parse(userData);

    this.userService.deleteUser(storedUser.id).subscribe((data: any) => {
      if (data) {
        localStorage.removeItem('user');
        this.router.navigate(['register']);
      }
    });
  }
}
