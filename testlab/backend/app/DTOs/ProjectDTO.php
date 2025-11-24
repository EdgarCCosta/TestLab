<?php

namespace App\DTOs;
use App\Models\Project;

class ProjectDTO
{
    public string $name;
    public ?string $description;
    public string $status;
    public ?string $latest_version; 
    public int $versions_count;      

    public function __construct(
        string $name,
        ?string $description,
        string $status,
        ?string $latest_version,
        int $versions_count
    ) {
        $this->name = $name;
        $this->description = $description;
        $this->status = $status;
        $this->latest_version = $latest_version;
        $this->versions_count = $versions_count;
    }

    public static function fromModel(Project $project): self
    {
        return new self(
            $project->name,
            $project->description,
            $project->status,
            $project->getLatestVersion()?->version_number,
            $project->versionsCount()
        );
    }

    public static function fromCollection($projects): array
    {
        return $projects->map(fn($p) => self::fromModel($p))->toArray();
    }
}
