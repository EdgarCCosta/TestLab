export interface Prueba {
  id: number;
  title: string;
  objective: string;
  preconditions: string;
  steps: string[];               // 👈 array real del backend
  expected_result: string;
  user_profile: 'tester';
  version_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePruebaDto {
  title: string;
  objective: string;
  preconditions: string;
  steps: string[];
  expected_result: string;
  user_profile: Prueba['user_profile'];
  version_id: number;
}

export interface UpdatePruebaDto {
  title?: string;
  objective?: string;
  preconditions?: string;
  steps?: string[];
  expected_result?: string;
  user_profile?: Prueba['user_profile'];
  version_id?: number;
}