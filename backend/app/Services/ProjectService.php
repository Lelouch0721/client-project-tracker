<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class ProjectService
{
    /**
     * Allowed columns for sorting, to prevent arbitrary column injection.
     *
     * @var array<int, string>
     */
    private const SORTABLE_COLUMNS = [
        'project_name',
        'start_date',
        'due_date',
        'priority',
    ];

    /**
     * Fetch projects applying optional search, filter, and sort query params.
     */
    public function list(Request $request): Collection
    {
        $query = Project::query();

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('client_name', 'like', "%{$search}%")
                    ->orWhere('project_name', 'like', "%{$search}%");
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($priority = $request->query('priority')) {
            $query->where('priority', $priority);
        }

        $sortBy = $request->query('sort_by');
        $sortDirection = $request->query('sort_direction', 'asc') === 'desc' ? 'desc' : 'asc';

        if ($sortBy && in_array($sortBy, self::SORTABLE_COLUMNS, true)) {
            $query->orderBy($sortBy, $sortDirection);
        } else {
            $query->latest();
        }

        return $query->get();
    }

    /**
     * Create a new project from validated data.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Project
    {
        return Project::create($data);
    }

    /**
     * Update an existing project with validated data.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Project $project, array $data): Project
    {
        $project->update($data);

        return $project->fresh();
    }
}
