<?php

namespace App\Services;

use App\Models\Project;
use App\Models\TestCase;
use App\Models\TestExecution;

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
}
