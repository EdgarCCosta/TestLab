<?php

namespace App\DTOs;

use App\Models\Version;


class VersionDTO
{

    public int $id;
    public string $version_number;
    public string $release_date;
    public string $description;
    public string $project_name;

    /**
     * Create a new class instance.
     */
    public function __construct(
        int $id,
        string $version_number,
        string $release_date,
        string $description,
        string $project_name
    ) {
        $this->id = $id;
        $this->version_number = $version_number;
        $this->release_date = $release_date;
        $this->description = $description;
        $this->project_name = $project_name;
    }

    public static function fromModel(Version $version): self
    {
        return new self(
            $version->id,
            $version->version_number,
            $version->release_date->toDateString(),
            $version->description,
            $version->project->name
        );
    }

    public static function fromCollection($versions): array
    {
        return $versions->map(fn($v) => self::fromModel($v))->toArray();
    }
}