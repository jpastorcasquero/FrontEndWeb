// Importa el tipo ApplicationConfig desde el núcleo de Angular
import { ApplicationConfig } from '@angular/core';
// Importa el proveedor de rutas desde Angular Router
import { provideRouter } from '@angular/router';
// Importa las rutas definidas en otro archivo
import { routes } from './app.routes';
// Importa el proveedor de animaciones asincrónicas desde Angular
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Configuración de la aplicación
export const appConfig: ApplicationConfig = {
  // Define los proveedores utilizados por la aplicación
  providers: [
    // Proveedor para configurar las rutas de la aplicación
    provideRouter(routes),
    // Proveedor para habilitar las animaciones asincrónicas
    provideAnimationsAsync()
  ]
};
