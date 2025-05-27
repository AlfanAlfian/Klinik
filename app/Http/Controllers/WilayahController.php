<?php

namespace App\Http\Controllers;

use App\Http\Requests\WilayahRequest;
use App\Models\Wilayah;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WilayahController extends Controller
{
    public function index()
    {
        $wilayahs = Wilayah::with('induk')->latest()->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'nama_wilayah' => $item->nama_wilayah,
                'tipe' => $item->tipe,
                'wilayah_induk_id' => $item->wilayah_induk_id,
                'induk' => $item->induk ? $item->induk->nama_wilayah : null,
                'created_at' => $item->created_at->format('d M Y'),
            ];
        });
        
        return Inertia::render('wilayah/index', [
            'wilayahs' => $wilayahs,
        ]);
    }

    public function create()
    {
        $provinsi = Wilayah::where('tipe', 'provinsi')->get();
        return Inertia::render('wilayah/wilayah-form', ['wilayahIndukOptions' => $provinsi]);
    }

    public function store(WilayahRequest $request)
    {
       try {

            $wilayah = Wilayah::create([
                'nama_wilayah' => $request->nama_wilayah,
                'tipe' => $request->tipe,
                'wilayah_induk_id' => $request->wilayah_induk_id,
            ]);

            if ($wilayah) {
                return redirect()->route('wilayahs.index')->with('success', 'Product created successfully');
            }

            return redirect()->back()->with('error', 'Unable to create product');
        } catch (Exception $e) {
            Log::error('product creation failed:' . $e->getMessage());  
        }
    }

    public function edit(Wilayah $wilayah)
    {
        $provinsi = Wilayah::where('tipe', 'provinsi')->get();
        return inertia('wilayah/wilayah-form', [
            'wilayah' => $wilayah,
            'wilayahIndukOptions' => $provinsi,
            'isEdit' => true,
        ]);
    }

    public function update(WilayahRequest $request, Wilayah $wilayah)
    {

        $wilayah->update($request->all());

        return redirect()->route('wilayahs.index')->with('success', 'Wilayah diperbarui.');
    }

    public function destroy(Wilayah $wilayah)
    {
        $wilayah->delete();
        return redirect()->route('wilayahs.index')->with('success', 'Wilayah dihapus.');
    }
}
