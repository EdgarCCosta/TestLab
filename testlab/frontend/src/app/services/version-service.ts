import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Version, CreateVersionDto, UpdateVersionDto } from '../models/version';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/apiResponse';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/versions';

  constructor(private http: HttpClient) {}

  getVersiones(options?: { silent?: boolean }): Observable<Version[]> {
    let headers = new HttpHeaders();

    if (options?.silent) {
      headers = headers.set('X-Silent', 'true');
    }

    return this.http
      .get<{ success: boolean; message: string; data: Version[] }>(this.apiUrl + this.endpoint, {
        headers,
      })
      .pipe(map((response) => response.data));
  }

  getVersionesByProject(id: string, options?: { silent?: boolean }) {
    let headers = new HttpHeaders();

    if (options?.silent) {
      headers = headers.set('X-Silent', 'true');
    }

    return this.http
      .get<ApiResponse<Version[]>>(this.apiUrl + `/projects/${id}/versions`, { headers })
      .pipe(map((res) => res.data));
  }

  

  getVersionById(id: string, options?: { silent?: boolean }) {
    let headers = new HttpHeaders();

    if (options?.silent) {
      headers = headers.set('X-Silent', 'true');
    }

    return this.http
      .get<ApiResponse<Version>>(`${this.apiUrl + this.endpoint}/${id}`, { headers })
      .pipe(map((res) => res.data));
  }

  createVersion(dto: CreateVersionDto): Observable<any> {
    return this.http.post(this.apiUrl + this.endpoint, dto);
  }

  updateVersion(id: string, dto: UpdateVersionDto): Observable<any> {
    return this.http.put(`${this.apiUrl + this.endpoint}/${id}`, dto);
  }

  deleteVersion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl + this.endpoint}/${id}`);
  }

  getByProject(projectId: string, options?: { silent?: boolean }) {
    let headers = new HttpHeaders();

    if (options?.silent) {
      headers = headers.set('X-Silent', 'true');
    }

    return this.http.get<ApiResponse<Version[]>>(`${this.apiUrl}/projects/${projectId}/versions`, {
      headers,
    });
  }
  linkPruebaToVersion(idVersion: string, idPrueba: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/versions/${idVersion}/test-cases/${idPrueba}`, {});
  }
  unlinkPruebaFromVersion(idVersion: string, idPrueba: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/versions/${idVersion}/test-cases/${idPrueba}`);
  }
}
