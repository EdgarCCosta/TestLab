<?php

namespace App\DTOs;

use App\Models\TestCase;

class TestCaseDTO
{
    public int $id;
    public string $title;
    public string $objective;
    public ?string $preconditions;
    public array $steps;
    public string $expected_result;
    public string $user_profile;

    public int $version_id;
    public string $version_number;

    public function __construct(
        int $id,
        string $title,
        string $objective,
        ?string $preconditions,
        array $steps,
        string $expected_result,
        string $user_profile,
        int $version_id,
        string $version_number
    ) {
        $this->id = $id;
        $this->title = $title;
        $this->objective = $objective;
        $this->preconditions = $preconditions;
        $this->steps = $steps;
        $this->expected_result = $expected_result;
        $this->user_profile = $user_profile;
        $this->version_id = $version_id;
        $this->version_number = $version_number;
    }

    public static function fromModel(TestCase $testCase): self
    {
        return new self(
            $testCase->id,
            $testCase->title,
            $testCase->objective,
            $testCase->preconditions,
            $testCase->steps,
            $testCase->expected_result,
            $testCase->user_profile,
            $testCase->version?->id ?? 0,
            $testCase->version?->version_number ?? null,
        );
    }

    public static function fromCollection($testCases): array
    {
        return $testCases->map(fn($tc) => self::fromModel($tc))->toArray();
    }
}
