<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
<<<<<<< HEAD
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
=======
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

>>>>>>> backend_Adrian

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
<<<<<<< HEAD
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
=======
    use HasFactory, HasApiTokens;


>>>>>>> backend_Adrian
    protected $fillable = [
        'name',
        'email',
        'password',
<<<<<<< HEAD
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
=======
        'rol'
    ];

>>>>>>> backend_Adrian
    protected $hidden = [
        'password',
        'remember_token',
    ];

<<<<<<< HEAD
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
=======
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
>>>>>>> backend_Adrian
    }
}
