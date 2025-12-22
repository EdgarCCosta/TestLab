<?php
namespace App\DTOs;
use App\Models\User;

class UserDTO
{
<<<<<<< Updated upstream
=======
    public string $entity_hash;
>>>>>>> Stashed changes
    public string $name;
    public string $email;
    public string $rol;

<<<<<<< Updated upstream
    /**
     * Create a new class instance.
     */
    public function __construct(string $name, string $email, string $rol)
    {
=======

    public function __construct(string $entity_hash, string $name, string $email, string $rol)
    {
        $this->entity_hash = $entity_hash;
>>>>>>> Stashed changes
        $this->name = $name;
        $this->email = $email;
        $this->rol = $rol;
    }

    public static function fromModel(User $user):self
    {
<<<<<<< Updated upstream
        return new self (
=======
        
        return new self(
            $user->entity_hash,
>>>>>>> Stashed changes
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
