<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pasien extends Model
{
    protected $table = 'pasiens';
    
    protected $fillable = [
        'nama',
        'tanggal_lahir',
        'jenis_kelamin',
        'telepon',
        'alamat',
        'wilayah_id'
    ];

    protected $casts = [
        'tanggal_lahir' => 'date'
    ];

    public function wilayah()
    {
        return $this->belongsTo(Wilayah::class);
    }

    public function kunjungans()
    {
        return $this->hasMany(Kunjungan::class);
    }
}
