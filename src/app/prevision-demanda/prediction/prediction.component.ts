import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PredictionService } from './prediction.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartConfiguration } from 'chart.js';

interface Prediction {
  datetime: string;
  season: number;
  workingday: number;
  holiday: number;
  temp: number;
  atemp: number;
  humidity: number;
  windspeed: number;
  Count_Predict: number;
}

@Component({
  selector: 'app-prediction',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressBarModule,
    NgChartsModule
  ],
  providers: [PredictionService, DatePipe],
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'datetime', 'dayOfWeek', 'workingday', 'holiday',
    'temp', 'atemp', 'humidity', 'windspeed', 'Count_Predict'
  ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  loading = false;
  error = false;
  errorMessage = '';
  loadingError = false;

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { ticks: { autoSkip: true, maxRotation: 90, minRotation: 45 } },
      y: { title: { display: true, text: 'Alquileres (predicción)' } }
    }
  };

  lineChartType: 'line' = 'line';

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Alquileres por hora',
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.3,
        pointRadius: 2
      }
    ]
  };

  constructor(
    private predictionService: PredictionService,
    private datePipe: DatePipe
  ) {}

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

    this.predictionService.getPrediction().subscribe({
      next: (response: Prediction[]) => {
        const formattedData = response.map((item: Prediction) => {
          const formattedDate = this.datePipe.transform(item.datetime, 'dd/MM/yyyy - HH:mm')!;
          return {
            ...item,
            datetime: formattedDate,
            dayOfWeek: this.getDayOfWeek(formattedDate),
            workingday: item.workingday ? 'Sí' : 'No',
            holiday: item.holiday ? 'Sí' : 'No',
            temp: item.temp.toFixed(2),
            atemp: item.atemp.toFixed(2),
            humidity: `${item.humidity}%`,
            windspeed: item.windspeed.toFixed(2),
            Count_Predict: `<b>${item.Count_Predict}</b>`
          };
        });

        this.dataSource.data = formattedData;
        this.dataSource.paginator = this.paginator;
        this.updateChart(formattedData);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
        this.error = true;
        this.loading = false;
      }
    });
  }

  getDayOfWeek(dateString: string): string {
    const [day, month, year] = dateString.split(' - ')[0].split('/');
    const date = new Date(Number(year), Number(month) - 1, Number(day)); // cuidado con mes - 1
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return days[date.getDay()];
  }


  exportToExcel() {
    const dataToExport = this.dataSource.data.map(element => ({
      ...element,
      Count_Predict: element.Count_Predict.replace(/<\/?b>/g, '')
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Predictions');

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'predictions');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }

  updateChart(data: any[]): void {
    this.lineChartData.labels = data.map(d => d.datetime);
    this.lineChartData.datasets[0].data = data.map(d =>
      parseInt(d.Count_Predict.replace(/<\/?b>/g, ''), 10)
    );
    this.chart?.update();
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
