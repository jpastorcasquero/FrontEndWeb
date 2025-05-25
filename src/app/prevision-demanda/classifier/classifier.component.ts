import { Component, OnInit, ViewChild } from '@angular/core';
import { ClassifierService } from './classifier.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import * as XLSX from 'xlsx';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-classifier',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressBarModule,
    NgChartsModule
  ],
  providers: [ClassifierService],
  templateUrl: './classifier.component.html',
  styleUrls: ['./classifier.component.scss']
})
export class ClassifierComponent implements OnInit {
  displayedColumns: string[] = ['Modelo', 'RMSLE', 'Precision'];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  loading = false;
  error = false;
  errorMessage = '';
  loadingError = false;

  // Configuración del gráfico
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    }
  };

  barChartType: 'bar' = 'bar';

  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'RMSLE',
        backgroundColor: '#42A5F5'
      }
    ]
  };

  constructor(private classifierService: ClassifierService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ejecutarProceso() {
    if (this.loading) {
      this.loadingError = true;
      return;
    }

    this.loading = true;
    this.error = false;
    this.loadingError = false;
    this.dataSource.data = [];

    this.classifierService.getClassifier().subscribe({
      next: (response) => {
        this.dataSource.data = response;
        this.dataSource.paginator = this.paginator;
        this.updateChart(response);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = `Error Code: ${err.status ?? 'sin código'}\nMessage: ${err.message ?? 'Sin mensaje'}`;
        this.error = true;
        this.loading = false;
      }
    });
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clasificador');
    XLSX.writeFile(wb, 'clasificador.xlsx');
  }

  updateChart(data: any[]): void {
    const labels = data.map(d => d.Modelo);
    const values = data.map(d => d.RMSLE);
    this.barChartData.labels = labels;
    this.barChartData.datasets[0].data = values;
    this.chart?.update();
  }
}
