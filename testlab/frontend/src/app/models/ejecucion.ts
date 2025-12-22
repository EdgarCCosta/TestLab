export interface Ejecucion {
  id: number;
  test_case_id: number;
  version_id: number;
  user_id: number;

  result: 'passed' | 'failed';
  comment: string;

  test_data: any;                 // backend envía un objeto dinámico
  error_status: string;
  correction_notes: string | null;
  observations: string | null;

  executed_at: string;            // ISO date string
  created_at: string;
  updated_at: string;

  // Relaciones incluidas en la respuesta
  test_case: {
    id: number;
    title: string;
    objective: string;
    preconditions: string;
    steps: string[];
    expected_result: string;
    user_profile: string;
    version_id: number;
    created_at: string;
    updated_at: string;
  };

  version: {
    id: number;
    version_number: string;
    release_date: string;
    description: string;
    project_id: number;
    created_at: string;
    updated_at: string;
  };

  user: {
    id: number;
    name: string;
    email: string;
    rol: string;
    created_at: string;
    updated_at: string;
  };
}

export interface CreateEjecucionDto {
  test_case_id: number;
  version_id: number;
  user_id: number;

  result: 'passed' | 'failed';
  comment: string;

  test_data?: any;
  error_status?: string;
  correction_notes?: string;
  observations?: string;

  executed_at: string;
}

export interface UpdateEjecucionDto {
  result?: 'passed' | 'failed';
  comment?: string;

  test_data?: any;
  error_status?: string;
  correction_notes?: string;
  observations?: string;

  executed_at?: string;
}