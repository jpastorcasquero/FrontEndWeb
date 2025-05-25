// Importamos librerias y componentes
// Esta función se usa para iniciar una aplicación Angular.
import { bootstrapApplication } from '@angular/platform-browser';
// Esta configuración contiene las opciones necesarias para inicializar la aplicación.
import { appConfig } from './app/app.config';
// Este es el componente raíz de la aplicación Angular.
import { AppComponent } from './app/component/app.component';

// Inicia la aplicación Angular utilizando el componente raíz y la configuración de la aplicación.
bootstrapApplication(AppComponent, appConfig)
	// Si hay un error durante la inicialización, lo captura y lo muestra en la consola.
	.catch((err) => console.error(err));
