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

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::middleware(CheckAccess::class . ':admin')->group(function () {
        Route::resource('products', ProductController::class);
        Route::get('products/{product}/stock', [ProductController::class, 'stock'])->name('products.stock');
        Route::post('/products/{product}/add-stock', [ProductController::class, 'addStock'])->name('products.add-stock');
        Route::post('/products/{product}/remove-stock', [ProductController::class, 'removeStock'])->name('products.remove-stock');
    
        Route::resource('wilayahs', WilayahController::class);
        Route::resource('users', UserController::class);
        Route::resource('pegawais', PegawaiController::class);
        Route::resource('tindakans', TindakanController::class);
        Route::resource('kunjungans', KunjunganController::class);
});
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
