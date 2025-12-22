<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        User::firstOrCreate([
            'name' => 'admin',
            'email' => env("DEFAULT_ADMIN_USER"),
            'password' => Hash::make(env("DEFAULT_ADMIN_PASS")),
            'rol' => 'admin',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
