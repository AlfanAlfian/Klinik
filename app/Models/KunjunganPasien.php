<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KunjunganPasien extends Model
{
    
    protected $fillable = [
    'pasien_id',
    'tindakan',
    'tarif_tindakan',
    'tagihan',
    'total_tagihan',
    'tanggal_kunjungan'
];
    protected $casts = [
        'tanggal_kunjungan' => 'datetime',
        'tarif_tindakan' => 'decimal:2',
        'total_tagihan' => 'decimal:2'
    ];

    public function pasien()
    {
        return $this->belongsTo(Pasien::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'kunjungan_product');
    }
}
