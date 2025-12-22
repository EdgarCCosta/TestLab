<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;

trait HasEntityHash
{
    protected static function bootHasEntityHash()
    {
        static::created(function (Model $model) {
            if (!$model->entity_hash) {
                $model->entity_hash = hash('sha256', $model->id . $model->created_at);
                $model->saveQuietly();
            }
        });
    }
}
