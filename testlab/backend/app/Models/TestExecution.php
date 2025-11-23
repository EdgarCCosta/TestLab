<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    protected $casts = [
        'test_data' => 'array',
        'executed_at' => 'datetime'
    ];

    // Relaciones
    public function testCase()
    {
        return $this->belongsTo(TestCase::class);
    }

    public function version()
    {
        return $this->belongsTo(Version::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes para filtros comunes
    public function scopeByResult($query, $result)
    {
        return $query->where('result', $result);
    }

    public function scopeByVersion($query, $versionId)
    {
        return $query->where('version_id', $versionId);
    }

    public function scopeByTestCase($query, $testCaseId)
    {
        return $query->where('test_case_id', $testCaseId);
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('executed_at', '>=', now()->subDays($days));
    }
}
