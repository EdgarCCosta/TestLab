<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Services\DashboardService;

class DashboardController extends Controller
{

    protected $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        // Guardamos la instancia del servicio en la propiedad
        $this->dashboardService = $dashboardService;
    }

    public function mainDashboard()
    {
        try {

            $dashboardData = $this->dashboardService->getMainDashboard();

            $successRate = $this->dashboardService->getSuccessRate();
            $failureRate = $this->dashboardService->getFailureRate();


            $responseData = [
                'dashboard' => $dashboardData,
                'summary' => [
                    'success_rate' => $successRate,
                    'failure_rate' => $failureRate,
                    'total_executed' => $dashboardData['tests_executed'],
                ]
            ];

            return ApiResponse::success($responseData);
        } catch (\Exception $e) {

            return ApiResponse::error(
                'Failed to load dashboard data',
                500,
                $e->getMessage()
            );
        }
    }

    public function totalProjects()
    {
        try {
            // Solo obtenemos el total de proyectos
            $total = $this->dashboardService->getTotalProjects();

            return ApiResponse::success(['total_projects' => $total]);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to load projects count', 500, $e->getMessage());
        }
    }

    /**
     * Método para casos de prueba activos
     */
    public function activeTestCases()
    {
        try {
            $count = $this->dashboardService->getActiveTestCasesCount();
            return ApiResponse::success(['active_test_cases' => $count]);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to load active test cases', 500, $e->getMessage());
        }
    }

    /**
     * Método para tests ejecutados
     */
    public function testsExecuted()
    {
        try {
            $count = $this->dashboardService->getTestsExecutedCount();
            return ApiResponse::success(['tests_executed' => $count]);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to load tests executed', 500, $e->getMessage());
        }
    }

    /**
     * Método para tasas de éxito
     */
    public function successRates()
    {
        try {
            $data = [
                'success_rate' => $this->dashboardService->getSuccessRate(),
                'failure_rate' => $this->dashboardService->getFailureRate(),
                'total_passed' => $this->dashboardService->getTestsPassedCount(),
                'total_failed' => $this->dashboardService->getTestsFailedCount(),
                'total_executed' => $this->dashboardService->getTestsExecutedCount(),
            ];

            return ApiResponse::success($data);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to load success rates', 500, $e->getMessage());
        }
    }

    public function lastSixMonths()
    {
        try {
            $evolution = $this->dashboardService->getLastSixMonthsEvolution();

            return ApiResponse::success([
                'evolution' => $evolution
            ]);

        } catch (\Exception $e) {
            return ApiResponse::error('Failed to load last six months evolution', 500, $e->getMessage());
        }
    }
    public function getProjectStats()
    {
        // return response()->json("funciona"); 
        return ApiResponse::success($this->dashboardService->getProjectStats());
    }

    public function getUserStats()
    { 
        return ApiResponse::success($this->dashboardService->getUserStats());
    }
}
