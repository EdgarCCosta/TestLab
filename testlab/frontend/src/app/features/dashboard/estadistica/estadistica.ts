import { AfterViewInit, Component, OnInit } from '@angular/core';
import { EstadisticaService } from '../../../services/estadistica-service';

import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-estadistica',
  imports: [],
  templateUrl: './estadistica.html',
  styleUrl: './estadistica.css',
})
export class Estadistica implements AfterViewInit {

  public graficoEvolucion: any;
  public graficoEstados: any;
  public graficoComparativaProyectos: any;

  public dashboard: any = null;
  public summary: any = null;
  public loading = true;

  constructor(private _estadisticaService: EstadisticaService) {}

  ngAfterViewInit(): void {
    this._estadisticaService.getMainDashboard().subscribe(resp => {
      this.dashboard = resp.data.dashboard;
      this.summary = resp.data.summary;
      console.log(this.summary);
      this.createGraphics();
    });

    this._estadisticaService.getLastSixMonths().subscribe(resp => {
      console.log(resp);
    });
  }

  createGraphics() {
    this.createGraficoEvolucion();
    this.createGraficoEstados();
    this.createGraficoComparativaProyectos();
    this.createGraficoComparativaUsuarios();
  }

  createGraficoEvolucion(): void {
    this.graficoEvolucion = new Chart("GraficoEvolucion", {
      data: {
        datasets: [{
          type: 'line',
          label: 'Pasados',
          data: [39, 55, 44, 77, 80, 75]
        },
        {
          type: 'line',
          label: 'Fallidos',
          data: [61, 45, 66, 23, 20, 25]
        }],
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
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
