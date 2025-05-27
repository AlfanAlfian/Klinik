<?php

namespace App\Http\Controllers;

use App\Http\Requests\KunjunganRequest;
use App\Models\KunjunganPasien;
use App\Models\Pasien;
use App\Models\Product;
use Illuminate\Http\Request;

class KunjunganController extends Controller
{
    public function index()
    {
        $kunjungan = KunjunganPasien::with(['pasien', 'product'])
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'pasien' => $item->pasien->nama,
                    'tindakan' => $item->tindakan,
                    'product' => $item->product ? $item->product->nama : null,
                    'tanggal_kunjungan' => $item->tanggal_kunjungan->format('d M Y'),
                    'tagihan' => $item->tagihan,
                    'total_tagihan' => $item->total_tagihan,
                ];
            });

        return inertia('kunjungan/index', [
            'kunjungan' => $kunjungan,
        ]);
    }

    public function create()
    {
        $pasiens = Pasien::select('id', 'nama')->get();
        $products = Product::select('id', 'nama')->get();

        return inertia('kunjungan/kunjungan-form', [
            'pasienOption' => $pasiens,
            'productOption' => $products,
        ]);
    }

    public function store(KunjunganRequest $request)
{
    $validated = $request->validated();
    
    // Get product price
    $product = Product::findOrFail($validated['product_id']);
    
    // Calculate total bill
    $total_tagihan = $product->price + $validated['tarif_tindakan'];
    
    // Add total_tagihan to validated data
    $validated['total_tagihan'] = $total_tagihan;

    KunjunganPasien::create($validated);

    return redirect()->route('kunjungans.index')
        ->with('success', 'Kunjungan berhasil ditambahkan');
}

    public function edit($id)
    {
        $kunjungan = KunjunganPasien::findOrFail($id);
        $pasiens = Pasien::select('id', 'nama')->get();
        $products = Product::select('id', 'nama')->get();

        return inertia('kunjungan/kunjungan-form', [
            'kunjungan' => $kunjungan,
            'pasienOption' => $pasiens,
            'productOption' => $products,
            'isEdit' => true,
        ]);
    }

    public function update(KunjunganRequest $request, $id)
{
    $validated = $request->validated();
    
    // Get product price
    $product = Product::findOrFail($validated['product_id']);
    
    // Calculate total bill
    $total_tagihan = $product->price + $validated['tarif_tindakan'];
    
    // Add total_tagihan to validated data
    $validated['total_tagihan'] = $total_tagihan;

    $kunjungan = KunjunganPasien::findOrFail($id);
    $kunjungan->update($validated);

    return redirect()->route('kunjungans.index')
        ->with('success', 'Kunjungan berhasil diperbarui');
}

    public function destroy($id)
    {
        $kunjungan = KunjunganPasien::findOrFail($id);
        $kunjungan->delete();

        return redirect()->route('kunjungans.index')
            ->with('success', 'Kunjungan berhasil dihapus');
    }
}