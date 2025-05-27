<?php

namespace App\Http\Controllers;

use App\Http\Requests\PasienRequest;
use App\Models\Pasien;
use App\Models\Pegawai;
use Illuminate\Http\Request;
use App\Models\KunjunganPasien;

class PasienController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pasiens = Pasien::with('pegawai')->latest()->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nama' => $item->nama,
                'nik' => $item->nik,
                'telepon' => $item->telepon,
                'jenis_kunjungan' => $item->jenis_kunjungan,
                'pegawai' => $item->pegawai ? $item->pegawai->nama : null,
                'created_at' => $item->created_at->format('d M Y'),
            ];
        });

        return inertia('pasien/index', [
            'pasiens' => $pasiens,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $pegawai = Pegawai::where('jabatan', 'dokter')->get();
        return inertia('pasien/pasien-form', ['pegawaiOption' => $pegawai]);    
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PasienRequest $request)
    {

        // Create new patient
        $pasien = Pasien::create($request->validated());

        // Create initial kunjungan record
        KunjunganPasien::create([
            'pasien_id' => $pasien->id,
            'tanggal_kunjungan' => now(),
        ]);

        return redirect()->route('pasiens.index')
            ->with('success', 'Pasien berhasil ditambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Logic to display a specific patient
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        // Logic to show form for editing a specific patient
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Logic to update a specific patient
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Logic to delete a specific patient
    }
}
