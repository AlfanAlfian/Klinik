<?php

namespace App\Http\Controllers;

use App\Http\Requests\PegawaiRequest;
use App\Models\Pegawai;
use Illuminate\Http\Request;
use App\Models\Wilayah;

class PegawaiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pegawais = Pegawai::with('wilayah')->latest()->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nama' => $item->nama,
                'jabatan' => $item->jabatan,
                'telepon' => $item->telepon,
                'wilayah' => $item->wilayah ? $item->wilayah->nama_wilayah : null,
                'created_at' => $item->created_at->format('d M Y'),
            ];
        });

        return inertia('pegawai/index', [
            'pegawais' => $pegawais,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $wilayahs = Wilayah::where('tipe', 'provinsi')->get();
        return inertia('pegawai/pegawai-form', ['wilayahOptions' => $wilayahs]);    
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PegawaiRequest $request)
    {

        $pegawai = Pegawai::create([
            'nama' => $request->nama,
            'jabatan' => $request->jabatan,
            'telepon' => $request->telepon,
            'wilayah_id' => $request->wilayah_id,
        ]);

        if ($pegawai) {
            return redirect()->route('pegawais.index')->with('success', 'Pegawai created successfully');
        }

        return redirect()->back()->with('error', 'Unable to create pegawai');
    }

    /**
     * Display the specified resource.
     */
    public function show(Pegawai $pegawai)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pegawai $pegawai)
    {
        $wilayahs = Wilayah::where('tipe', 'provinsi')->get();
        return inertia('pegawai/pegawai-form', [
            'pegawai' => $pegawai,
            'wilayahOptions' => $wilayahs,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pegawai $pegawai)
    {
        $pegawai->update($request->all());

        if ($pegawai) {
            return redirect()->route('pegawais.index')->with('success', 'Pegawai updated successfully');
        }

        return redirect()->back()->with('error', 'Unable to update pegawai');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pegawai $pegawai)
    {
        $pegawai->delete();

        if ($pegawai) {
            return redirect()->route('pegawais.index')->with('success', 'Pegawai deleted successfully');
        }

        return redirect()->back()->with('error', 'Unable to delete pegawai');
    }
}
