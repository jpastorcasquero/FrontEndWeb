import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { FooterComponent } from '../prevision-demanda/common/components/footer/footer.component';
import { NavbarComponent } from '../prevision-demanda/common/components/navbar/navbar.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		CommonModule,
		RouterOutlet,
		HttpClientModule,
		NavbarComponent,
		FooterComponent
	],
	providers: [
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

	user!: any;
	main: any = false;

	constructor(
		private router: Router
	) { }

	ngOnInit() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				// Verifica si la ruta actual es 'info' y establece main como false
				this.main = event.url === '/';
			}
		});
	}

}
