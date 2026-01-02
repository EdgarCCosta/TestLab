import { Component, OnInit } from '@angular/core';
import { EstadisticaService } from '../../../services/estadistica-service';

import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-estadistica',
  imports: [],
  templateUrl: './estadistica.html',
  styleUrl: './estadistica.css',
})
export class Estadistica implements OnInit {

  public graficoEvolucion: any;
  public graficoEstados: any;
  public dashboard: any = null;
  public summary: any = null;
  public loading = true;

  constructor(private _estadisticaService: EstadisticaService) {}

  ngOnInit(): void {
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
  }

  createGraficoEvolucion() {
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
            stacked: true
          },
          y: {
            stacked: true
          }
        }
      }
    });
  }

  createGraficoEstados() {

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
  

}
