<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Responses\ApiResponse;
use App\DTOs\UserDTO;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $validated['email'])->first();

        // if (!$user || !Hash::check($validated['password'], $user->password)) {
        //     return response()->json(['message' => 'Invalid credentials'], 401);
        // }

        // Crear token
        try {
            $token = $user->createToken('angular-client')->plainTextToken;
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to create authentication token', 500, $e->getMessage());
        }

        return ApiResponse::success([
            'message' => 'Login successful',
            'token' => $token,
            'user' => UserDTO::fromModel($user)
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return ApiResponse::success(['message' => 'Logged out']);
    }
}