<?php

namespace App\Http\Controllers;

use App\Http\Requests\KunjunganRequest;
use App\Models\KunjunganPasien;
use App\Models\Pasien;
use App\Models\Product;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Tindakan;
use Illuminate\Support\Facades\DB;

class KunjunganController extends Controller
{
    public function index()
{
    $kunjungan = KunjunganPasien::with(['pasien', 'products'])
        ->latest()
        ->get()
        ->map(function ($item) {
            return [
                'id' => $item->id,
                'pasien' => $item->pasien->nama,
                'tindakan' => $item->tindakan,
                'products' => $item->products->pluck('name')->join(', '), 
                'tanggal_kunjungan' => $item->tanggal_kunjungan ? Carbon::parse($item->tanggal_kunjungan)->format('d M Y') : null,
                'tagihan' => $item->tagihan,
                'total_tagihan' => $item->total_tagihan,
            ];
        });

    return inertia('kunjungan/index', [
        'kunjungan' => $kunjungan,
        'userRole' => request()->user()->access
    ]);
}

    public function create()
    {
        $pasiens = Pasien::select('id', 'nama')->get();
        $products = Product::select('id', 'name')->get();

        return inertia('kunjungan/kunjungan-form', [
            'pasienOption' => $pasiens,
            'productOption' => $products,
        ]);
    }

    public function store(KunjunganRequest $request)
    {
        $validated = $request->validated();
        
        $product = Product::findOrFail($validated['product_id']);
        
        $total_tagihan = $product->price + $validated['tarif_tindakan'];
        
        $validated['total_tagihan'] = $total_tagihan;

        KunjunganPasien::create($validated);

        return redirect()->route('kunjungans.index')
            ->with('success', 'Kunjungan berhasil ditambahkan');
    }

    public function edit($id)
    {
        $kunjungan = KunjunganPasien::with(['pasien', 'products'])->findOrFail($id);
        $tindakans = Tindakan::select('id', 'nama_tindakan', 'tarif')->get();
        $products = Product::select('id', 'name', 'price')->get();

        return inertia('kunjungan/kunjungan-form', [
            'kunjungan' => [
                'id' => $kunjungan->id,
                'pasien_id' => $kunjungan->pasien_id,
                'pasien_nama' => $kunjungan->pasien->nama,
                'tindakan' => $kunjungan->tindakan,
                'tarif_tindakan' => $kunjungan->tarif_tindakan,
                'product_ids' => $kunjungan->products->pluck('id')->map(fn($id) => (string)$id),
                'product_names' => $kunjungan->products->pluck('name'),
                'tanggal_kunjungan' => $kunjungan->tanggal_kunjungan->format('Y-m-d'),
                'tagihan' => $kunjungan->tagihan,
                'total_tagihan' => $kunjungan->total_tagihan,
            ],
            'tindakanOption' => $tindakans,
            'productOption' => $products,
            'isEdit' => true,
        ]);
    }

    public function update(KunjunganRequest $request, $id)
    {
        try {
            $validated = $request->validated(); 
            
            $productsTotal = Product::whereIn('id', $validated['product_ids'])
                ->sum('price');
            
            $total_tagihan = floatval($productsTotal) + floatval($validated['tarif_tindakan']);
            
            DB::beginTransaction();

            $kunjungan = KunjunganPasien::findOrFail($id);
            $kunjungan->update([
                'tindakan' => $validated['tindakan'],
                'tarif_tindakan' => $validated['tarif_tindakan'],
                'total_tagihan' => $total_tagihan
            ]);

            $kunjungan->products()->sync($validated['product_ids']);

            DB::commit();

            return redirect()->route('kunjungans.index')
                ->with('success', 'Kunjungan berhasil diperbarui');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Gagal memperbarui kunjungan: ' . $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $kunjungan = KunjunganPasien::findOrFail($id);
        $kunjungan->delete();

        return redirect()->route('kunjungans.index')
            ->with('success', 'Kunjungan berhasil dihapus');
    }

    public function updatePaymentStatus($id)
{
    try {
        DB::beginTransaction();
        
        $kunjungan = KunjunganPasien::findOrFail($id);
        
        $kunjungan->update([
            'tagihan' => 'paid',
        ]);
        
        DB::commit();
        
        return redirect()->back()
            ->with('success', 'Pembayaran berhasil diproses');
    } catch (\Exception $e) {
        DB::rollBack();
        return redirect()->back()
            ->with('error', 'Gagal memproses pembayaran: ' . $e->getMessage());
    }
}
}