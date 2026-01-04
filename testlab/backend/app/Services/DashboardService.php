<?php

namespace App\Services;

use App\Models\Project;
use App\Models\TestCase;
use App\Models\TestExecution;
use App\Models\User;
use App\Models\Version;

class DashboardService
{
    public function getMainDashboard(): array
    {
        return [
            'total_projects' => $this->getTotalProjects(),
            'active_test_cases' => $this->getActiveTestCasesCount(),
            'tests_executed' => $this->getTestsExecutedCount(),
            'tests_passed' => $this->getTestsPassedCount(),
            'tests_failed' => $this->getTestsFailedCount(),
            'tests_pending' => $this->getTestsPendingCount(),
        ];
    }

    public function getTotalProjects(): int
    {
        return Project::count();
    }

    public function getActiveTestCasesCount(): int
    {
        return TestCase::whereHas('version.project', function ($query) {
            $query->where('status', 'active');
        })->count();
    }

    public function getTestsExecutedCount(): int
    {
        return TestExecution::whereNotNull('executed_at')->count();
    }

    public function getTestsPassedCount(): int
    {
        return TestExecution::where('result', 'passed')->count();
    }

    public function getTestsFailedCount(): int
    {
        return TestExecution::where('result', 'failed')->count();
    }

    public function getTestsPendingCount(): int
    {
        return TestExecution::where('result', 'pending')->count();
    }

    public function getSuccessRate(): float
    {
        $total = $this->getTestsExecutedCount();
        $passed = $this->getTestsPassedCount();

        return $total > 0 ? round(($passed / $total) * 100, 2) : 0;
    }

    public function getFailureRate(): float
    {
        $total = $this->getTestsExecutedCount();
        $failed = $this->getTestsFailedCount();

        return $total > 0 ? round(($failed / $total) * 100, 2) : 0;
    }


    public function getLastSixMonthsEvolution(): array
    {
        $data = [];

        // Mes actual
        $currentMonth = date('n'); // 1–12
        $currentYear  = date('Y');

        for ($i = 5; $i >= 0; $i--) {

            // Restamos $i meses desde hoy. En nuestro caso desde hace 5 meses hasta hace 0 meses (enero). 6 en total.
            $timestamp = strtotime("-$i month");

            $month = date('n', $timestamp);
            $year  = date('Y', $timestamp);

            $data[] = [
                'month'    => $month,
                'year'     => $year,
                'executed' => TestExecution::whereMonth('executed_at', $month)
                                        ->whereYear('executed_at', $year)
                                        ->count(),

                'passed'   => TestExecution::where('result', 'passed')
                                        ->whereMonth('executed_at', $month)
                                        ->whereYear('executed_at', $year)
                                        ->count(),

                'failed'   => TestExecution::where('result', 'failed')
                                        ->whereMonth('executed_at', $month)
                                        ->whereYear('executed_at', $year)
                                        ->count(),
            ];
        }

        return $data;
    }

    public function getProjectStats(): array
    {
        $projects = Project::all();
        $result = [];

        foreach ($projects as $project) {

            // 1. Obtener IDs de versiones del proyecto
            $versionIds = Version::where('project_id', $project->id)
                                ->pluck('id');

            // Si no hay versiones, devolver ceros
            if ($versionIds->isEmpty()) {
                $result[] = [
                    'project_id' => $project->id,
                    'name' => $project->name,
                    'total' => 0,
                    'passed' => 0,
                    'failed' => 0,
                    'blocked' => 0,
                    'success_rate' => 0,
                ];
                continue;
            }

            // 2. Obtener ejecuciones asociadas a esas versiones
            $executions = TestExecution::whereIn('version_id', $versionIds)->get();

            // 3. Ahora necesitamos saber cómo se llama la columna del estado
            //    Vamos a intentar detectar automáticamente el campo correcto:

            $statusField = null;

            if ($executions->first()) {
                $keys = array_keys($executions->first()->toArray());

                // Buscar columna que contenga passed/failed/blocked
                foreach ($keys as $key) {
                    if (in_array($key, ['result', 'status', 'execution_status', 'state'])) {
                        $statusField = $key;
                        break;
                    }
                }
            }

            // Si no encontramos columna, evitar crash
            if (!$statusField) {
                $statusField = 'result'; // fallback
            }

            // 4. Contar estados
            $total = $executions->count();
            $passed = $executions->where($statusField, 'passed')->count();
            $failed = $executions->where($statusField, 'failed')->count();
            $blocked = $executions->where($statusField, 'blocked')->count();

            $result[] = [
                'project_id' => $project->id,
                'name' => $project->name,
                'total' => $total,
                'passed' => $passed,
                'failed' => $failed,
                'blocked' => $blocked,
                'success_rate' => $total > 0 ? round(($passed / $total) * 100, 2) : 0,
            ];
        }

        return $result;
    }

    public function getUserStats(): array
    {
        $users = User::all();

        $result = [];

        foreach ($users as $user) {

            $executions = TestExecution::where('user_id', $user->id)->get();

            $total = $executions->count();
            $passed = $executions->where('result', 'passed')->count();
            $failed = $executions->where('result', 'failed')->count();

            $result[] = [
                'user_id' => $user->id,
                'name' => $user->name,
                'executed' => $total,
                'passed' => $passed,
                'failed' => $failed,
                'success_rate' => $total > 0 ? round(($passed / $total) * 100, 2) : 0,
            ];
        }

        return $result;
    }

}
