<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;



class Version extends Model
{
    use HasFactory;

    protected $fillable = [
        'version_number',
        'release_date',
        'description',
        'project_id'
    ];

    // --- Casting de tipos ---
    protected $casts = [
        'release_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

     // --- Relaciones ---

    /**
     * Una versión pertenece a un proyecto
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

     // --- Métodos útiles ---

    /**
     * Determina si la versión ya fue liberada
     */
    public function isReleased(): bool
    {
        return $this->release_date?->isPast() ?? false;
    }

    /**
     * Determina si la versión está programada para futuro
     */
    public function isUpcoming(): bool
    {
        return $this->release_date?->isFuture() ?? false;
    }

    public function testCases()
    {
        return $this->hasMany(TestCase::class, 'version_id');
    }

    /**
     * Calcula días restantes hasta la liberación de la versión
     * @return int|null - null si ya fue liberada
     */
    public function getDaysUntilReleaseAttribute(): ?int
    {
        if ($this->isReleased()) {
            return null;
        }

        return now()->diffInDays($this->release_date, false);
    }

    /**
     * Valida el formato de número de versión (estilo semántico)
     */
    public static function isValidVersionNumber(string $version): bool
    {
        return preg_match('/^v\d+(\.\d+)*$/', $version) === 1;
    }
}