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
        Schema::create('test_executions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('test_case_id')->constrained('test_cases')->onDelete('cascade');
            $table->foreignId('version_id')->constrained('versions')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Solo obligatorio si result = failed
            $table->enum('error_status', ['critical', 'high', 'medium', 'low', 'none'])->nullable();
            $table->text('comment')->nullable();
            $table->json('test_data')->nullable();
            $table->text('correction_notes')->nullable();
            $table->text('observations')->nullable();
            $table->datetime('executed_at')->nullable();

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_executions');
    }
};
