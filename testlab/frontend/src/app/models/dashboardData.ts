// export interface DashboardData {
//   dashboard: any;
//   summary: any;
// }

export interface SuccessRatesResponse {
  success: boolean;
  message: string;
  data: {
    success_rate: number;
    failure_rate: number;
    total_passed: number;
    total_failed: number;
    total_executed: number;
  };
}

export interface EvolutionResponse {
  success: boolean;
  message: string;
  data: {
    evolution: {
      month: string;
      year: string;
      executed: number;
      passed: number;
      failed: number;
    }[];
  };
}