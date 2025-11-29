// Modelo público de usuario (lo que devuelve la API)
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'tester' | 'developer' | 'qa_lead';
  created_at: string;   // ISO date string
  updated_at: string;   // ISO date string
}

// DTO para crear usuario (sí incluye password, porque lo envías al backend)
export interface CreateUsuarioDto {
  nombre: string;
  email: string;
  password: string;     // requerido al crear
  rol: Usuario['rol'];
}

// DTO para actualizar usuario (puede incluir password si quieres permitir cambio)
export interface UpdateUsuarioDto {
  nombre?: string;
  email?: string;
  password?: string;    // opcional, solo si se actualiza
  rol?: Usuario['rol'];
}
