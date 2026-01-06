<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\Project;
use App\Models\ProjectVersion;
use App\Models\User;
use App\Services\StatisticsService;

class StatisticsController extends Controller
{
    protected StatisticsService $statisticsService;

    public function __construct(StatisticsService $statisticsService)
    {
        $this->statisticsService = $statisticsService;
    }

    // =========================
    // GLOBAL
    // =========================
    public function global()
    {
        try {
            $data = $this->statisticsService->getGlobalStatistics();
            return ApiResponse::success($data);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to load global statistics', 500, $e->getMessage());
        }
    }

    // =========================
    // ESTADÍSTICAS POR PROYECTO
    // =========================
    public function byProject(Project $project)
    {
        try {
            $data = $this->statisticsService->getProjectStatistics($project);
            return ApiResponse::success($data);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to load project statistics', 500, $e->getMessage());
        }
    }

    // ====== Total de versiones y última versión ======
    public function projectVersionInfo(Project $project)
    {
        try {
            $data = $this->statisticsService->getProjectVersionInfo($project);
            return ApiResponse::success($data);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to load project version info', 500, $e->getMessage());
        }
    }

    // =========================
    // ESTADÍSTICAS POR VERSIÓN
    // =========================
    public function byVersion(ProjectVersion $version)
    {
        try {
            $data = $this->statisticsService->getVersionStatistics($version);
            return ApiResponse::success($data);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to load version statistics', 500, $e->getMessage());
        }
    }

    // ====== Ejecuciones por versión de un proyecto ======
    public function versionExecutionStats(Project $project)
    {
        try {
            $data = $this->statisticsService->getVersionExecutionStats($project);
            return ApiResponse::success($data);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to load version execution stats', 500, $e->getMessage());
        }
    }




    // =========================
    // POR USUARIO
    // =========================
    public function byUser(User $user)
    {
        try {
            $data = $this->statisticsService->getUserStatistics($user);
            return ApiResponse::success($data);
        } catch (\Exception $e) {
            return ApiResponse::error(
                'Failed to load user statistics',
                500,
                $e->getMessage()
            );
        }
    }

    // =========================
    // POR PRUEBA
    // =========================
    public function byTestCase(Project $project)
    { 
        try {
            $data = $this->statisticsService->getTestCaseStats($project);
            return ApiResponse::success($data);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to load test case statistics', 500, $e->getMessage());
        }
    }
}
