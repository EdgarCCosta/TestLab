export interface Version {
  id: number;
  version_number: string;
  release_date: string;   // ISO date string
  description: string;
  project_id: number;
  created_at: string;
  updated_at: string;

  project_name?: string;
}

export interface CreateVersionDto {
  version_number: string;
  release_date: string;
  description: string;
  project_id: number;
}

export interface UpdateVersionDto {
  version_number?: string;
  release_date?: string;
  description?: string;
  project_id?: number;
}