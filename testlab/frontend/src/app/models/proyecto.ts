export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  usuario_id: string;
  created_at: string;   // ISO date string
  updated_at: string;   // ISO date string
  fecha_entrega: string;
}

export interface CreateProyectoDto {
  nombre: string;
  descripcion: string;
  usuario_id: string;
  fecha_entrega: string;
}

export interface UpdateProyectoDto {
  nombre?: string;
  descripcion?: string;
  usuario_id?: string;
  fecha_entrega?: string;
}
