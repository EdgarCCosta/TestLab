<?php

namespace App\DTOs;

use App\Models\Project;

class ProjectDTO
{
    public int $id;
    public string $name;
    public ?string $description;
    public string $status;
    public ?string $latest_version;
    public int $versions_count;
    public ?string $created_by;


    public function __construct(
        int $id,
        string $name,
        ?string $description,
        string $status,
        ?string $latest_version,
        int $versions_count,
        ?string $created_by = null


        
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->status = $status;
        $this->latest_version = $latest_version;
        $this->versions_count = $versions_count;
        $this->created_by = $created_by;
    }

    public static function fromModel(Project $project): self
    {
        return new self(

            $project->id,
            $project->name,
            $project->description,
            $project->status,
            $project->getLatestVersion()?->version_number,
            $project->versionsCount(),
            $project->creator?->name 
        );
    }

    public static function fromCollection($projects): array
    {
        return $projects->map(fn($p) => self::fromModel($p))->toArray();
    }
}