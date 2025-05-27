<?php

namespace App\Http\Controllers;

use App\Http\Requests\TindakanRequest;
use App\Models\Tindakan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TindakanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tindakans = Tindakan::latest()->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nama_tindakan' => $item->nama_tindakan,
                'tarif' => $item->tarif,
                'created_at' => $item->created_at->format('d M Y'),
            ];
        });
        
        return Inertia::render('tindakan/index', [
            'tindakans' => $tindakans,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('tindakan/tindakan-form');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TindakanRequest $request)
    {
        Tindakan::create([
            'nama_tindakan' => $request->nama_tindakan,
            'tarif' => $request->tarif,
        ]);

        return redirect()->route('tindakans.index')->with('success', 'Tindakan berhasil ditambahkan.');
        
    }

    /**
     * Display the specified resource.
     */
    public function show(Tindakan $tindakan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tindakan $tindakan)
    {
        return inertia('tindakan/tindakan-form', [
            'tindakan' => $tindakan,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TindakanRequest $request, Tindakan $tindakan)
    {   
        $tindakan->update([
            'nama_tindakan' => $request->nama_tindakan,
            'tarif' => $request->tarif,
        ]);

        return redirect()->route('tindakans.index')->with('success', 'Tindakan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tindakan $tindakan)
    {
        $tindakan->delete();

        return redirect()->route('tindakans.index')->with('success', 'Tindakan berhasil dihapus.');
    }
}
