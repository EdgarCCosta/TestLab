<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TestCaseController;
use App\Http\Controllers\VersionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestExecutionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

//LOGIN
Route::post('/login', [AuthController::class, 'login']);
Route::get('/users2', [UserController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);


    //PROJECTS
    Route::get('/projects', [ProjectController::class, 'index'])->middleware(['role:admin,manager,tester']); // Listar proyectos
    Route::post('/projects', [ProjectController::class, 'store'])->middleware(['role:admin,manager']); // Crear proyecto
    Route::get('/projects/{id}', [ProjectController::class, 'show'])->middleware(['role:admin,manager,tester']); // Ver una proyecto
    Route::put('/projects/{id}', [ProjectController::class, 'update'])->middleware(['role:admin,manager']); // Actualizar proyecto
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->middleware(['role:admin,manager']); // Eliminar proyecto


    //VERSIONS
    Route::get('/versions', [VersionController::class, 'index'])->middleware(['role:admin,manager,tester']); // Listar versiones
    Route::post('/versions', [VersionController::class, 'store'])->middleware(['role:admin,manager']); // Crear version
    Route::get('/versions/{id}', [VersionController::class, 'show'])->middleware(['role:admin,manager,tester']);; // Ver una version
    Route::put('/versions/{id}', [VersionController::class, 'update'])->middleware(['role:admin,manager']);; // Actualizar version
    Route::delete('/versions/{id}', [VersionController::class, 'destroy'])->middleware(['role:admin,manager']);; // Eliminar version


    //TESTCASE
    Route::get('/test-cases', [TestCaseController::class, 'index'])->middleware(['role:admin,manager,tester']); // Listar test-cases
    Route::post('/test-cases', [TestCaseController::class, 'store'])->middleware(['role:admin,manager,tester']); // Crear testcase
    Route::get('/test-cases/{id}', [TestCaseController::class, 'show'])->middleware(['role:admin,manager,tester']); // Ver un testcase
    Route::put('/test-cases/{id}', [TestCaseController::class, 'update'])->middleware(['role:admin,manager']); // Actualizar test-cases
    Route::delete('/test-cases/{id}', [TestCaseController::class, 'destroy'])->middleware(['role:admin,manager']); // Eliminar test-cases

    Route::get('/versions/{version_id}/test-cases', [TestCaseController::class, 'getByVersion'])->middleware('role:admin,manager,tester'); // Listar testcase por version



    //TESTEXECUTION
    Route::get('/test-executions', [TestExecutionController::class, 'index'])->middleware(['role:admin,manager,tester']); // Listar testexecution
    Route::post('/test-executions', [TestExecutionController::class, 'store'])->middleware(['role:admin,manager,tester']); // Crear testExecution
    Route::get('/test-executions/{id}', [TestExecutionController::class, 'show'])->middleware(['role:admin,manager']); // Ver un testExecution
    Route::put('/test-executions/{id}', [TestExecutionController::class, 'update'])->middleware(['role:admin,manager,tester']); // Actualizar testexecution
    Route::delete('/test-executions/{id}', [TestExecutionController::class, 'destroy'])->middleware(['role:admin,manager']); // Eliminar testexecution

    Route::get('/test-executions/statistics', [TestExecutionController::class, 'statistics'])->middleware('role:admin,manager,tester'); // Obtiene estadísticas generales de ejecuciones



    //USUARIOS
    Route::get('/users', [UserController::class, 'index'])->middleware('role:admin,manager');
    Route::post('/users', [UserController::class, 'store'])->middleware('role:admin');
    Route::get('/users/{id}', [UserController::class, 'show'])->middleware('role:admin,manager');
    Route::put('/users/{id}', [UserController::class, 'update'])->middleware('role:admin');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->middleware('role:admin');


    // ========== DASHBOARD ==========
    Route::get('dashboard/main', [DashboardController::class, 'mainDashboard'])->middleware('role:admin,manager,tester');
    Route::get('dashboard/projects-total', [DashboardController::class, 'totalProjects'])->middleware('role:admin,manager,tester');
    Route::get('dashboard/active-test-cases', [DashboardController::class, 'activeTestCases'])->middleware('role:admin,manager,tester');
    Route::get('dashboard/tests-executed', [DashboardController::class, 'testsExecuted'])->middleware('role:admin,manager,tester');
    Route::get('dashboard/success-rates', [DashboardController::class, 'successRates'])->middleware('role:admin,manager,tester');
});