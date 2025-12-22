<?php

namespace App\DTOs;

use App\Models\User;

class UserDTO
{
    public int $id;
    public string $name;
    public string $email;
    public string $rol;

    /**
     * Create a new class instance.
     */
    public function __construct(int $id, string $name, string $email, string $rol)
    {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->rol = $rol;
    }

    public static function fromModel(User $user): self
    {
        return new self(
            $user->id,
            $user->name,
            $user->email,
            $user->rol
        );
    }

    public static function fromCollection($users): array
    {
        return $users->map(fn($u) => self::fromModel($u))->toArray();
    }
}