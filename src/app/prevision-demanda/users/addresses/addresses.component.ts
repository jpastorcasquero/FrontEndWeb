import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressesService, AddressDTO } from './addresses.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, HttpClientModule],
  providers: [AddressesService],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.scss',
})
export class AddressesComponent implements OnInit {

  form?: FormGroup;

  constructor(
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected readonly addressesService: AddressesService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAddresses();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      address: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÀ-ÿ0-9\s.,ºª()\-#\/]{5,100}$/)

      ]],
      city: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,40}$/)
      ]],
      country: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,40}$/)
      ]],
      postalNumber: ['', [
        Validators.required,
        Validators.pattern(/^\d{5}$/)
      ]]
    });
  }

  loadAddresses(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.id) {
        this.addressesService.getAddress(user.id).subscribe({
          next: (addresses) => {
            if (addresses && addresses.length > 0) {
              const first = addresses[0];
              this.form?.setValue({
                address: first.address,
                city: first.city,
                country: first.country,
                postalNumber: first.postal_code
              });
              user.addresses = addresses;
              localStorage.setItem('user', JSON.stringify(user));
            }
          },
          error: err => console.error('Error al cargar direcciones:', err)
        });
      }
    }
  }

  saveAddresses(): void {
    const userString = localStorage.getItem('user');
    if (!userString || !this.form) return;

    const user = JSON.parse(userString);
    const addressForm = this.form.value;

    const dto: AddressDTO = {
      user_id: user.id,
      country: addressForm.country,
      city: addressForm.city,
      address: addressForm.address,
      postal_code: addressForm.postalNumber
    };

    if (!user.addresses || user.addresses.length === 0) {
      this.addressesService.postAddress(dto).subscribe({
        next: () => {
          user.addresses = [dto];
          localStorage.setItem('user', JSON.stringify(user));
          console.log('Dirección guardada correctamente.');
        },
        error: err => console.error('Error al guardar dirección:', err)
      });
    } else {
      dto.id = user.addresses[0].id;
      this.addressesService.editAddress(dto).subscribe({
        next: () => {
          user.addresses[0] = dto;
          localStorage.setItem('user', JSON.stringify(user));
          console.log('Dirección actualizada correctamente.');
        },
        error: err => console.error('Error al actualizar dirección:', err)
      });
    }
  }

  deleteAddressButton(): void {
    const userString = localStorage.getItem('user');
    if (!userString) return;

    const user = JSON.parse(userString);
    if (user.addresses?.length > 0) {
      const id = user.addresses[0].id;
      this.addressesService.deleteAddress(id).subscribe({
        next: () => {
          user.addresses = [];
          localStorage.setItem('user', JSON.stringify(user));
          this.initForm();
          this.loadAddresses();
          console.log('Dirección eliminada correctamente.');
        },
        error: err => console.error('Error al eliminar dirección:', err)
      });
    }
  }
}
