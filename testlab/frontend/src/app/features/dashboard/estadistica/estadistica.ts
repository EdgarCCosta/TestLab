import { AfterViewInit, Component, OnInit } from '@angular/core';
import { EstadisticaService } from '../../../services/estadistica-service';
import { EvolutionResponse, SuccessRatesResponse } from '../../../models/dashboardData';
import { forkJoin } from 'rxjs';
import { LoadingComponent } from '../../../layout/shared/loading/loading';

import { SpinnerService } from '../../../services/spinner-service';
import { Chart } from 'chart.js/auto';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-estadistica',
  imports: [LoadingComponent, CommonModule],
  templateUrl: './estadistica.html',
  styleUrl: './estadistica.css',
})
export class Estadistica implements OnInit {

  public graficoEvolucion: any;
  public graficoEstados: any;
  public graficoComparativaProyectos: any;
  public graficoComparativaUsuarios: any;

  public dashboard: any = null;
  public summary: any = null;
  public loading = true;
  public evolution: EvolutionResponse['data']['evolution'] = [];
  public successRates: SuccessRatesResponse['data'] | null = null;
  public pending_total = 0;
  public pending_rate = 0;


  public top3Projects: any[] = [];
  public projectStats: any[] = [];


  public userStats: any[] = [];
  public top4Users: any[] = [];

  



  constructor(private _estadisticaService: EstadisticaService, public _spinnerService: SpinnerService) {}

  ngOnInit(): void {
    this.loading = true;
  forkJoin({
      main: this._estadisticaService.getMainDashboard(),
      evolution: this._estadisticaService.getLastSixMonths(),
      rates: this._estadisticaService.getSuccessRates(),
      projects: this._estadisticaService.getProjectStats(),
      users: this._estadisticaService.getUserStats()

    }).subscribe(({ main, evolution, rates, projects, users }) => {
      this.projectStats = projects.data;
      
      console.log(projects);
      console.log(users);

      // Top 3 proyectos con mayor ratio de éxitos y fallos
      this.top3Projects = [...this.projectStats]
        .filter(p => p.total > 0) // opcional: evitar proyectos sin ejecuciones
        .sort((a, b) => b.success_rate - a.success_rate)
        .slice(0, 3);

      console.log(this.top3Projects);

      this.top3Projects.forEach(project => {
        console.log(project.name);
      });

      // Usuarios totales
      this.userStats = users.data;

      // Usuarios ordenados por número de tests ejecutados
      this.top4Users = [...this.userStats]
        .sort((a, b) => b.executed - a.executed)
        .slice(0, 4);

      console.log(this.top4Users);

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
        }
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

    if (!this.top3Projects?.length) return;

      // Labels dinámicas
      const labels = this.top3Projects.map(p => p.name);

      // Datos dinámicos
      const dataPasados = {
        label: 'Pasados',
        data: this.top3Projects.map(p => p.passed),
        backgroundColor: '#4CAF50'
      };

      const dataFallidos = {
        label: 'Fallidos',
        data: this.top3Projects.map(p => p.failed),
        backgroundColor: '#F44336'
      };

      // Destruir gráfico previo si existe
      if (this.graficoComparativaProyectos) {
        this.graficoComparativaProyectos.destroy();
      }



    this.graficoComparativaProyectos = new Chart("GraficoComparativaProyectos", {
      type: 'bar',
      data: {
        labels: labels,
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
    
  if (!this.top4Users?.length) return;

    const labels = this.top4Users.map(u => u.name);

    const dataEjecutados = {
      label: 'Ejecutados',
      data: this.top4Users.map(u => u.executed),
      backgroundColor: '#2196F3'
    };

    const dataPasados = {
      label: 'Pasados',
      data: this.top4Users.map(u => u.passed),
      backgroundColor: '#4CAF50'
    };

    if (this.graficoComparativaUsuarios) {
      this.graficoComparativaUsuarios.destroy();
    }


    this.graficoComparativaUsuarios = new Chart("GraficoComparativaUsuarios", {
      type: 'bar',
      data: {
        labels: labels,
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
