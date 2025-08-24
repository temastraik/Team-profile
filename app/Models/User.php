<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'company_id'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function managedCompany()
    {
        return $this->hasOne(Company::class, 'manager_id');
    }

    public function isManager(): bool
    {
        return $this->role === 'manager';
    }

    public function isExecuter(): bool
    {
        return $this->role === 'executer';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    public function hasCompany(): bool
    {
        return !is_null($this->company_id);
    }

    public function canManageCompany(): bool
    {
        return $this->isManager() && $this->managedCompany;
    }

    public function createAuthToken()
    {
        return $this->createToken('MyAppToken')->plainTextToken;
    }

    public function revokeTokens()
    {
        $this->tokens()->delete();
    }

    public static function createUser(array $data)
    {
        return self::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'user'
        ]);
    }

    public function joinCompany($companyId)
    {
        $this->update([
            'role' => 'executer',
            'company_id' => $companyId
        ]);
    }
}