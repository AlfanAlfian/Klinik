<?php

namespace App\Http\Controllers;

use App\Models\KunjunganPasien;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller 
{
    public function index()
    {
        // Get current month's data
        $currentMonth = Carbon::now()->format('m');
        $currentYear = Carbon::now()->format('Y');

        // Most common tindakan this month
        $popularTindakan = KunjunganPasien::select('tindakan', DB::raw('count(*) as total'))
            ->whereMonth('tanggal_kunjungan', $currentMonth)
            ->whereYear('tanggal_kunjungan', $currentYear)
            ->whereNotNull('tindakan')
            ->groupBy('tindakan')
            ->orderByDesc('total')
            ->first();

        // Daily visits for current month
        $dailyVisits = KunjunganPasien::select(
            DB::raw('DATE(tanggal_kunjungan) as date'),
            DB::raw('count(*) as total_visits')
        )
            ->whereMonth('tanggal_kunjungan', $currentMonth)
            ->whereYear('tanggal_kunjungan', $currentYear)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Monthly revenue
        $monthlyRevenue = KunjunganPasien::select(
            DB::raw('MONTH(tanggal_kunjungan) as month'),
            DB::raw('YEAR(tanggal_kunjungan) as year'),
            DB::raw('SUM(total_tagihan) as total_revenue')
        )
            ->whereYear('tanggal_kunjungan', $currentYear)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        // Most prescribed products/medicines this month
        $popularProducts = DB::table('kunjungan_product')
            ->join('products', 'kunjungan_product.product_id', '=', 'products.id')
            ->join('kunjungan_pasiens', 'kunjungan_product.kunjungan_pasien_id', '=', 'kunjungan_pasiens.id')
            ->select(
                'products.name as product_name',
                DB::raw('count(*) as total_prescribed')
            )
            ->whereMonth('kunjungan_pasiens.tanggal_kunjungan', $currentMonth)
            ->whereYear('kunjungan_pasiens.tanggal_kunjungan', $currentYear)
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_prescribed')
            ->limit(5)
            ->get();

        return inertia('dashboard', [
            'statistics' => [
                'popularTindakan' => [
                    'name' => $popularTindakan?->tindakan ?? 'N/A',
                    'total' => $popularTindakan?->total ?? 0
                ],
                'dailyVisits' => $dailyVisits,
                'monthlyRevenue' => $monthlyRevenue,
                'popularProducts' => $popularProducts
            ]
        ]);
    }
}