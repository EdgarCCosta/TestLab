<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
<<<<<<< Updated upstream
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
=======
        // 1. Crear usuarios
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@test.com',
            'password' => bcrypt('password123'),
            'rol' => 'admin'
        ]);

        $tester = User::create([
            'name' => 'Tester User',
            'email' => 'tester@test.com',
            'password' => bcrypt('password123'),
            'rol' => 'tester'
>>>>>>> Stashed changes
        ]);
    }
}
