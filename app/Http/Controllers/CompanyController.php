<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CompanyController extends Controller
{
    public function create(Request $request)
    {
        $user = Auth::user();

        if ($user->hasCompany()) {
            return response()->json([
                'error' => 'Вы уже состоите в компании'
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:companies,name|regex:/^[^\d]+$/'
        ], [
            'name.regex' => 'Название компании не должно содержать цифр'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        try {
            $company = Company::createCompany($request->name, $user->id);

            return response()->json([
                'success' => true,
                'message' => 'Компания успешно создана',
                'company' => $company,
                'invite_link' => $company->getInviteLink()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ошибка при создании компании'
            ], 500);
        }
    }

    public function generateInvite(Request $request)
    {
        $user = Auth::user();

        if (!$user->canManageCompany()) {
            return response()->json([
                'error' => 'Только руководитель компании может генерировать приглашения'
            ], 403);
        }

        $newToken = $user->managedCompany->generateNewInviteToken();

        return response()->json([
            'success' => true,
            'invite_link' => $user->managedCompany->getInviteLink()
        ]);
    }

    public function joinByInvite($token)
    {
        $company = Company::findByInviteToken($token);

        if (!$company) {
            return redirect('/')->with('error', 'Недействительная ссылка приглашения');
        }

        return $company->processInviteJoin(request());
    }

    public function getCompanyInfo(Request $request)
    {
        $user = Auth::user();

        if (!$user->hasCompany()) {
            return response()->json([
                'company' => null
            ]);
        }

        $company = Company::getFullCompanyInfo($user->company_id);

        return response()->json([
            'company' => $company,
            'is_manager' => $user->isManager()
        ]);
    }

    public function removeEmployee(Request $request, $employeeId)
    {
        $user = Auth::user();

        if (!$user->canManageCompany()) {
            return response()->json([
                'error' => 'Только руководитель компании может удалять сотрудников'
            ], 403);
        }

        try {
            $user->managedCompany->removeEmployee($employeeId);

            return response()->json([
                'success' => true,
                'message' => 'Сотрудник успешно удален из компании'
            ]);

        } catch (\Exception $e) {
            Log::error('Ошибка при удалении сотрудника: ' . $e->getMessage());
            return response()->json([
                'error' => 'Произошла ошибка при удалении сотрудника'
            ], 500);
        }
    }
}