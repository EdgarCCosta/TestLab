export interface Version {
  id: number;
  numero_version: string;
  fecha_lanzamiento: string;   // ISO date string
  descripcion: string;
  proyecto_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateVersionDto {
  numero_version: string;
  fecha_lanzamiento: string;
  descripcion: string;
  proyecto_id: number;
}

export interface UpdateVersionDto {
  numero_version?: string;
  fecha_lanzamiento?: string;
  descripcion?: string;
  proyecto_id?: number;
}