<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasApiTokens;


    protected $fillable = [
        'name',
        'email',
        'password',
        'rol'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Roles
    const ROLE_ADMIN = 'admin';
    const ROLE_MANAGER = 'manager';
    const ROLE_TESTER = 'tester';

    const ROLES = [
        self::ROLE_ADMIN,
        self::ROLE_MANAGER,
        self::ROLE_TESTER
    ];


    // Relaciones
    public function testExecution(): HasMany
    {
        return $this->hasMany(TestExecution::class, 'user_id');
    }

    // Scopes
    public function scopeAdmin($query)
    {
        return $query->where('rol', self::ROLE_ADMIN);
    }

    public function scopeManager($query)
    {
        return $query->where('rol', self::ROLE_MANAGER);
    }

    public function scopeTester($query)
    {
        return $query->where('rol', self::ROLE_TESTER);
    }
}