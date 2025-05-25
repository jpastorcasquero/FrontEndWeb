// Importa el módulo de rutas de Angular
import { Routes } from '@angular/router';
import { RegisterComponent } from './prevision-demanda/users/register/register.component';
import { AccountValidationComponent } from './prevision-demanda/users/account-validation/account-validation.component';
import { InfoComponent } from './prevision-demanda/common/components/info/info.component';
import { ConnectionsComponent } from './prevision-demanda/connections/connection/connection.component';
import { AddressesComponent } from './prevision-demanda/users/addresses/addresses.component';
import { LoginComponent } from './prevision-demanda/users/login/login.component';
import { PhoneUserComponent } from './prevision-demanda/users/phone-user/phone-user.component';
import { ProfileComponent } from './prevision-demanda/users/profile/profile.component';
import { RecoverPasswordComponent } from './prevision-demanda/users/recover-password/recover-password.component';
import { RestorePasswordComponent } from './prevision-demanda/users/restore-password/restore-password.component';
import { ClassifierComponent } from './prevision-demanda/classifier/classifier.component';
import { PredictionComponent } from './prevision-demanda/prediction/prediction.component';

// Importa los componentes que se utilizarán en las rutas



// Define las rutas de la aplicación
export const routes: Routes = [
  // Ruta para el registro de usuarios
  { path: 'register', component: RegisterComponent },
  // Ruta para la validación de cuenta, usando un parámetro para el correo electrónico
  { path: 'account-validation/:email', component: AccountValidationComponent },
  // Ruta para el inicio de sesión
  { path: 'login', component: LoginComponent },
  // Ruta para la información de la aplicación
  { path: 'info', component: InfoComponent },
  // Ruta para el perfil de usuario
  { path: 'profile', component: ProfileComponent },
  // Ruta para la recuperación de contraseña
  { path: 'recover-password', component: RecoverPasswordComponent },
  // Ruta para restaurar la contraseña, usando un parámetro para el correo electrónico
  { path: 'restore-password/:email', component: RestorePasswordComponent },
  // Ruta para el perfil de usuario (duplicada)
  { path: 'profile', component: ProfileComponent },
  // Ruta para las conexiones de usuario
  { path: 'connections', component: ConnectionsComponent },
  // Ruta para el registro de usuarios (duplicada)
  { path: 'register', component: RegisterComponent },
  // Ruta para el inicio de sesión (duplicada)
  { path: 'login', component: LoginComponent },
  // Ruta para el perfil de usuario (duplicada)
  { path: 'profile', component: ProfileComponent },
  // Ruta para el usuario de teléfono
  { path: 'phone-user', component: PhoneUserComponent },
  // Ruta para las direcciones del usuario
  { path: 'addresses-user', component: AddressesComponent },
  // Ruta para obtener un clasificador
  { path: 'get-classifier', component: ClassifierComponent },
  // Ruta para obtener un clasificador
  { path: 'get-prediction', component: PredictionComponent },
];

