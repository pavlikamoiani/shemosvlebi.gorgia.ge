<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\EventController;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

// Route::apiResource('branches', BranchController::class);

Route::post('/branches', [BranchController::class, 'store']);
Route::get('/branches/{branch}', [BranchController::class, 'show']);
Route::put('/branches/{branch}', [BranchController::class, 'update']);
Route::delete('/branches/{branch}', [BranchController::class, 'destroy']);

Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{user}', [UserController::class, 'update']);
Route::delete('/users/{user}', [UserController::class, 'destroy']);

// Route::middleware(['auth:sanctum', 'role:admin'])->apiResource('branches', BranchController::class);

// Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
//     Route::post('/users', [UserController::class, 'store']);
//     Route::put('/users/{user}', [UserController::class, 'update']);
//     Route::delete('/users/{user}', [UserController::class, 'destroy']);
// });

// Route::middleware(['auth:sanctum'])->apiResource('events', EventController::class);

Route::middleware(['auth:sanctum'])->get('/events/other-branches', [EventController::class, 'otherBranchesEvents']);




Route::get('/test', function () {
    return response()->json(['message' => 'API works']);
});
