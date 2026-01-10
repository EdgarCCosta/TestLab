import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EvolutionResponse, SuccessRatesResponse } from '../models/dashboardData';

@Injectable({
  providedIn: 'root',
})
export class EstadisticaService {

  private readonly apiUrl = environment.apiUrl;
  private readonly dash = '/dashboard';

  constructor(private http: HttpClient) {}

  /** ============================
   *  📊 ESTADÍSTICAS GENERALES
   *  ============================ */

  /** Dashboard principal (métricas globales) */
  getMainDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl + this.dash}/main`);
  }

  /** Total de proyectos */
  getTotalProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl + this.dash}/projects-total`);
  }

  /** Test cases activos */
  getActiveTestCases(): Observable<any> {
    return this.http.get(`${this.apiUrl + this.dash}/active-test-cases`);
  }

  /** Tests ejecutados */
  getTestsExecuted(): Observable<any> {
    return this.http.get(`${this.apiUrl + this.dash}/tests-executed`);
  }

  /** Tasas de éxito y fallo */
  getSuccessRates(): Observable<SuccessRatesResponse> {
    return this.http.get<SuccessRatesResponse>(`${this.apiUrl + this.dash}/success-rates`);
  }

  getLastSixMonths(): Observable<EvolutionResponse> {
    return this.http.get<EvolutionResponse>(`${this.apiUrl + this.dash}/last-months`);
  }
  
  getTestCasesMonthComparison(): Observable<any> {
    return this.http.get(`${this.apiUrl + this.dash}/test-cases/month-comparison`);
  }

  /** ============================
   *  📦 ESTADÍSTICAS POR PROYECTO
   *  ============================ */

  /** Dashboard por proyecto (si activas la ruta en ProjectController) */
  getProjectDashboard(projectId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/${projectId}/dashboard`);
  }

  /** ============================
   *  👤 ESTADÍSTICAS POR USUARIO
   *  ============================ */

  // Aquí podrás añadir endpoints cuando los crees en backend
  getProjectStats() : Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/projects`);
  }

  getUserStats() : Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/users`);
  }
}
