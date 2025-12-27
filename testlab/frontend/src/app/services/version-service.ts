import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Version, CreateVersionDto, UpdateVersionDto } from '../models/version';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VersionService {

  private readonly apiUrl = environment.apiUrl;
  private readonly endpoint = '/versions';

  constructor(private http: HttpClient) {}

  getVersiones(): Observable<Version[]> {
    return this.http
      .get<{ success: boolean; message: string; data: Version[] }>(
        this.apiUrl + this.endpoint
      )
      .pipe(map(response => response.data));
  }

  getVersionById(id: number): Observable<Version> {
    return this.http.get<Version>(`${this.apiUrl + this.endpoint}/${id}`);
  }

  createVersion(dto: CreateVersionDto): Observable<any> {
    return this.http.post(this.apiUrl + this.endpoint, dto);
  }

  updateVersion(id: number, dto: UpdateVersionDto): Observable<any> {
    return this.http.put(`${this.apiUrl + this.endpoint}/${id}`, dto);
  }

  deleteVersion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl + this.endpoint}/${id}`);
  }
}