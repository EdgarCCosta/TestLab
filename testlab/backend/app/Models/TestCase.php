<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TestCase extends Model
{
    use HasFactory;

    protected $table = 'test_cases';
    
    protected $fillable = [
        'title',
        'objective',
        'conditions',
        'steps',
        'expected_result',
        'role',
        'project_id'
    ];

    // --- Relaciones ---

    /**
     * Un test case pertenece a un proyecto
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    /**
     * Un test case puede tener muchas ejecuciones
     */
    public function executions(): HasMany
    {
        return $this->hasMany(TestExecution::class, 'test_case_id');
    }

    /**
     * Relación muchos a muchos con Version
     */
    public function versions(): BelongsToMany
    {
        return $this->belongsToMany(
            Version::class,        
            'version_test_cases',  
            'test_case_id',        
            'version_id'           
        )->withTimestamps();
    }

    // --- Scopes útiles ---

    /**
     * Filtrar por rol del test case
     */
    public function scopeByRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Filtrar por proyecto
     */
    public function scopeByProject($query, int $projectId)
    {
        return $query->where('project_id', $projectId);
    }
}
