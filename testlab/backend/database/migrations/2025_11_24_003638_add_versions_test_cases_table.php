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
        Schema::create('version_test_cases', function(Blueprint $table) {
            $table->id();

            $table->foreignId('version_id')->constrained('versions')->onDelete('cascade');
            $table->foreignId('test_case_id')->constrained('test_cases')->onDelete('cascade');

        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('version_test_cases');
    }
};
