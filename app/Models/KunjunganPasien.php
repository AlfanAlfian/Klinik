<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KunjunganPasien extends Model
{
    protected $fillable = [
    'pasien_id',
    'tindakan',
    'tarif_tindakan',
    'product_id',
    'tanggal_kunjungan',
    'tagihan',
    'total_tagihan',
];

    public function pasien()
    {
        return $this->belongsTo(Pasien::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
