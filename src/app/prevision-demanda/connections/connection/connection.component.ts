// Importación de los módulos y servicios necesarios
import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { InfoConnections } from '../connection.model';
import { ConnectionService } from './../connection.service';

// Definición de la constante DATA que contendrá los datos de las conexiones
const DATA: InfoConnections[] = [];

@Component({
  selector: 'app-connections',
  standalone: true,
  // Importación de los módulos necesarios para el componente
  imports: [MatCardModule, CommonModule, MatTableModule, MatPaginatorModule, NgIf, ReactiveFormsModule, HttpClientModule],
  // Proveedores de servicios para el componente
  providers: [ConnectionService],
  // Plantilla y estilos del componente
  templateUrl: './connection.component.html',
  styleUrl: './connection.component.scss'
})

export class ConnectionsComponent implements OnInit {
  // Definición de propiedades de entrada
  @Input() titulos: any;
  @Input() filas: any;

  // Definición de las columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['id', 'user', 'connectionDate', 'disconnectionDate'];
  // Fuente de datos de la tabla
  dataSource = new MatTableDataSource<InfoConnections>();

  // Referencia al paginador de la tabla
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    protected readonly connectionService: ConnectionService
  ) { }

  ngOnInit(): void {
    // Método que se llama al inicializar el componente para obtener las conexiones del usuario
    this.getConnectionUser();
  }

  ngAfterViewInit() {
    // Configuración del paginador después de que la vista esté completamente cargada
    this.dataSource.paginator = this.paginator;
  }

  // Método para obtener las conexiones del usuario
  getConnectionUser(): void {
    // Se obtiene la información del usuario desde el almacenamiento local
    const userData = localStorage.getItem('user');
    console.log(userData);
    if (userData) {
      const user = JSON.parse(userData);
      console.log(user);
      if (user.id != null) {
        const userId = user.id.toString();
        // Se llama al servicio para obtener las conexiones del usuario
        this.connectionService.getConnectionUser(userId).subscribe((data: any[]) => {
          // Se transforma la información obtenida en el formato necesario para la tabla
          const newData: InfoConnections[] = data.map(connection => ({
            id: connection.id,
            user: user.nick_name, // Ojo, que este campo lo cojo de user
            connectionDate: connection.connection_date,
            disconnectionDate: connection.disconnection_date
          }));
          console.log(newData);
          // Se asignan los datos a la fuente de datos de la tabla
          this.dataSource.data = newData;
        });
      } else {
        alert("No se puede capturar el usuario");
      }
    } else {
      alert("No existe usuario");
    }
  }
}
