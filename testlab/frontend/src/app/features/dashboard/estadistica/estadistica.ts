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

  constructor(private _estadisticaService: EstadisticaService) {}

  ngOnInit(): void {
    this.createGraphics();
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

    this.graficoEstados = new Chart("GraficoEstados", {
      type: 'doughnut',
      data: {labels: ['pasados', 'fallidos', 'pendientes'], datasets: [{label: "", data: [25, 25, 50], hoverOffset: 4}]},
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
