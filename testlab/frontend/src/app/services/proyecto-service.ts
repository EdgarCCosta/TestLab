import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Proyecto, CreateProyectoDto, UpdateProyectoDto } from '../models/proyecto';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario';
import { UsuarioService } from './usuario-service';
import { PruebaService } from './prueba-service';
import { Prueba } from '../models/prueba';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {

  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/projects';

  proyectos = signal<Proyecto[]>([]);

  // Servicios de usuarios y pruebas inyectados temporalmente para devolver valores hasta que haya estructura y método en backend
  constructor(private http: HttpClient, private _usuarioService: UsuarioService, private _pruebaService: PruebaService) {}

  /** Obtener todos los proyectos */
  getProyectos(): Observable<Proyecto[]> {
    return this.http
      .get<{ success: boolean; message: string; data: Proyecto[] }>(
        this.apiUrl + this.endpoint
      )
      .pipe(map(
        response => {
          this.proyectos.set(response.data);
          return response.data;
        }
      ));
  }

  /** Obtener un proyecto por ID */
  getProyectoById(id: string): Observable<Proyecto> {
    return this.http
      .get<{ success: boolean; message: string; data: Proyecto }>(
        `${this.apiUrl + this.endpoint}/${id}`
      )
      .pipe(map(response => response.data));
  }

  /** Crear proyecto */
  createProyecto(dto: CreateProyectoDto): Observable<any> {
    return this.http.post<{ data: Proyecto }>(this.apiUrl + this.endpoint, dto)
      .pipe(
        map(res => {
          this.proyectos.update(list => [...list, res.data]);  // 👈 Añadir al signal
          console.log('Proyecto creado:', res.data);
          console.log('Proyectos:', this.proyectos());
          return res;
        })
      );
  }

  /** Actualizar proyecto */
  updateProyecto(id: string, dto: UpdateProyectoDto): Observable<any> {
    return this.http.put<{ data: Proyecto }>(`${this.apiUrl + this.endpoint}/${id}`, dto)
      .pipe(
        map(res => {
          this.proyectos.update(list =>
            list.map(p => p.id === id ? res.data : p)   // Reemplaza en el signal
          );
          return res;
        })
      );
  }

  /** Eliminar proyecto */
  deleteProyecto(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl + this.endpoint}/${id}`)
      .pipe(
        map(res => {
          this.proyectos.update(list =>
            list.filter(p => p.id !== id)   // Elimina del signal
          );
          return res;
        })
      );
  }

  // TODO: Falta estructura en backend
  /** Obtener usuarios asociados a un proyecto por ID */
  getUsersFromProyectoById(id: string): Observable<Usuario[]> {

    // *** Mientras no haya estructura necesaria en backend, devolvemos todos los usuarios ***
    return this._usuarioService.getUsuarios();


    // ESTE SERÍA EL RETURN REAL:

    // return this.http
    //   .get<{ success: boolean; message: string; data: Usuario[] }>(
    //     `${this.apiUrl + this.endpoint}/${id}/users`
    //   )
    //   .pipe(map(response => response.data));
  }

    // TODO: Falta estructura en backend
  /** Obtener usuarios asociados a un proyecto por ID */
  getPruebasFromProyectoById(id: string): Observable<Prueba[]> {

    // *** Mientras no haya estructura necesaria en backend, devolvemos todos los usuarios ***
    return this._pruebaService.getPruebas();


    // ESTE SERÍA EL RETURN REAL:

    // return this.http
    //   .get<{ success: boolean; message: string; data: Prueba[] }>(
    //     `${this.apiUrl + this.endpoint}/${id}/pruebas`
    //   )
    //   .pipe(map(response => response.data));
  }

  unlinkUsuarioFromProyecto(idProyecto: string, idUsuario: string): Observable<any> {
    // *** Mientras no haya estructura necesaria en backend, devolvemos el usuario a disociar ***
    return this._usuarioService.getUsuarioById(idUsuario);

    // ESTE SERÍA EL RETURN REAL:
    // return this.http.delete(`${this.apiUrl + this.endpoint}/${idProyecto}/user/${idUsuario}`);
  }

  unlinkPruebaFromProyecto(idProyecto: string, idPrueba: string): Observable<any> {
    // *** Mientras no haya estructura necesaria en backend, devolvemos la prueba a disociar ***
    return this._usuarioService.getUsuarioById(idPrueba);

    // ESTE SERÍA EL RETURN REAL:
    // return this.http.delete(`${this.apiUrl + this.endpoint}/${idProyecto}/testcase/${idUsuario}`);
  }
}