<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index()
    {
        return Branch::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:branches',
            'address' => 'nullable|string|max:255',
            'type' => 'required',
            'interval' => 'nullable|integer|min:1',
            'startTime' => 'nullable|date_format:H:i',
            'endTime' => 'nullable|date_format:H:i|after:startTime',
        ]);

        return Branch::create([
            'name' => $request->name,
            'address' => $request->address,
            'type' => $request->type,
            'interval_minutes' => $request->interval,
            'start_time' => $request->startTime ? now()->setTimeFromTimeString($request->startTime) : null,
            'end_time' => $request->endTime ? now()->setTimeFromTimeString($request->endTime) : null,
        ]);
    }

    public function show(Branch $branch)
    {
        $branch->load('events');
        return response()->json($branch);
    }

    public function update(Request $request, Branch $branch)
    {
        $request->validate([
            'name' => 'required|string|unique:branches,name,' . $branch->id,
            'address' => 'nullable|string|max:255',
            'type' => 'required|in:Hypermarket,Warehouse',
            'interval_minutes' => 'nullable|integer|min:1',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after:start_time',
        ]);
        $branch->update($request->only(['name', 'address', 'type', 'interval_minutes', 'start_time', 'end_time']));
        return $branch;
    }

    public function destroy(Branch $branch)
    {
        $branch->delete();
        return response()->json(['message' => 'Branch deleted']);
    }
}
