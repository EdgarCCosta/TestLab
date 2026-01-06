<?php

namespace App\Services;

use App\Models\Project;
use App\Models\TestExecution;
use App\Models\Version;
use App\Models\User;

class StatisticsService
{
    // =========================
    // ESTADISTICAS GENERALES
    // =========================
    public function getGlobalStatistics(): array
    {
        return [
            'pass_rate' => $this->getPassRate(),
            'failure_rate' => $this->getFailureRate(),
            'tests_per_project' => $this->getTestsPerProject(),
        ];
    }

    /**
     * Media global de tests aprobados (%)
     */
    public function getPassRate(): float
    {
        $total = TestExecution::count();
        $passed = TestExecution::where('result', 'passed')->count();

        return $total > 0 ? round(($passed / $total) * 100, 2) : 0;
    }

    /**
     * Media global de tests fallidos (%)
     */
    public function getFailureRate(): float
    {
        $total = TestExecution::count();
        $failed = TestExecution::where('result', 'failed')->count();

        return $total > 0 ? round(($failed / $total) * 100, 2) : 0;
    }

    /**
     * Media de tests ejecutados por proyecto
     */
    public function getTestsPerProject(): float
    {
        $projects = Project::count();

        if ($projects === 0) {
            return 0;
        }

        $executions = TestExecution::count();

        return round($executions / $projects, 2);
    }

    // =========================
    // ESTADISTICAS POR PROYECTO
    // =========================
    public function getProjectStatistics(Project $project): array
    {
        $executions = TestExecution::whereHas('testCase.versions.project', function ($q) use ($project) {
            $q->where('id', $project->id);
        });

        $total = $executions->count();

        $passed = (clone $executions)->where('result', 'passed')->count();
        $failed = (clone $executions)->where('result', 'failed')->count();
        $pending = (clone $executions)->where('result', 'pending')->count();

        return [
            'total_tests' => $total,
            'passed' => $passed,
            'failed' => $failed,
            'pending' => $pending,
            'pass_rate' => $total > 0 ? round(($passed / $total) * 100, 2) : 0,
            'failure_rate' => $total > 0 ? round(($failed / $total) * 100, 2) : 0,
        ];
    }

    // =========================
    // POR VERSIÓN
    // =========================

    public function getVersionStatistics(Version $version): array
    {
        $executions = TestExecution::whereHas('testCase', function ($q) use ($version) {
            $q->where('version_id', $version->id);
        });

        $total = $executions->count();

        $passed  = (clone $executions)->where('result', 'passed')->count();
        $failed  = (clone $executions)->where('result', 'failed')->count();
        $pending = (clone $executions)->where('result', 'pending')->count();

        return [
            'version_id' => $version->id,
            'version_name' => $version->name,
            'total_tests' => $total,
            'passed' => $passed,
            'failed' => $failed,
            'pending' => $pending,
            'pass_rate' => $total > 0 ? round(($passed / $total) * 100, 2) : 0,
            'failure_rate' => $total > 0 ? round(($failed / $total) * 100, 2) : 0,
        ];
    }

    // =========================
    // POR USUARIO
    // =========================
    public function getUserStatistics(User $user): array
    {
        $executions = TestExecution::where('executed_by', $user->id);

        $total = $executions->count();

        $passed  = (clone $executions)->where('result', 'passed')->count();
        $failed  = (clone $executions)->where('result', 'failed')->count();
        $pending = (clone $executions)->where('result', 'pending')->count();

        return [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'total_tests' => $total,
            'passed' => $passed,
            'failed' => $failed,
            'pending' => $pending,
            'pass_rate' => $total > 0 ? round(($passed / $total) * 100, 2) : 0,
            'failure_rate' => $total > 0 ? round(($failed / $total) * 100, 2) : 0,
        ];
    }

        public function getVersionExecutionStats(Project $project): array
    {
        return $project->versions->map(function($version) {
            $executions = $version->testExecutions;
            $total = $executions->count();
            $passed = $executions->where('result', 'passed')->count();
            $failed = $executions->where('result', 'failed')->count();
            return [
                'version_id' => $version->id,
                'total' => $total,
                'passed' => $passed,
                'failed' => $failed,
                'success_rate' => $total > 0 ? round(($passed / $total) * 100, 2) : 0,
            ];
        })->toArray();
    }

public function getTestCaseStats(Project $project): array
{
    return $project->versions->map(function ($version) {
        $testCases = $version->testCases;
        $executions = $version->testExecutions;

        $totalTestCases = $testCases->count();
        $executed = $executions->count();
        $notExecuted = $totalTestCases - $executed;

        return [
            'version_id' => $version->id,
            'version_number' => $version->version_number, // ✔ CORRECTO
            'total_test_cases' => $totalTestCases,
            'executed' => $executed,
            'not_executed' => max($notExecuted, 0),
            'execution_rate' => $totalTestCases > 0
                ? round(($executed / $totalTestCases) * 100, 2)
                : 0,
        ];
    })->toArray();
}
}
