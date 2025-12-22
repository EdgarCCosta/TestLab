<?php

namespace App\DTOs;

use App\Models\TestExecution;

class TestExecutionDTO
{
    public int $id;
    public int $test_case_id;
    public int $version_id;
    public int $user_id;
    public string $result;
    public ?string $comment;
    public ?array $test_data;
    public ?string $error_status;
    public ?string $correction_notes;
    public ?string $observations;
    public ?string $executed_at;

    // Campos opcionales para mostrar info relacionada
    public ?string $user_name;
    public ?string $version_number;
    public ?string $test_title;

    public function __construct(
        int $id,
        int $test_case_id,
        int $version_id,
        int $user_id,
        string $result,
        ?string $comment,
        ?array $test_data,
        ?string $error_status,
        ?string $correction_notes,
        ?string $observations,
        ?string $executed_at,
        ?string $user_name = null,
        ?string $version_number = null,
        ?string $test_title = null
    ) {
        $this->id = $id;
        $this->test_case_id = $test_case_id;
        $this->version_id = $version_id;
        $this->user_id = $user_id;
        $this->result = $result;
        $this->comment = $comment;
        $this->test_data = $test_data;
        $this->error_status = $error_status;
        $this->correction_notes = $correction_notes;
        $this->observations = $observations;
        $this->executed_at = $executed_at;

        $this->user_name = $user_name;
        $this->version_number = $version_number;
        $this->test_title = $test_title;
    }

    public static function fromModel(TestExecution $testExecution): self
    {
        return new self(
            $testExecution->id,
            $testExecution->test_case_id,
            $testExecution->version_id,
            $testExecution->user_id,
            $testExecution->result,
            $testExecution->comment,
            $testExecution->test_data,
            $testExecution->error_status,
            $testExecution->correction_notes,
            $testExecution->observations,
            $testExecution->executed_at?->toDateTimeString(),
            $testExecution->user->name ?? null,
            $testExecution->version->version_number ?? null,
            $testExecution->testCase->title ?? null
        );
    }

    public static function fromCollection($testExecutions): array
    {
        return $testExecutions->map(function ($t) {
            return self::fromModel($t);
        })->toArray();
    }
}