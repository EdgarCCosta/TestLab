<?php

namespace App\Http\Controllers;

use App\Http\Responses\ApiResponse;
use App\Models\User;
use App\DTOs\UserDTO;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Listar usuarios (con DTOs)
     */
    public function index()
    {
        // return response()->json(['message' => 'Hello World']);
        try {
            $users = User::all();
            $userDTOs = UserDTO::fromCollection($users);

            return ApiResponse::success($userDTOs);
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to retrieve users', 500, $e->getMessage());
        }
    }

    /**
     * Obtener usuario específico (con DTO)
     */
    public function show(string $id)
    {
        try {
            $user = User::findOrFail($id);
            $userDTO = UserDTO::fromModel($user);

            return ApiResponse::success($userDTO);
        } catch (\Exception $e) {
            return ApiResponse::notFound('User not found');
        }
    }

    /**
     * Crear usuario (con Hash manual)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'rol' => 'required|in:admin,manager,tester'
        ]);

        try {
            // ✅ Hash MANUAL (ya no tienes mutator)
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']), // ← Hash aquí
                'rol' => $validated['rol']
            ]);

            $userDTO = UserDTO::fromModel($user);
            return ApiResponse::created($userDTO, 'User created successfully');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to create user', 500, $e->getMessage());
        }
    }

    /**
     * Actualizar usuario
     */
    public function update(Request $request, string $id)
    {
        try {
            $user = User::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $user->id,
                'password' => 'sometimes|string|min:6',
                'rol' => 'sometimes|in:admin,manager,tester'
            ]);

            // ✅ Si viene password, hacer hash
            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            $user->update($validated);
            $userDTO = UserDTO::fromModel($user);

            return ApiResponse::updated($userDTO, 'User updated successfully');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to update user', 500, $e->getMessage());
        }
    }

    /**
     * Eliminar usuario
     */
    public function destroy(string $id)
    {
        try {
            $user = User::findOrFail($id);

            if ($user->testExecutions()->exists()) {
                return ApiResponse::error(
                    'Cannot delete user with associated test executions',
                    409
                );
            }

            $user->delete();
            return ApiResponse::deleted('User deleted successfully');
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to delete user', 500, $e->getMessage());
        }
    }
}