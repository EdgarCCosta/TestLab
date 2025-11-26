// models/proyecto.ts
import { Usuario } from './usuario';

export interface Proyecto {
  nombre: string;
  descripcion: string;
  usuario: Usuario;   // relación directa con el usuario responsable
}