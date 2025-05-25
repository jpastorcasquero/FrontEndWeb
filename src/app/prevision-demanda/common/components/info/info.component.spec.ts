import { TestBed } from '@angular/core/testing';
import { InfoComponent } from './info.component';

describe('InfoComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [InfoComponent],
		}).compileComponents();
	});

	it('should render title', () => {
		const fixture = TestBed.createComponent(InfoComponent);
		fixture.detectChanges();
		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector('h1')?.textContent).toContain('Hello, JPC-Informatica-fornt');
	});
});
