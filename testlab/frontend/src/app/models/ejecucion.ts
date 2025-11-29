export interface Ejecucion {
  id: number;
  caso_prueba_id: number;
  version_id: number;
  usuario_id: number;
  resultado: 'OK' | 'FAILED';
  mensaje: string;
  estado_error?: string;
  datos_utilizados?: string;
  correcion?: string;
  observaciones?: string;
  fecha_ejecucion: string; // ISO date string
  created_at: string;
  updated_at: string;
}

export interface CreateEjecucionDto {
  caso_prueba_id: number;
  version_id: number;
  usuario_id: number;
  resultado: 'OK' | 'FAILED';
  mensaje: string;
  estado_error?: string;
  datos_utilizados?: string;
  correcion?: string;
  observaciones?: string;
  fecha_ejecucion: string;
}

export interface UpdateEjecucionDto {
  resultado?: 'OK' | 'FAILED';
  mensaje?: string;
  estado_error?: string;
  datos_utilizados?: string;
  correcion?: string;
  observaciones?: string;
  fecha_ejecucion?: string;
}