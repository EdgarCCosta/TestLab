// models/ejecucion.ts
import { Prueba } from './prueba';
import { Version } from './version';
import { Usuario } from './usuario';

export interface Ejecucion {
  caso_prueba: Prueba;       // referencia directa al objeto Prueba
  version: Version;          // referencia directa al objeto Version
  usuario: Usuario;          // referencia directa al objeto Usuario
  resultado: 'passed' | 'failed';
  mensaje: string;
}
