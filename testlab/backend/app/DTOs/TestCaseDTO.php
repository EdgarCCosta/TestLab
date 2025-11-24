<?php

namespace App\DTOs;
use App\Models\TestCase;

class TestCaseDTO
{
    public string $title;
    public string $objective;
    public string $conditions;
    public string $steps;
    public string $expected_result;
    public string $role;
    public string $project_name;

    /**
     * Create a new class instance.
     */
    public function __construct(
        string $title,
        string $objective,
        string $conditions,
        string $steps,
        string $expected_result,
        string $role,
        string $project_name
    )

    {
        $this->title = $title;
        $this->objective = $objective;
        $this->conditions = $conditions;
        $this->steps = $steps;
        $this->expected_result = $expected_result;
        $this->role = $role;
        $this->project_name = $project_name;    }

    public static function fromModel(TestCase $testCase):self
    {
        return new self (
            $testCase->title,
            $testCase->objective,
            $testCase->conditions,
            $testCase->steps,
            $testCase->expected_result,
            $testCase->role,
            $testCase->project->name
        );
    }

    public static function fromCollection($testCases):array
    {
        return $testCases->map(fn($tc) => self::fromModel($tc))->toArray();
    }
}

