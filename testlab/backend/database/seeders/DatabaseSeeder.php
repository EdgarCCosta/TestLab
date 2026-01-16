<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Project;
use App\Models\Version;
use App\Models\TestCase;
use App\Models\TestExecution;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | 1️⃣ USUARIOS
        |--------------------------------------------------------------------------
        */

        $users = [];

        $users['ana'] = User::updateOrCreate(
            ['email' => 'ana.lopez@example.com'],
            ['name' => 'Ana López', 'password' => Hash::make('password'), 'rol' => 'admin']
        );

        $users['carlos'] = User::updateOrCreate(
            ['email' => 'carlos.garcia@example.com'],
            ['name' => 'Carlos García', 'password' => Hash::make('password'), 'rol' => 'manager']
        );

        $users['marta'] = User::updateOrCreate(
            ['email' => 'marta.fernandez@example.com'],
            ['name' => 'Marta Fernández', 'password' => Hash::make('password'), 'rol' => 'tester']
        );

        $users['luis'] = User::updateOrCreate(
            ['email' => 'luis.martinez@example.com'],
            ['name' => 'Luis Martínez', 'password' => Hash::make('password'), 'rol' => 'tester']
        );

        $users['elena'] = User::updateOrCreate(
            ['email' => 'elena.ruiz@example.com'],
            ['name' => 'Elena Ruiz', 'password' => Hash::make('password'), 'rol' => 'admin']
        );

        /*
        |--------------------------------------------------------------------------
        | 2️⃣ PROYECTOS (created_by explícito)
        |--------------------------------------------------------------------------
        */

        $projects = [];

        $projects['escolar'] = Project::updateOrCreate(
            ['name' => 'Gestión Escolar'],
            [
                'description' => 'Sistema para gestionar alumnos y profesores',
                'status' => 'active',
                'created_by' => $users['ana']->id
            ]
        );

        $projects['ecommerce'] = Project::updateOrCreate(
            ['name' => 'E-commerce Moda'],
            [
                'description' => 'Tienda online de ropa',
                'status' => 'active',
                'created_by' => $users['carlos']->id
            ]
        );

        $projects['crm'] = Project::updateOrCreate(
            ['name' => 'CRM Ventas'],
            [
                'description' => 'Gestión de clientes y oportunidades',
                'status' => 'inactive',
                'created_by' => $users['elena']->id
            ]
        );

        $projects['fitness'] = Project::updateOrCreate(
            ['name' => 'App Fitness'],
            [
                'description' => 'Aplicación móvil para entrenamientos',
                'status' => 'active',
                'created_by' => $users['marta']->id
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | 3️⃣ VERSIONES
        |--------------------------------------------------------------------------
        */

        $versions = [];

        $versions['v1'] = Version::updateOrCreate(
            ['version_number' => 'v1.0', 'project_id' => $projects['escolar']->id],
            ['release_date' => '2025-01-01', 'description' => 'Versión inicial']
        );

        $versions['v1_1'] = Version::updateOrCreate(
            ['version_number' => 'v1.1', 'project_id' => $projects['escolar']->id],
            ['release_date' => '2025-02-01', 'description' => 'Corrección de errores']
        );

        $versions['v2'] = Version::updateOrCreate(
            ['version_number' => 'v2.0', 'project_id' => $projects['ecommerce']->id],
            ['release_date' => '2025-03-01', 'description' => 'Nueva funcionalidad']
        );

        /*
        |--------------------------------------------------------------------------
        | 4️⃣ TEST CASES
        |--------------------------------------------------------------------------
        */

        $testCases = [];

        $testCases['login_ok'] = TestCase::updateOrCreate(
            ['title' => 'Login correcto'],
            [
                'objective' => 'Verificar acceso con credenciales válidas',
                'preconditions' => 'Usuario registrado',
                'steps' => json_encode(['Abrir login', 'Ingresar credenciales', 'Enviar']),
                'expected_result' => 'Acceso concedido',
                'user_profile' => 'tester'
            ]
        );

        $testCases['login_fail'] = TestCase::updateOrCreate(
            ['title' => 'Login incorrecto'],
            [
                'objective' => 'Verificar rechazo con credenciales inválidas',
                'preconditions' => 'Usuario registrado',
                'steps' => json_encode(['Abrir login', 'Ingresar credenciales erróneas', 'Enviar']),
                'expected_result' => 'Acceso denegado',
                'user_profile' => 'tester'
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | 5️⃣ ASOCIAR TEST CASES A VERSIONES (pivot)
        |--------------------------------------------------------------------------
        */

        $versions['v1']->testCases()->syncWithoutDetaching([
            $testCases['login_ok']->id,
            $testCases['login_fail']->id
        ]);

        /*
        |--------------------------------------------------------------------------
        | 6️⃣ TEST EXECUTIONS
        |--------------------------------------------------------------------------
        */

        TestExecution::updateOrCreate(
            [
                'test_case_id' => $testCases['login_ok']->id,
                'version_id'   => $versions['v1']->id,
                'user_id'      => $users['marta']->id,
            ],
            [
                'result'       => 'passed',
                'comment'      => 'Login exitoso',
                'test_data'    => json_encode(['browser' => 'Chrome']),
                'error_status' => 'none',
                'observations' => 'Todo correcto',
                'executed_at'  => now()
            ]
        );

        TestExecution::updateOrCreate(
            [
                'test_case_id' => $testCases['login_fail']->id,
                'version_id'   => $versions['v1']->id,
                'user_id'      => $users['luis']->id,
            ],
            [
                'result'       => 'failed',
                'comment'      => 'Credenciales inválidas',
                'test_data'    => json_encode(['browser' => 'Firefox']),
                'error_status' => 'low',
                'observations' => 'Comportamiento esperado',
                'executed_at'  => now()
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | ✅ FIN
        |--------------------------------------------------------------------------
        */

        $this->command->info('✅ Seeder ejecutado correctamente (usuarios, proyectos, versiones y tests)');
    }
}
