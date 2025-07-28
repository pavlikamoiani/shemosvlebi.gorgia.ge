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

        $branchId = request()->query('branch_id');

        if ($user->role === 'admin') {
            if ($branchId) {
                return Event::with('branch', 'user')->where('branch_id', $branchId)->get();
            }
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
            'event_date' => 'required|date',
        ];

        $request->validate($rules);

        $branchId = $user->branch_id ?? $request->branch;

        if ($user->role === 'admin' && $request->has('branch_id')) {
            $branchId = $request->branch_id;
        }

        $branch = Branch::find($branchId);

        if (!$branch) {
            return response()->json(['message' => 'Branch not found'], 404);
        }

        // Always use 15 minutes for the restriction, regardless of branch interval
        $restrictionMinutes = $branch->interval_minutes ?? 15;
        $eventDate = \Carbon\Carbon::parse($request->event_date);

        // Check for any event in this branch within ±15 minutes of the requested event_date
        $conflictingEvent = Event::where('branch_id', $branchId)
            ->whereBetween('event_date', [
                $eventDate->copy()->subMinutes($restrictionMinutes),
                $eventDate->copy()->addMinutes($restrictionMinutes)
            ])
            ->first();

        if ($conflictingEvent) {
            return response()->json([
                'message' => $branch->name . ' ფილიალში ღონისძიების ინტერვალი: ' . $restrictionMinutes . ' წუთია',
            ], 400);
        }

        $data = [
            'category' => $request->category,
            'supplier' => $request->supplier,
            'branch_id' => $branchId,
            'user_id' => $user->id,
            'event_date' => date('Y-m-d H:i:s', strtotime($request->event_date)),
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
            'branch_id' => 'nullable|exists:branches,id',
        ];
        $request->validate($rules);

        $data = $request->only(['category', 'supplier', 'branch_id']);

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
        return Event::with('branch', 'user')->get();
    }
}
