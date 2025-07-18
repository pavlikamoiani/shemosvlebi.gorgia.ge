<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user->role === 'admin') {
            return Event::with('branch', 'user')->get();
        }
        return Event::with('branch', 'user')->where('branch_id', $user->branch_id)->get();
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after:start_time',
        ]);

        $event = Event::create([
            'title' => $request->title,
            'description' => $request->description,
            'branch_id' => $user->branch_id,
            'user_id' => $user->id,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        return $event->load('branch', 'user');
    }

    public function update(Request $request, Event $event)
    {
        $user = Auth::user();
        if ($event->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after:start_time',
        ]);

        $event->update($request->all());
        return $event;
    }

    public function destroy(Event $event)
    {
        $user = Auth::user();
        if ($event->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }

    public function otherBranchesEvents()
    {
        $user = Auth::user();
        return Event::with('branch', 'user')
            ->where('branch_id', '!=', $user->branch_id)
            ->get();
    }
}
