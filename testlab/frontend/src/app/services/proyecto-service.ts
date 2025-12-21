import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proyecto, CreateProyectoDto, UpdateProyectoDto } from '../models/proyecto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {

  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/proyecto'; // 👈 coincide con proxy.conf.json

  constructor(private http: HttpClient) {}

  getProyectos(): Observable<any> {
    return this.http.get(this.apiUrl + this.endpoint);
  }

  getProyectoById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl + this.endpoint}/${id}`);
  }

  createProyecto(dto: CreateProyectoDto): Observable<any> {
    return this.http.post(this.apiUrl + this.endpoint, dto);
  }

  updateProyecto(id: string, dto: UpdateProyectoDto): Observable<any> {
    return this.http.put(`${this.apiUrl + this.endpoint}/${id}`, dto);
  }

  deleteProyecto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl + this.endpoint}/${id}`);
  }
}