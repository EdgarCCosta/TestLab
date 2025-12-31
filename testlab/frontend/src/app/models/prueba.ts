export interface Prueba {
  id: number;
  titulo: string;
  objetivo: string;
  condiciones: string;
  pasos: string;
  resultado_esperado: string;
  rol: 'tester' | 'qa_lead';
  proyecto_id: number;
  created_at: string;   // ISO date string
  updated_at: string;   // ISO date string
}

export interface CreatePruebaDto {
  titulo: string;
  objetivo: string;
  condiciones: string;
  pasos: string;
  resultado_esperado: string;
  rol: Prueba['rol'];
  proyecto_id: number;
}

export interface UpdatePruebaDto {
  titulo?: string;
  objetivo?: string;
  condiciones?: string;
  pasos?: string;
  resultado_esperado?: string;
  rol?: Prueba['rol'];
  proyecto_id?: number;
}