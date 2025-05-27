<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
    public function index()
    {
        $users = User::latest()->get()->map(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'email' => $item->email,
                'access' => $item->access,
                'created_at' => $item->created_at->format('d M Y'),
            ];
        });
        
        return Inertia::render('user/index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        return Inertia::render('user/user-form');
    }

    public function store(UserRequest $request)
    {
       try {

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'access' => $request->access,
                'password' => Hash::make($request->password),
            ]);

            if ($user) {
                return redirect()->route('users.index')->with('success', 'User created successfully');
            }

            return redirect()->back()->with('error', 'Unable to create user');
        } catch (Exception $e) {
            Log::error('user creation failed:' . $e->getMessage());
        }
    }

    public function edit(User $user)
    {
        return Inertia::render('user/user-form', [
            'user' => $user,
            'isEdit' => true,
        ]);
    }

    public function update(UserRequest $request, User $user)
    {

        try {
        if ($user) {
            $user->name = $request->name;
            $user->email = $request->email;
            $user->access = $request->access;
            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }
            $user->save();
            return redirect()->route('users.index')->with('success', 'User updated successfully');
        }

        return redirect()->back()->with('error', 'Unable to update user');
    } catch (Exception $e) {
        Log::error('User update failed: ' . $e->getMessage());
        return redirect()->back()->with('error', 'User update failed');
    }
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User dihapus.');
    }
}
