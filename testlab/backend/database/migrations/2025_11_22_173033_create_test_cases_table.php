<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('test_cases', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('objective'); // 
            $table->text('preconditions')->nullable();
            $table->json('steps'); // Pasos como JSON
            $table->text('expected_result');
            $table->string('user_profile'); // Perfil de usuario objetivo
            $table->foreignId('version_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->index('user_profile');        // Para filtrar por perfil
            $table->index('version_id');          // Para buscar por versión
            $table->index(['version_id', 'user_profile']); // Búsquedas compuestas
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_cases');
    }
};