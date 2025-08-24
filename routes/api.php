<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\CompanyController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Company routes
    Route::post('/company/create', [CompanyController::class, 'create']);
    Route::post('/company/generate-invite', [CompanyController::class, 'generateInvite']);
    Route::get('/company/info', [CompanyController::class, 'getCompanyInfo']);
    Route::delete('/company/employees/{employee}', [CompanyController::class, 'removeEmployee']);
});