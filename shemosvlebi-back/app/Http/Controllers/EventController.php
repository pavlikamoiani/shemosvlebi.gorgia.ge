<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Branch;

class EventController extends Controller
{

    public function index()
    {
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

        $branchId = $user->branch_id;
        if ($user->role === 'admin' && $request->has('branch_id')) {
            $branchId = $request->branch_id;
        }

        $branch = Branch::find($branchId);
        if (!$branch) {
            return response()->json(['message' => 'Branch not found'], 404);
        }
        $interval = $branch->interval_minutes;

        if ($interval) {
            $lastEvent = Event::where('branch_id', $branchId)
                ->where('created_at', '>=', now()->subMinutes($interval))
                ->orderBy('created_at', 'desc')
                ->first();
            if ($lastEvent) {
                $lastCreated = $lastEvent->created_at;
                $nextAllowed = $lastCreated->copy()->addMinutes($interval);
                $now = now();

                $remainingMinutes = $now->lessThan($nextAllowed)
                    ? ceil($now->diffInMinutes($nextAllowed))
                    : 0;

                if ($remainingMinutes > 0) {
                    return response()->json([
                        'message' => "You can't add a new event to this branch until {$remainingMinutes} minutes have passed since the last event.",
                    ], 429);
                }
            }
        }

        $data = [
            'category' => $request->category,
            'supplier' => $request->supplier,
            'branch_id' => $branchId,
            'user_id' => $user->id,
        ];

        if ($user->role === 'admin') {
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
