<?php

namespace App\DTOs;
use App\Models\User;

class UserDTO
{
    public string $name;
    public string $email;
    public string $rol;

    /**
     * Create a new class instance.
     */
    public function __construct(string $name, string $email, string $rol)
    {
        $this->name = $name;
        $this->email = $email;
        $this->rol = $rol;
    }

    public static function fromModel(User $user):self
    {
        return new self (
            $user->name,
            $user->email,
            $user->rol
        );
    }

    public static function fromCollection($users):array
    {
        return $users->map(fn($u) => self::fromModel($u))->toArray();
    }
}
