// models/version.ts
import { Proyecto } from './proyecto';

export interface Version {
  numero_version: string;
  fecha_lanzamiento: string;   // puedes tiparlo como Date si prefieres
  descripcion: string;
  proyecto: Proyecto;          // relación directa con el proyecto
}