import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prueba, CreatePruebaDto, UpdatePruebaDto } from '../models/prueba';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PruebaService {
  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/test-cases';

  constructor(private http: HttpClient) {}

  getPruebas(): Observable<Prueba[]> {
    return this.http
      .get<{ success: boolean; message: string; data: Prueba[] }>(this.apiUrl + this.endpoint)
      .pipe(map(response => response.data));
  }

  getPruebaById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl + this.endpoint}/${id}`);
  }

  createPrueba(dto: CreatePruebaDto): Observable<any> {
    return this.http.post(this.apiUrl + this.endpoint, dto);
  }

  updatePrueba(id: string, dto: UpdatePruebaDto): Observable<any> {
    return this.http.put(`${this.apiUrl + this.endpoint}/${id}`, dto);
  }

  deletePrueba(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl + this.endpoint}/${id}`);
  }
}