// Importación de módulos y componentes necesarios
import { NgIf } from '@angular/common';
import { AfterContentChecked, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
	selector: 'app-navbar',
	standalone: true,
	// Importación de RouterModule y NgIf
	imports: [
		RouterModule, NgIf
	],
	// Plantilla y estilos del componente
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements AfterContentChecked {

	// Propiedad para verificar si hay un usuario autenticado
	is_user?: boolean;
	// Propiedad para controlar la visibilidad del menú
	showMenu = false;
	// Ruta de la imagen de avatar del usuario
	avatarImageUser: string | undefined;

	constructor(
		protected router: Router
	) { }

	ngAfterContentChecked(): void {
		// Comprobar si hay un usuario autenticado
		if (localStorage.getItem('user')) {
			this.is_user = true;
			// Obtener los datos del usuario desde el almacenamiento local
			var user = localStorage.getItem('user') ?? '';
			var userData = JSON.parse(user);
			// Construir la ruta de la imagen de avatar del usuario
			this.avatarImageUser = "https://jpastorcasquero.pythonanywhere.com/static/AvataresImage/" + userData.image;
		} else {
			this.is_user = false;
		}
	}

	// Método para cerrar la sesión del usuario
	closeSesion() {
		localStorage.clear(); // Limpiar el almacenamiento local
		this.router.navigate(['register']); // Redirigir a la página de registro
	}

	// Método para alternar la visibilidad del menú
	toggleMenu() {
		console.log("toggleMenu");
		this.showMenu = !this.showMenu; // Alternar el estado de la propiedad showMenu
		console.log("toggleMenu:", this.showMenu);
	}

	// Método para cerrar el menú
	closeMenu() {
		this.showMenu = false; // Establecer showMenu en false para cerrar el menú
	}
}
