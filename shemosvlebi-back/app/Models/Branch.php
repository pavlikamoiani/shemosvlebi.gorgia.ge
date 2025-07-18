<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = ['name', 'address'];

    protected $with = ['events'];

    public function events()
    {
        return $this->hasMany(Event::class);
    }
}
