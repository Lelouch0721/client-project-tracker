<?php

namespace Tests\Feature;

use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_projects(): void
    {
        Project::factory()->count(3)->create();

        $response = $this->getJson('/api/projects');

        $response->assertOk()->assertJsonCount(3, 'data');
    }

    public function test_can_create_a_project(): void
    {
        $payload = [
            'client_name' => 'ABC Corporation',
            'project_name' => 'Corporate Website',
            'description' => 'Company website redesign',
            'status' => 'Planning',
            'priority' => 'High',
            'start_date' => '2026-09-25',
            'due_date' => '2026-10-30',
        ];

        $response = $this->postJson('/api/projects', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.client_name', 'ABC Corporation')
            ->assertJsonPath('data.status', 'Planning');

        $this->assertDatabaseHas('projects', ['client_name' => 'ABC Corporation']);
    }

    public function test_client_name_is_required(): void
    {
        $response = $this->postJson('/api/projects', [
            'project_name' => 'Corporate Website',
            'status' => 'Planning',
            'priority' => 'High',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors(['client_name']);
    }

    public function test_status_must_be_a_valid_value(): void
    {
        $response = $this->postJson('/api/projects', [
            'client_name' => 'ABC Corporation',
            'project_name' => 'Corporate Website',
            'status' => 'Not A Real Status',
            'priority' => 'High',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors(['status']);
    }

    public function test_priority_must_be_a_valid_value(): void
    {
        $response = $this->postJson('/api/projects', [
            'client_name' => 'ABC Corporation',
            'project_name' => 'Corporate Website',
            'status' => 'Planning',
            'priority' => 'Urgent',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors(['priority']);
    }

    public function test_due_date_cannot_be_earlier_than_start_date(): void
    {
        $response = $this->postJson('/api/projects', [
            'client_name' => 'ABC Corporation',
            'project_name' => 'Corporate Website',
            'status' => 'Planning',
            'priority' => 'High',
            'start_date' => '2026-10-30',
            'due_date' => '2026-10-01',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors(['due_date']);
    }

    public function test_can_show_a_single_project(): void
    {
        $project = Project::factory()->create();

        $response = $this->getJson("/api/projects/{$project->id}");

        $response->assertOk()->assertJsonPath('data.id', $project->id);
    }

    public function test_returns_404_for_a_non_existent_project(): void
    {
        $response = $this->getJson('/api/projects/99999');

        $response->assertNotFound()->assertJsonPath('message', 'Project not found.');
    }

    public function test_can_update_a_project(): void
    {
        $project = Project::factory()->create(['status' => 'Planning']);

        $response = $this->putJson("/api/projects/{$project->id}", [
            'client_name' => $project->client_name,
            'project_name' => $project->project_name,
            'status' => 'In Progress',
            'priority' => $project->priority,
        ]);

        $response->assertOk()->assertJsonPath('data.status', 'In Progress');
    }

    public function test_updating_a_non_existent_project_returns_404(): void
    {
        $response = $this->putJson('/api/projects/99999', [
            'client_name' => 'ABC Corporation',
            'project_name' => 'Corporate Website',
            'status' => 'Planning',
            'priority' => 'High',
        ]);

        $response->assertNotFound();
    }

    public function test_can_delete_a_project(): void
    {
        $project = Project::factory()->create();

        $response = $this->deleteJson("/api/projects/{$project->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('projects', ['id' => $project->id]);
    }

    public function test_deleting_a_non_existent_project_returns_404(): void
    {
        $response = $this->deleteJson('/api/projects/99999');

        $response->assertNotFound();
    }
}
