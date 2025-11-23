<?php

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TestCaseController;
use App\Http\Controllers\VersionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TestExecutionController;
use Illuminate\Support\Facades\Route;

//LOGIN
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    //PROJECTS
    Route::get('/projects', [ProjectController::class, 'index'])->middleware(['auth:sanctum', 'role:admin,manager,tester']); // Listar proyectos
    Route::post('/projects', [ProjectController::class, 'store'])->middleware(['auth:sanctum', 'role:admin,manager']); // Crear proyecto
    Route::get('/projects/{id}', [ProjectController::class, 'show'])->middleware(['auth:sanctum', 'role:admin,manager,tester']); // Ver una proyecto
    Route::put('/projects/{id}', [ProjectController::class, 'update'])->middleware(['auth:sanctum', 'role:admin,manager']); // Actualizar proyecto
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->middleware(['auth:sanctum', 'role:admin,manager']); // Eliminar proyecto


    //VERSIONS
    Route::get('/versions', [VersionController::class, 'index'])->middleware(['auth:sanctum', 'role:admin,manager,tester']); // Listar versiones
    Route::post('/versions', [VersionController::class, 'store'])->middleware(['auth:sanctum', 'role:admin,manager']); // Crear version
    Route::get('/versions/{id}', [VersionController::class, 'show'])->middleware(['auth:sanctum', 'role:admin,manager,tester']);; // Ver una version
    Route::put('/versions/{id}', [VersionController::class, 'update'])->middleware(['auth:sanctum', 'role:admin,manager']);; // Actualizar version
    Route::delete('/versions/{id}', [VersionController::class, 'destroy'])->middleware(['auth:sanctum', 'role:admin,manager']);; // Eliminar version


    //TESTCASE
    Route::get('/testcases', [TestCaseController::class, 'index'])->middleware(['auth:sanctum', 'role:admin,manager,tester']); // Listar testcases
    Route::post('/testcases', [TestCaseController::class, 'store'])->middleware(['auth:sanctum', 'role:admin,manager,tester']); // Crear testcase
    Route::get('/testcases/{id}', [TestCaseController::class, 'show'])->middleware(['auth:sanctum', 'role:admin,manager']); // Ver un testcase
    Route::put('/testcases/{id}', [TestCaseController::class, 'update'])->middleware(['auth:sanctum', 'role:admin,manager,tester']); // Actualizar testcases
    Route::delete('/testcases/{id}', [TestCaseController::class, 'destroy'])->middleware(['auth:sanctum', 'role:admin,manager']); // Eliminar testcases
    Route::get('/versions/{version_id}/test-cases', [TestCaseController::class, 'getByVersion'])->middleware(['auth:sanctum', 'role:admin,manager']);


    //TESTEXECUTION
    Route::get('/testexecution', [TestExecutionController::class, 'index'])->middleware(['auth:sanctum', 'role:admin,manager,tester']); // Listar testexecution
    Route::post('/testexecution', [TestExecutionController::class, 'store'])->middleware(['auth:sanctum', 'role:admin,manager,tester']); // Crear testExecution
    Route::get('/testexecution/{id}', [TestExecutionController::class, 'show'])->middleware(['auth:sanctum', 'role:admin,manager']); // Ver un testExecution
    Route::put('/testexecution/{id}', [TestExecutionController::class, 'update'])->middleware(['auth:sanctum', 'role:admin,manager,tester']); // Actualizar testexecution
    Route::delete('/testexecution/{id}', [TestExecutionController::class, 'destroy'])->middleware(['auth:sanctum', 'role:admin,manager']); // Eliminar testexecution

});
