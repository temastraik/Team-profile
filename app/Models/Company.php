<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Http\Request;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'manager_id',
        'invite_token'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($company) {
            $company->invite_token = Str::uuid();
        });
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function employees()
    {
        return $this->hasMany(User::class);
    }

    public function generateNewInviteToken()
    {
        $this->invite_token = Str::uuid();
        $this->save();
        
        return $this->invite_token;
    }

    public function getInviteLink()
    {
        return route('company.invite', ['token' => $this->invite_token]);
    }

    public static function createCompany($name, $managerId)
    {
        return DB::transaction(function () use ($name, $managerId) {
            $company = self::create([
                'name' => $name,
                'manager_id' => $managerId
            ]);

            User::find($managerId)->update([
                'role' => 'manager',
                'company_id' => $company->id
            ]);

            return $company;
        });
    }

    public static function findByInviteToken($token)
    {
        return self::where('invite_token', $token)->first();
    }

    public function processInviteJoin(Request $request)
    {
        $authToken = $request->cookie('auth_token') ?? $request->get('token');

        if (!$authToken) {
            session(['invite_token' => $this->invite_token]);
            return redirect('/')->with('info', 'Для вступления в компанию необходимо авторизоваться');
        }

        $accessToken = PersonalAccessToken::findToken($authToken);
        
        if (!$accessToken) {
            session(['invite_token' => $this->invite_token]);
            return redirect('/')->with('error', 'Недействительный токен авторизации');
        }

        $user = $accessToken->tokenable;

        if (!$user instanceof User) {
            session(['invite_token' => $this->invite_token]);
            return redirect('/')->with('error', 'Пользователь не найден');
        }

        Auth::login($user);

        if ($user->company_id === $this->id) {
            return redirect('/profile')->with('info', 'Вы уже состоите в этой компании');
        }

        if ($user->company_id) {
            return redirect('/profile')->with('error', 'Вы уже состоите в другой компании');
        }

        try {
            $user->joinCompany($this->id);

            session()->forget('invite_token');

            return redirect('/profile')->with('success', 'Вы успешно присоединились к компании "' . $this->name . '"');

        } catch (\Exception $e) {
            Log::error('Ошибка при присоединении к компании: ' . $e->getMessage());
            return redirect('/profile')->with('error', 'Произошла ошибка при присоединении к компании');
        }
    }

    public static function getFullCompanyInfo($companyId)
    {
        return self::with(['manager', 'employees'])->find($companyId);
    }

    public function removeEmployee($employeeId)
    {
        DB::transaction(function () use ($employeeId) {
            $employee = User::where('id', $employeeId)
                ->where('company_id', $this->id)
                ->where('role', 'executer')
                ->firstOrFail();

            $employee->update([
                'company_id' => null,
                'role' => 'user'
            ]);
        });
    }
}