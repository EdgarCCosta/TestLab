<?php

namespace App\DTOs;

use App\Models\User;

class UserDTO
{
    public int $id;
    public string $entity_hash;
    public string $name;
    public string $email;
    public string $rol;

    /**
     * Constructor con valores separados
     */
    public function __construct(
        int $id,
        string $entity_hash,
        string $name,
        string $email,
        string $rol
    ) {
        $this->id = $id;
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
            $user->id,
            $user->entity_hash,
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