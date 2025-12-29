<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Version;
use App\Models\User;


class Project extends Model
{

    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'status',
        'created_by'
    ];

    // Relación con versiones
    public function versions(): HasMany
    {
        return $this->hasMany(Version::class);
    }

     // Relación N:M con usuarios asignados al proyecto
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    // Relación con el usuario que creó el proyecto
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Scope para proyectos activos
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Scope para proyectos archivados
    public function scopeArchived($query)
    {
        return $query->where('status', 'archived');
    }

    //Obtener la última versión del proyecto
    public function getLatestVersion(): ?Version
    {
        return $this->versions()->latest('release_date')->first();
    }

    //Verificar si el proyecto tiene versiones
    public function hasVersions(): bool
    {
        return $this->versions()->exists();
    }

    //Contar número de versiones
    public function versionsCount(): int
    {
        return $this->versions()->count();
    }
}