<?php

use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Middleware\CheckAccess;
use App\Http\Controllers\WilayahController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TindakanController;
use App\Http\Controllers\PasienController;
use App\Http\Controllers\KunjunganController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('kunjungans')->group(function () {
        Route::get('/', [KunjunganController::class, 'index'])->name('kunjungans.index');
        Route::get('/{kunjungan}', [KunjunganController::class, 'show'])->name('kunjungans.show');
    });

    Route::middleware(CheckAccess::class . ':admin')->group(function () {
        Route::resource('products', ProductController::class);
        Route::get('products/{product}/stock', [ProductController::class, 'stock'])->name('products.stock');
        Route::post('/products/{product}/add-stock', [ProductController::class, 'addStock'])->name('products.add-stock');
        Route::post('/products/{product}/remove-stock', [ProductController::class, 'removeStock'])->name('products.remove-stock');
        
        Route::resource('wilayahs', WilayahController::class);
        Route::resource('users', UserController::class);
        Route::resource('pegawais', PegawaiController::class);
        Route::resource('tindakans', TindakanController::class);
    });

    Route::middleware(CheckAccess::class . ':kasir')->group(function () {
        Route::put('kunjungans/{id}/payment', [KunjunganController::class, 'updatePaymentStatus'])
            ->name('kunjungans.payment');
    });

    Route::middleware(CheckAccess::class . ':dokter')->group(function () {
        Route::get('kunjungans/{kunjungan}/edit', [KunjunganController::class, 'edit'])
            ->name('kunjungans.edit');
        Route::put('kunjungans/{kunjungan}', [KunjunganController::class, 'update'])
            ->name('kunjungans.update');
    });

    Route::middleware(CheckAccess::class . ':petugas')->group(function () {
        Route::resource('pasiens', PasienController::class)
            ->only(['index', 'create', 'store', 'edit', 'update', 'show']);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';