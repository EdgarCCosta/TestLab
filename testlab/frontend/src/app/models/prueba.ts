import { Version } from './version';

export interface Prueba {
  id: string;
  title: string;
  objective: string;
  preconditions: string;
  steps: string[];               // array real del backend
  expected_result: string;
  user_profile: 'tester';
  versions: Version[];
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
  version_ids: number[];
}

export interface UpdatePruebaDto {
  title?: string;
  objective?: string;
  preconditions?: string;
  steps?: string[];
  expected_result?: string;
  user_profile?: Prueba['user_profile'];
  version_ids: number[];
}
