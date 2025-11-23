<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use App\Models\TestExecution;
use App\Models\TestCase;
use App\Models\Version;

class TestExecutionController extends Controller
{
    public function index(Request $request)
    {
        try {
            $testExecutions = TestExecution::all();

            return ApiResponse::success($testExecutions);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve test executions', 500, $e->getMessage());
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'test_case_id' => 'required|exists:test_cases,id',
            'version_id' => 'required|exists:versions,id',
            'user_id' => 'required|exists:users,id',
            'result' => 'required|in:passed,failed,blocked,pending',
            'comment' => 'nullable|string',
            'test_data' => 'nullable|array',
            'error_status' => 'required_if:result,failed|in:critical,high,medium,low,none',
            'correction_notes' => 'nullable|string',
            'observations' => 'nullable|string',
            'executed_at' => 'nullable|date'
        ]);

        try {
            // Si no se proporciona executed_at, usar fecha actual
            if (!isset($validated['executed_at'])) {
                $validated['executed_at'] = now();
            }

            $testExecution = TestExecution::create($validated);
            $testExecution->load(['testCase', 'version', 'user']);

            return ApiResponse::created($testExecution, 'Test execution recorded successfully');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to record test execution', 500, $e->getMessage());
        }
    }

    public function show(string $id)
    {
        try {
            $testExecution = TestExecution::with(['testCase', 'version', 'user'])->findOrFail($id);
            return ApiResponse::success($testExecution);
        } catch (\Exception $e) {
            return ApiResponse::notFound('Test execution not found');
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $testExecution = TestExecution::findOrFail($id);

            $validated = $request->validate([
                'result' => 'sometimes|in:passed,failed,blocked,pending',
                'comment' => 'nullable|string',
                'test_data' => 'nullable|array',
                'error_status' => 'sometimes|in:critical,high,medium,low,none',
                'correction_notes' => 'nullable|string',
                'observations' => 'nullable|string',
                'executed_at' => 'sometimes|date'
            ]);

            $testExecution->update($validated);
            $testExecution->load(['testCase', 'version', 'user']);

            return ApiResponse::updated($testExecution, 'Test execution updated successfully');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to update test execution', 500, $e->getMessage());
        }
    }

    public function destroy(string $id)
    {
        try {
            $testExecution = TestExecution::findOrFail($id);
            $testExecution->delete();

            return ApiResponse::deleted('Test execution deleted successfully');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to delete test execution', 500, $e->getMessage());
        }
    }
}
