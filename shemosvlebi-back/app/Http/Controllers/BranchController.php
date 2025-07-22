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
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'type' => 'required|in:Hypermarket,Warehouse',
            'interval_minutes' => 'nullable|integer|min:1',
            'start_time' => 'nullable|date',
            'end_time' => 'nullable|date|after:start_time',
        ]);
        return Branch::create($request->only(['name', 'address', 'type', 'interval_minutes', 'start_time', 'end_time']));
    }

    public function show(Branch $branch)
    {
        $branch->load('events');
        return response()->json($branch);
    }

    public function update(Request $request, Branch $branch)
    {
        $request->validate([
            'name' => 'required|string|max:255',
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
