<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TestExecution extends Model
{
    use HasFactory;

    protected $fillable = [
        'test_case_id',
        'version_id',
        'user_id',
        'result',
        'comment',
        'test_data',
        'error_status',
        'correction_notes',
        'observations',
        'executed_at'
    ];

    // --- Casting de tipos ---
    protected $casts = [
        'test_data' => 'array',
        'executed_at' => 'datetime'
    ];

    // --- Relaciones ---

    /**
     * Una ejecución pertenece a un test case
     */
    public function testCase(): BelongsTo
    {
        return $this->belongsTo(TestCase::class);
    }

    /**
     * Una ejecución pertenece a una versión
     */
    public function version(): BelongsTo
    {
        return $this->belongsTo(Version::class);
    }

    /**
     * Una ejecución pertenece a un usuario que la realizó
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // --- Scopes generales ---

    /**
     * Filtrar ejecuciones por resultado (passed, failed, etc.)
     */
    public function scopeByResult($query, $result)
    {
        return $query->where('result', $result);
    }

    /**
     * Filtrar ejecuciones por versión
     */
    public function scopeByVersion($query, $versionId)
    {
        return $query->where('version_id', $versionId);
    }

    /**
     * Filtrar ejecuciones por test case
     */
    public function scopeByTestCase($query, $testCaseId)
    {
        return $query->where('test_case_id', $testCaseId);
    }

    /**
     * Filtrar ejecuciones recientes (últimos X días)
     */
    public function scopeRecent($query, $days = 7)
    {
        return $query->where('executed_at', '>=', now()->subDays($days));
    }

     // --- Scopes específicos ---

    /**
     * Filtrar ejecuciones que fallaron
     */
    public function scopeFailed($query)
    {
        return $query->where('result', 'failed');
    }
}