<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;


Route::get('/', function () {
    return view('welcome');
})->name('welcome');

Route::get('/profile', function () {
    return view('profile');
})->name('profile');

Route::get('/auth/modal', function () {
    return view('auth-modal');
})->name('auth.modal');

Route::get('/company/invite/{token}', [CompanyController::class, 'joinByInvite'])
    ->name('company.invite');