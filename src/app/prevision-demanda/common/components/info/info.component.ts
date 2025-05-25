import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
	selector: 'info-root',
	standalone: true,
	imports: [
		CommonModule,
		HttpClientModule
	],
	providers: [
	],
	templateUrl: './info.component.html',
	styleUrl: './info.component.scss'
})
export class InfoComponent implements OnInit {

	user!: any;

	constructor(
	) { }

	ngOnInit(): void {
	}

}
