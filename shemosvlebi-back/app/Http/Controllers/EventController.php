<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{

    public function index()
    {
        set_time_limit(0);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        if ($user->role === 'admin') {
            return Event::with('branch', 'user')->get();
        }
        return Event::with('branch', 'user')->where('branch_id', $user->branch_id)->get();
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $rules = [
            'category' => 'required|string|max:255',
            'supplier' => 'nullable|string',
        ];
        $request->validate($rules);

        $data = [
            'category' => $request->category,
            'supplier' => $request->supplier,
            'branch_id' => $user->branch_id,
            'user_id' => $user->id,
        ];

        if ($user->role === 'admin') {
            if ($request->has('branch_id')) {
                $data['branch_id'] = $request->branch_id;
            }
            if ($request->has('user_id')) {
                $data['user_id'] = $request->user_id;
            }
        }

        $event = Event::create($data);

        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        return $event->load('branch', 'user');
    }

    public function update(Request $request, Event $event)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        if ($event->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $rules = [
            'category' => 'required|string|max:255',
            'supplier' => 'nullable|string',
        ];
        $request->validate($rules);

        $data = $request->only(['category', 'supplier']);

        if ($user->role === 'admin') {
            if ($request->has('branch_id')) {
                $data['branch_id'] = $request->branch_id;
            }
            if ($request->has('user_id')) {
                $data['user_id'] = $request->user_id;
            }
        }

        $event->update($data);
        return $event;
    }

    public function destroy(Event $event)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        if ($event->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }

    public function otherBranchesEvents()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        return Event::with('branch', 'user')
            ->where('branch_id', '!=', $user->branch_id)
            ->get();
    }
}
