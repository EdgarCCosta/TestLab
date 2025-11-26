import { Proyecto } from './proyecto';

export interface Prueba {
  titulo: string;
  objetivo: string;
  condiciones: string;
  resultado_esperado: string;
  proyecto: Proyecto; // relación directa con el proyecto
}

