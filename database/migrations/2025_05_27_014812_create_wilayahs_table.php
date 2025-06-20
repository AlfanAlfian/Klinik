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
        Schema::create('wilayahs', function (Blueprint $table) {
             $table->id();
            $table->string('nama_wilayah');
            $table->enum('tipe', ['provinsi', 'kabupaten']);
            $table->foreignId('wilayah_induk_id')->nullable()->constrained('wilayahs')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wilayahs');
    }
};
