export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  usuario_id: string;
  created_at: string;   // ISO date string
  updated_at: string;   // ISO date string
}

export interface CreateProyectoDto {
  nombre: string;
  descripcion: string;
  usuario_id: string;
}

export interface UpdateProyectoDto {
  nombre?: string;
  descripcion?: string;
  usuario_id?: string;
}