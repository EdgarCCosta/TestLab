export interface Proyecto {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;   // ISO date string
  updated_at: string;   // ISO date string
}

export interface CreateProyectoDto {
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'archived';
}

export interface UpdateProyectoDto {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'archived';
}