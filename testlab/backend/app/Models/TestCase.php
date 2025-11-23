<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TestCase extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'objective',
        'preconditions',
        'steps',
        'expected_result',
        'user_profile',
        'version_id'
    ];

    protected $casts = [
        'steps' => 'array' // Para manejar JSON automáticamente
    ];

    // Relación con Version
    public function version()
    {
        return $this->belongsTo(Version::class);
    }

    // Acceso indirecto al Project a través de Version
    public function project()
    {
        return $this->throughVersion->hasProject();
    }

    // Relación con TestExecutions (las ejecuciones de este test case)
    /* public function testExecutions()
    {
        return $this->hasMany(TestExecution::class);
    }*/
}
