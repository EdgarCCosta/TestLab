<?php

namespace App\DTOs;

use App\Models\User;

class UserDTO
{
    public string $entity_hash;
    public string $name;
    public string $email;
    public string $rol;

    /**
     * Constructor con valores separados
     */
    public function __construct(string $entity_hash, string $name, string $email, string $rol)
    {
        $this->entity_hash = $entity_hash;
        $this->name = $name;
        $this->email = $email;
        $this->rol = $rol;
    }

    /**
     * Crear DTO a partir del modelo
     */
    public static function fromModel(User $user): self
    {
        return new self(
            $user->entity_hash, // hash generado por el trait
            $user->name,
            $user->email,
            $user->rol
        );
    }

    /**
     * Crear DTOs a partir de una colección de modelos
     */
    public static function fromCollection($users): array
    {
        return $users->map(fn($u) => self::fromModel($u))->toArray();
    }
}
