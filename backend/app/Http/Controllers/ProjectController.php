<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ProjectController extends Controller
{
    public function __construct(private readonly ProjectService $projects)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $projects = $this->projects->list($request);

        return response()->json([
            'data' => ProjectResource::collection($projects),
        ]);
    }

    public function show(Project $project): JsonResponse
    {
        return response()->json([
            'data' => new ProjectResource($project),
        ]);
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = $this->projects->create($request->validated());

        return response()->json([
            'data' => new ProjectResource($project),
        ], Response::HTTP_CREATED);
    }

    public function update(
        UpdateProjectRequest $request,
        Project $project
    ): JsonResponse {
        $project = $this->projects->update(
            $project,
            $request->validated()
        );

        return response()->json([
            'data' => new ProjectResource($project),
        ]);
    }

    public function destroy(Project $project): Response
    {
        $project->delete();

        return response()->noContent();
    }
}