import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PhoneService } from './phone.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-phone-user',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, HttpClientModule],
  providers: [PhoneService],
  templateUrl: './phone-user.component.html',
  styleUrl: './phone-user.component.scss',
})
export class PhoneUserComponent implements OnInit {

  form?: FormGroup;

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected readonly phoneService: PhoneService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadPhones();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      countryCode: ['+34', Validators.required],
      phoneNumber: ['', Validators.required],
      countryCode2: ['+34', Validators.required],
      phoneNumber2: ['', Validators.required]
    });
  }

  loadPhones(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      const userId = user.id;
      this.phoneService.getPhone(userId).subscribe({
        next: (phones: any[]) => {
          user.phones = phones;
          localStorage.setItem('user', JSON.stringify(user));
          const [p1, p2] = phones;
          this.form?.setValue({
            countryCode: p1?.country_code || '+34',
            phoneNumber: p1?.phone || '',
            countryCode2: p2?.country_code || '+34',
            phoneNumber2: p2?.phone || ''
          });
        },
        error: err => console.error('Error al cargar los teléfonos:', err)
      });
    }
  }

  savePhone(): void {
    const userString = localStorage.getItem('user');
    if (!userString || !this.form) return;

    const user = JSON.parse(userString);
    const formData = this.form.value;

    const phone1 = {
      country_code: formData.countryCode,
      phone: formData.phoneNumber,
      user_id: user.id
    };
    const phone2 = {
      country_code: formData.countryCode2,
      phone: formData.phoneNumber2,
      user_id: user.id
    };

    const phones = user.phones || [];

    const observables: Observable<any>[] = [];

    // Teléfono principal
    if (!phones[0] && formData.phoneNumber) {
      observables.push(this.save(phone1));
    } else if (phones[0] && formData.phoneNumber) {
      const dto = { ...phone1, id: phones[0].id };
      observables.push(this.phoneService.getEdit(dto));
    } else if (phones[0]) {
      observables.push(this.phoneService.deletePhone(phones[0].id));
    }

    // Teléfono secundario
    if (!phones[1] && formData.phoneNumber2) {
      observables.push(this.save(phone2));
    } else if (phones[1] && formData.phoneNumber2) {
      const dto = { ...phone2, id: phones[1].id };
      observables.push(this.phoneService.getEdit(dto));
    } else if (phones[1]) {
      observables.push(this.phoneService.deletePhone(phones[1].id));
    }

    // Ejecuta y luego refresca
    observables.forEach(obs => {
      obs.subscribe({
        next: () => {
          this.loadPhones();
        },
        error: err => console.error("Error en operación sobre teléfono:", err)
      });
    });
  }

  save(phone: any): Observable<any> {
    return new Observable(observer => {
      this.phoneService.postRegister(phone).subscribe({
        next: (data: any) => {
          if (data) {
            observer.next(data);
            observer.complete();
          } else {
            observer.error('El guardado ha fallado');
          }
        },
        error: err => observer.error(err)
      });
    });
  }

  deletePhoneButton(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user.phones?.length > 0) {
        const phoneId = user.phones[0].id;
        this.phoneService.deletePhone(phoneId).subscribe({
          next: () => {
            user.phones.splice(0, 1);
            localStorage.setItem('user', JSON.stringify(user));
            this.initForm();
            this.loadPhones();
          },
          error: err => console.error("Error al eliminar teléfono 1:", err)
        });
      }
    }
  }

  deletePhone2Button(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      if (user.phones?.length === 2) {
        const phoneId = user.phones[1].id;
        this.phoneService.deletePhone(phoneId).subscribe({
          next: () => {
            user.phones.splice(1, 1);
            localStorage.setItem('user', JSON.stringify(user));
            this.initForm();
            this.loadPhones();
          },
          error: err => console.error("Error al eliminar teléfono 2:", err)
        });
      }
    }
  }
}
