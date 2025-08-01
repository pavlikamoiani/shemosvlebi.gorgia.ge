<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\EventController;

Route::post('/login', [AuthController::class, 'login']);

// Route::apiResource('branches', BranchController::class);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);

    Route::post('/events', [EventController::class, 'store']);
    Route::post('/events/check-conflict', [EventController::class, 'checkConflict']);
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/export', [EventController::class, 'export']);
    Route::get('/events/other-branches', [EventController::class, 'otherBranchesEvents']);
    Route::get('/events/{event}', [EventController::class, 'show']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);

    Route::get('/branches', [BranchController::class, 'index']);
    Route::post('/branches', [BranchController::class, 'store']);
    Route::get('/branches/{branch}', [BranchController::class, 'show']);
    Route::put('/branches/{branch}', [BranchController::class, 'update']);
    Route::delete('/branches/{branch}', [BranchController::class, 'destroy']);

    Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
});

Route::get('/test', function () {
    return response()->json(['message' => 'API works']);
});
