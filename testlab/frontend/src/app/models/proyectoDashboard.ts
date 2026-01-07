export interface ProyectoDashboard {
  project: any;
  users: any[];
  admins: any[];
  metrics: {
    total_versions: number;
    total_test_cases: number;
    total_executions: number;
    passed_executions: number;
    failed_executions: number;
    success_rate: number;
  };
  latest_executions: any[];
  versions_summary: any[];
}