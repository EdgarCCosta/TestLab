import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Version, CreateVersionDto, UpdateVersionDto } from '../models/version';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  private readonly baseUrl = '/api/version'; // 👈 coincide con proxy.conf.json

  constructor(private http: HttpClient) {}

  getVersiones(): Observable<Version[]> {
    return this.http.get<Version[]>(this.baseUrl);
  }

  getVersionById(id: number): Observable<Version> {
    return this.http.get<Version>(`${this.baseUrl}/${id}`);
  }

  createVersion(dto: CreateVersionDto): Observable<Version> {
    return this.http.post<Version>(this.baseUrl, dto);
  }

  updateVersion(id: number, dto: UpdateVersionDto): Observable<Version> {
    return this.http.put<Version>(`${this.baseUrl}/${id}`, dto);
  }

  deleteVersion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}