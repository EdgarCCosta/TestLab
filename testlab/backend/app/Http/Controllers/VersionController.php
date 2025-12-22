<?php

namespace App\Http\Controllers;

use App\Models\Version;
use App\Models\TestExecution;
use Illuminate\Http\Request;
use App\Http\Responses\ApiResponse;

class VersionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $versions = Version::all();
            return ApiResponse::success($versions);
        } catch (\Exception $e) {
            return ApiResponse::notFound('Versions not found');
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'version_number' => 'required|string|max:20',
            'release_date'   => 'required|date',
            'description'    => 'nullable|string',
            'project_id'     => 'required|exists:projects,id',
        ]);

        // Validación manual opcional usando tu método del modelo
        if (!Version::isValidVersionNumber($validated['version_number'])) {
            return ApiResponse::error(
                'Invalid version format. Must be: v1.0.0',
                422
            );
        }

        try {
            $version = Version::create($validated);

            return ApiResponse::created($version, 'Version created successfully');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to create version', 500, $e->getMessage());
        }
    }

    /**
     * Display a specific version.
     */
    public function show(string $id)
    {
        try {
            $version = Version::findOrFail($id);

            return ApiResponse::success($version);
        } catch (\Exception $e) {
            return ApiResponse::error('Version not found', 500, $e->getMessage());
        }
    }

    /**
     * Update a specific version.
     */
    public function update(Request $request, string $id)
    {
        try {
            $version = Version::findOrFail($id);

            $validated = $request->validate([
                'version_number' => 'sometimes|string|max:20',
                'release_date'   => 'sometimes|date',
                'description'    => 'sometimes|string|nullable',
                'project_id'     => 'sometimes|exists:projects,id',
            ]);

            // Validación opcional si se envía version_number
            if (
                !empty($validated['version_number']) &&
                !Version::isValidVersionNumber($validated['version_number'])
            ) {

                return ApiResponse::error(
                    'Invalid version format. Must be: v1.0.0',
                    422
                );
            }

            $version->update($validated);

            return ApiResponse::updated($version, 'Version updated successfully');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to update version', 500, $e->getMessage());
        }
    }

    /**
     * Remove the specified version from storage.
     */
    public function destroy(string $id)
    {
        try {
            $version = Version::findOrFail($id);

            $version->delete();

            return ApiResponse::deleted('Version deleted successfully');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to delete version', 500, $e->getMessage());
        }
    }

    /**
     * Reporte detallado de una versión
     */
    public function report($versionId)
    {
        try {
            $version = Version::with(['project', 'testCases.executions'])->findOrFail($versionId);

            $testCases = $version->testCases;

            $reportData = $testCases->map(function ($testCase) {
                $executions = $testCase->executions;

                return [
                    'test_case_id' => $testCase->id,
                    'test_case_title' => $testCase->title,
                    'total_executions' => $executions->count(),
                    'last_execution' => $executions->sortByDesc('executed_at')->first(),
                    'passed_count' => $executions->where('result', 'passed')->count(),
                    'failed_count' => $executions->where('result', 'failed')->count(),
                    'blocked_count' => $executions->where('result', 'blocked')->count(),
                    'pending_count' => $executions->where('result', 'pending')->count()
                ];
            });

            // Estadísticas generales
            $allExecutions = TestExecution::where('version_id', $versionId)->get();

            return ApiResponse::success([
                'version' => $version,
                'project' => $version->project,
                'summary' => [
                    'total_test_cases' => $testCases->count(),
                    'total_executions' => $allExecutions->count(),
                    'passed' => $allExecutions->where('result', 'passed')->count(),
                    'failed' => $allExecutions->where('result', 'failed')->count(),
                    'blocked' => $allExecutions->where('result', 'blocked')->count(),
                    'pending' => $allExecutions->where('result', 'pending')->count(),
                    'success_rate' => $allExecutions->count() > 0 ?
                        round(($allExecutions->where('result', 'passed')->count() / $allExecutions->count()) * 100, 2) : 0
                ],
                'test_cases_report' => $reportData,
                'error_distribution' => $allExecutions->where('result', 'failed')
                    ->groupBy('error_status')
                    ->map->count()
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ApiResponse::notFound('Version not found');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to generate report', 500, $e->getMessage());
        }
    }
}