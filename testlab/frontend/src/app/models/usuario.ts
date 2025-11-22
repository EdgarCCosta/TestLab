export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'tester' | 'developer' | 'qa_lead';
}

// DTO para crear usuario
export interface CreateUsuarioDto {
  nombre: string;
  email: string;
  rol: Usuario['rol'];
}

// DTO para actualizar usuario
export interface UpdateUsuarioDto {
  nombre?: string;
  email?: string;
  rol?: Usuario['rol'];
}
