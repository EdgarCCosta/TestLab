import { AfterViewInit, Component, OnInit } from '@angular/core';
import { EstadisticaService } from '../../../services/estadistica-service';
import { EvolutionResponse, SuccessRatesResponse } from '../../../models/dashboardData';
import { forkJoin } from 'rxjs';
import { LoadingComponent } from '../../../layout/shared/loading/loading';

import { SpinnerService } from '../../../services/spinner-service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-estadistica',
  imports: [LoadingComponent],
  templateUrl: './estadistica.html',
  styleUrl: './estadistica.css',
})
export class Estadistica implements OnInit {

  public graficoEvolucion: any;
  public graficoEstados: any;
  public graficoComparativaProyectos: any;

  public dashboard: any = null;
  public summary: any = null;
  public loading = true;
  public evolution: EvolutionResponse['data']['evolution'] = [];
  public successRates: SuccessRatesResponse['data'] | null = null;
  public pending_total = 0;
  public pending_rate = 0;
  



  constructor(private _estadisticaService: EstadisticaService, public _spinnerService: SpinnerService) {}

  ngOnInit(): void {
    this.loading = true;
  forkJoin({
      main: this._estadisticaService.getMainDashboard(),
      evolution: this._estadisticaService.getLastSixMonths(),
      rates: this._estadisticaService.getSuccessRates()
    }).subscribe(({ main, evolution, rates }) => {

      // Dashboard
      this.dashboard = main.data.dashboard;
      this.summary = main.data.summary;

      // Evolución mensual
      this.evolution = evolution.data.evolution;

      // Success rates
      this.successRates = rates.data;

      this.pending_total =
        this.successRates.total_executed -
        this.successRates.total_passed -
        this.successRates.total_failed;

        this.pending_rate = Number(
          ((this.pending_total / this.successRates.total_executed) * 100).toFixed(2)
        );
        // Crear gráficos cuando TODO está listo
        this.createGraphics();

        this.loading = false;
      });



  }

  createGraphics() {
    this.createGraficoEvolucion();
    this.createGraficoEstados();
    this.createGraficoComparativaProyectos();
    this.createGraficoComparativaUsuarios();
  }

    private getMonthName(month: number): string {
      const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
      return meses[month - 1];
    }


  createGraficoEvolucion() {

    if (this.graficoEvolucion) this.graficoEvolucion.destroy();

    const labels = this.evolution.map(m => `${this.getMonthName(Number(m.month))} ${m.year}`);
    console.log(labels);
    const passed = this.evolution.map(m => m.passed);
    const failed = this.evolution.map(m => m.failed);
    console.log(passed);
    console.log(failed);



    this.graficoEvolucion = new Chart("GraficoEvolucion", {
      data: {
        datasets: [{
          type: 'line',
          label: 'Pasados',
          data: passed
        },
        {
          type: 'line',
          label: 'Fallidos',
          data: failed
        }],
        labels: labels
      },
      options: {
        responsive: true,
        aspectRatio: 1,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 14
              }
            }
          },
        },
        scales: {
          x: {
            stacked: false
          },
          y: {
            stacked: false
          }
        },
      }
    });
  }

  createGraficoEstados(): void {

    // const datos = {
    //   labels: this.totales.map(mix => mix.tipo),
    //   datasets: [{
    //     label: "Distribución de estados",
    //     data: this.totales.map(mix => mix.megavatios),
    //     hoverOffset: 4
    //   }]
    // };
    const passed = this.summary.success_rate;
    const failed = this.summary.failure_rate;
    const pending = 100 - passed - failed;


    this.graficoEstados = new Chart("GraficoEstados", {
      type: 'doughnut',
      data: {labels: ['pasados', 'fallidos', 'pendientes'], datasets: [{label: "", data: [passed, failed, pending], hoverOffset: 4}]},
      options: {
        responsive: true,
        aspectRatio: 1,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 14
              }
            }
          },
          title: {
            display: false,
            text: 'Distribución de estados',
            font: {
              size: 20
            }
          }
        }
      }
    });
  }

  createGraficoComparativaProyectos(): void {

    let dataPasados = {
      label: 'Pasados',
      data: [85, 85, 85],
      // backgroundColor: 'green'
    }

    let dataFallidos = {
      label: 'Fallidos',
      data: [15, 15, 15],
      // backgroundColor: 'red'
    }

    this.graficoComparativaProyectos = new Chart("GraficoComparativaProyectos", {
      type: 'bar',
      data: {
        labels: ['Proyecto A', 'Proyecto B', 'Proyecto C'],
        datasets: [dataPasados, dataFallidos],
      },
      options: {
        responsive: true,
        aspectRatio: 1,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 14
              }
            }
          },
        }
      }
    });

  }


  createGraficoComparativaUsuarios(): void {

    let dataEjecutados = {
      label: 'Ejecutados',
      data: [150, 120, 85, 75],
      // backgroundColor: 'green'
    }

    let dataPasados = {
      label: 'Pasados',
      data: [140, 100, 60, 70],
      // backgroundColor: 'red'
    }

    this.graficoComparativaProyectos = new Chart("GraficoComparativaUsuarios", {
      type: 'bar',
      data: {
        labels: ['Usuario A', 'Usuario B', 'Usuario C', 'Usuario D'],
        datasets: [dataEjecutados, dataPasados],
      },
      options: {
        responsive: true,
        aspectRatio: 1,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 14
              }
            }
          },
        }
      }
    });

  }
  

}
