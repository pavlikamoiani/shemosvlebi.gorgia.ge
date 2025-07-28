<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Branch;
use Carbon\Carbon;

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
        } else {
            // For regular users, respect the branch_id parameter if provided
            if ($branchId) {
                return Event::with('branch', 'user')->where('branch_id', $branchId)->get();
            }
            // Otherwise default to the user's assigned branch
            return Event::with('branch', 'user')->where('branch_id', $user->branch_id)->get();
        }
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

        // For regular users, always use their assigned branch_id regardless of what's in the request
        if ($user->role !== 'admin') {
            $branchId = $user->branch_id;
            if (!$branchId) {
                return response()->json(['message' => 'You do not have an assigned branch'], 400);
            }
        } else {
            // For admins, allow selecting any branch
            $branchId = $request->branch_id ?? $request->branch ?? $user->branch_id;
        }

        $branch = Branch::find($branchId);

        if (!$branch) {
            return response()->json(['message' => 'Branch not found'], 404);
        }

        // Always use 15 minutes for the restriction, regardless of branch interval
        $restrictionMinutes = $branch->interval_minutes ?? 15;
        $eventDate = \Carbon\Carbon::parse($request->event_date);

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

    /**
     * Export events for a specific date
     */
    public function export(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $date = $request->query('date');
        $branchId = $request->query('branch_id');

        if (!$date || !$branchId) {
            return response()->json(['message' => 'Date and branch_id are required'], 400);
        }

        // Convert date to Carbon instance
        $startDate = Carbon::parse($date)->startOfDay();
        $endDate = Carbon::parse($date)->endOfDay();

        // Check if user has access to this branch
        if ($user->role !== 'admin' && $user->branch_id != $branchId) {
            return response()->json(['message' => 'You do not have access to this branch'], 403);
        }

        // Get events for the specified date and branch
        $events = Event::with(['branch', 'user'])
            ->where('branch_id', $branchId)
            ->whereBetween('event_date', [$startDate, $endDate])
            ->orderBy('event_date')
            ->get();

        // Create time slots from 09:00 to 17:00 with 15-minute intervals
        $timeSlots = [];

        // Define all the time slots we need
        $allTimeSlots = [
            '09:00',
            '09:15',
            '09:30',
            '09:45',
            '10:00',
            '10:15',
            '10:30',
            '10:45',
            '11:00',
            '11:15',
            '11:30',
            '11:45',
            '12:00',
            '12:15',
            '12:30',
            '12:45',
            '13:00',
            '13:15',
            '13:30',
            '13:45',
            '14:00',
            '14:15',
            '14:30',
            '14:45',
            '15:00',
            '15:15',
            '15:30',
            '15:45',
            '16:00',
            '16:15',
            '16:30',
            '16:45',
            '17:00'
        ];

        foreach ($allTimeSlots as $timeSlot) {
            $currentDateTime = Carbon::parse($date . ' ' . $timeSlot);
            $timeSlotData = [
                'supplier' => '',
                'category' => '',
                'event_date' => $currentDateTime->format('Y-m-d H:i:s')
            ];

            // Check if there's an event at this time
            foreach ($events as $event) {
                $eventTime = Carbon::parse($event->event_date);
                if ($eventTime->format('H:i') === $currentDateTime->format('H:i')) {
                    $timeSlotData = $event->toArray();
                    break;
                }
            }

            $timeSlots[] = $timeSlotData;
        }

        return response()->json($timeSlots);
    }
}
