<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CheckAccess
{
    public function handle(Request $request, Closure $next, $requiredAccess)
{
    $user = Auth::user();
    
    Log::info('User access: ' . $user->access);
    Log::info('Required access: ' . $requiredAccess);
    
    if (strtolower($user->access) !== strtolower($requiredAccess)) {
        Log::info('Access denied');
        abort(403, 'Access Denied');
    }

    return $next($request);
}

}