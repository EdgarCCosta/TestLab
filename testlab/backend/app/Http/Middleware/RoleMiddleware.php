<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Si el rol del usuario está dentro de los permitidos
        if (!in_array($user->rol, $roles)) {
            return response()->json(['message' => 'Forbidden - Insufficient permissions'], 403);
        }

        return $next($request);
    }
}