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
        Schema::create('kunjungan_pasiens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pasien_id')->constrained()->onDelete('cascade');
            $table->string('tindakan')->nullable();
            $table->decimal('tarif_tindakan', 10, 2)->default(0.00);
            $table->timestamp('tanggal_kunjungan')->useCurrent();
            $table->string('tagihan')->nullable()->default('pending');
            $table->decimal('total_tagihan', 10, 2)->default(0.00);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kunjungan_pasiens');
    }
};
