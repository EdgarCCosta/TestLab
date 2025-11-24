<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;

  
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

    /**
     * Hash automaticamamente la password al asignar la     
    */
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value);
    }

    // Relaciones
    public function tests(): HasMany
    {
        return $this->hasMany(Test::class);
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
