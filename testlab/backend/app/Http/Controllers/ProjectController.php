<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\TestExecution;


class ProjectController extends Controller
{
    //Listar todos los proyectos
    public function index()
    {
        try {
            $projects = Project::all();
            return ApiResponse::success($projects);
        } catch (\Exception $e) {
            return ApiResponse::notFound('Projects not found');
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255|unique:projects,name',
            'description' => 'nullable|string',
            'status'      => 'sometimes|in:active,inactive,archived',
            'user_ids'    => 'sometimes|array',
            'user_ids.*'  => 'exists:users,id'
        ]);

        try {
             $project = Project::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'status' => $validated['status'] ?? 'active',
                'created_by' => $request->user()->id
            ]);
            if (!empty($validated['user_ids'])) {
            $project->users()->sync($validated['user_ids']);
        }

            return ApiResponse::created($project, 'Project created successfully');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to create project', 500, $e->getMessage());
        }
    }
    

    public function show(string $id)
    {
        try {
            $project = Project::findOrFail($id);

            return ApiResponse::success($project);
        } catch (\Exception $e) {
            return ApiResponse::notFound('Project not found');
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $project = Project::findOrFail($id);

            $validated = $request->validate([
                'name'        => 'sometimes|required|string|max:255|unique:projects,name,' . $project->id,
                'description' => 'sometimes|string',
                'status'      => 'sometimes|in:active,inactive,archived',
                'user_ids'    => 'sometimes|array', // usuarios a asignar
                'user_ids.*'  => 'exists:users,id'
            ]);

            $projectData = collect($validated)->except('user_ids')->toArray();

            $project->update($projectData);

            if (array_key_exists('user_ids', $validated)) {
            $project->users()->sync($validated['user_ids']);
        }
     
            return ApiResponse::updated($project, 'Project updated successfully');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to update project', 500, $e->getMessage());
        }
    }

    public function destroy(string $id)
    {
        try {
            $project = Project::findOrFail($id);

            if ($project->versions()->exists()) {
                return ApiResponse::conflict(
                    'Cannot delete project with existing versions. Please delete versions first.'
                );
            }

            $project->delete();

            return ApiResponse::deleted('Project deleted successfully');
        } catch (\Exception $e) {

            return ApiResponse::error('Failed to delete project', 500, $e->getMessage());
        }
    }

    //------ Assignacion de usuarios ------//

    // Añadir usuarios sin eliminar existentes
     public function addUsers(Request $request, Project $project)
    {
        $validated = $request->validate([
            'user_ids'   => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        try {
            $project->users()->sync($validated['user_ids']);
            return ApiResponse::success($project->load('users'), 'Users assigned successfully');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to assign users', 500, $e->getMessage());
        }
    }

    // Remover usuarios
    public function removeUsers(Request $request, Project $project)
    {
    $validated = $request->validate([
        'user_ids'   => 'required|array',
        'user_ids.*' => 'exists:users,id',
    ]);

    try {
        $project->users()->detach($validated['user_ids']); // elimina solo los indicados
        return ApiResponse::success($project->load('users'), 'Users removed successfully');
    } catch (\Exception $e) {
        return ApiResponse::error('Failed to remove users', 500, $e->getMessage());
    }
}

    /**
     * Datos para dashboard de un proyecto
     */
    public function dashboard($projectId)
    {
        try {
            $project = Project::with(['versions.testCases', 'versions.testExecutions'])->findOrFail($projectId);

            $totalTestCases = 0;
            $totalExecutions = 0;
            $passedExecutions = 0;
            $failedExecutions = 0;

            foreach ($project->versions as $version) {
                $totalTestCases += $version->testCases->count();
                $totalExecutions += $version->testExecutions->count();
                $passedExecutions += $version->testExecutions->where('result', 'passed')->count();
                $failedExecutions += $version->testExecutions->where('result', 'failed')->count();
            }

            // Últimas 10 ejecuciones
            $latestExecutions = TestExecution::whereHas('version', function ($query) use ($projectId) {
                $query->where('project_id', $projectId);
            })
                ->with(['testCase', 'version', 'user'])
                ->orderBy('executed_at', 'desc')
                ->limit(10)
                ->get();

            return ApiResponse::success([
                'project' => $project,
                'metrics' => [
                    'total_versions' => $project->versions->count(),
                    'total_test_cases' => $totalTestCases,
                    'total_executions' => $totalExecutions,
                    'passed_executions' => $passedExecutions,
                    'failed_executions' => $failedExecutions,
                    'success_rate' => $totalExecutions > 0 ? round(($passedExecutions / $totalExecutions) * 100, 2) : 0
                ],
                'latest_executions' => $latestExecutions,
                'versions_summary' => $project->versions->map(function ($version) {
                    return [
                        'id' => $version->id,
                        'version_number' => $version->version_number,
                        'test_cases_count' => $version->testCases->count(),
                        'executions_count' => $version->testExecutions->count()
                    ];
                })
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ApiResponse::notFound('Project not found');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve dashboard data', 500, $e->getMessage());
        }
    }
}