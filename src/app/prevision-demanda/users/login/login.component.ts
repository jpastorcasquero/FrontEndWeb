// Importación de los módulos y servicios necesarios de Angular
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordStrengthValidator } from '../../core/validators/passwordStrengthValidator';
import { UserService } from '../user.service';

// Decorador que define el componente 'LoginComponent'
@Component({
  selector: 'app-login',  // Nombre del selector del componente
  standalone: true,  // Indica que este componente es independiente
  imports: [NgIf, ReactiveFormsModule, HttpClientModule],  // Importaciones necesarias para el componente
  providers: [UserService],  // Proveedores de servicios que utiliza este componente
  templateUrl: './login.component.html',  // Ruta al archivo de la plantilla HTML del componente
  styleUrl: './login.component.scss',  // Ruta al archivo de estilos SCSS del componente
})
export class LoginComponent implements OnInit {

  form?: FormGroup;  // Definición del formulario como una propiedad opcional de tipo FormGroup
  emailValid?: string;  // Patrón de validación para el correo electrónico

  // Constructor del componente donde se inyectan las dependencias necesarias
  constructor(
    protected router: Router,  // Servicio de enrutamiento para la navegación
    protected formBuilder: FormBuilder,  // Servicio para la creación de formularios reactivos
    protected readonly userService: UserService  // Servicio del usuario para realizar operaciones relacionadas con el usuario
  ) { }

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    this.initForm();  // Inicializa el formulario
  }

  // Método para inicializar el formulario con sus controles y validaciones
  initForm(): void {
    // Expresión regular para validar el formato del correo electrónico
    this.emailValid = `^[a-zA-Z0-9.!#$%++/=?^_{|}-~]+@[a-zA-Z0-9.-]+(?:\\.[[a-zA-Z0-9]{2,4}$)`;
    // Creación del formulario con sus controles y validaciones
    this.form = new FormGroup(
      {
        email: new FormControl('', Validators.compose([
          Validators.required,  // Campo requerido
          Validators.minLength(6),  // Longitud mínima de 6 caracteres
          Validators.maxLength(30),  // Longitud máxima de 30 caracteres
          Validators.pattern(this.emailValid)])),  // Patrón de validación del correo electrónico
        password: new FormControl('', Validators.compose([
          PasswordStrengthValidator.validPasswordStrength,  // Validador de fuerza de contraseña
          Validators.required,  // Campo requerido
          Validators.minLength(8),  // Longitud mínima de 8 caracteres
          Validators.maxLength(20)  // Longitud máxima de 20 caracteres
        ])),
      }
    );
  }

  // Método para manejar el evento de guardar (inicio de sesión)
  save(): void {
    if (this.form?.value) {  // Verifica si el formulario tiene valores
      // Llama al método de inicio de sesión con los valores del formulario
      this.getLogin(this.form.value.email.toLowerCase(), this.form.value.password);
    }
  }

  // Método para realizar el inicio de sesión
  getLogin(email: string, password: string): void {
    // Llama al servicio de usuario para realizar el inicio de sesión
    this.userService.getLogin(email, password)
      .subscribe((data: any): any => {  // Se suscribe al observable para manejar la respuesta
        if (data) {  // Si hay datos en la respuesta
          console.log(data)
          localStorage.setItem('user', JSON.stringify(data.user));    // Guarda los datos del usuario en el almacenamiento local
          console.log("imprimierndo datos de usuario"+localStorage.getItem('user'))
          this.router.navigate(['info']);  // Navega a la página de conversaciones
        } else {
          alert('El inicio de sesión ha fallado');  // Muestra una alerta si el inicio de sesión falla
        }
      });
  }

  // Método para navegar a la página de recuperación de contraseña
  goToRecoverPassword(): void {
    this.router.navigate(['recover-password']);  // Navega a la página de recuperación de contraseña
  }
}
