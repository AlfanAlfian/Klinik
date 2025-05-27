<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wilayah extends Model
{
    protected $table = 'wilayahs';

    protected $fillable = [
        'nama_wilayah',
        'tipe',
        'wilayah_induk_id',
    ];

    public function induk()
    {
        return $this->belongsTo(Wilayah::class, 'wilayah_induk_id');
    }

    public function anak()
    {
        return $this->hasMany(Wilayah::class, 'wilayah_induk_id');
    }
}
