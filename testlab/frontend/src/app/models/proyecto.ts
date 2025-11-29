export interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string;
  usuario_id: number;
  created_at: string;   // ISO date string
  updated_at: string;   // ISO date string
}

export interface CreateProyectoDto {
  nombre: string;
  descripcion: string;
  usuario_id: number;
}

export interface UpdateProyectoDto {
  nombre?: string;
  descripcion?: string;
  usuario_id?: number;
}