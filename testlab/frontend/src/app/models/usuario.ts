// Modelo público de usuario (lo que devuelve la API)
export interface Usuario {
  id: string;
  name: string;
  email: string;
  rol: 'admin' | 'manager' | 'tester';
  created_at: string;   // ISO date string
  updated_at: string;   // ISO date string
}

// DTO para crear usuario (sí incluye password, porque lo envías al backend)
export interface CreateUsuarioDto {
  name: string;
  email: string;
  password: string;     // requerido al crear
  rol: Usuario['rol'];
}

// DTO para actualizar usuario (puede incluir password si quieres permitir cambio)
export interface UpdateUsuarioDto {
  name?: string;
  email?: string;
  password?: string;    // opcional, solo si se actualiza
  rol?: Usuario['rol'];
}
