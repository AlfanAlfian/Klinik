<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckAccess
{
    public function handle(Request $request, Closure $next, $minAccess)
    {
        $user = Auth::user();

        if ($user->access < $minAccess) {
            abort(403, 'Access Denied');
        }

        return $next($request);
    }
}
