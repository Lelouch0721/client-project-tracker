<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projects = [
            [
                'client_name' => 'ABC Corporation',
                'project_name' => 'Corporate Website',
                'description' => 'Full redesign of the corporate marketing website with a new CMS.',
                'status' => 'In Progress',
                'priority' => 'High',
                'start_date' => '2026-09-01',
                'due_date' => '2026-10-15',
            ],
            [
                'client_name' => 'XYZ Retail',
                'project_name' => 'Inventory Management System',
                'description' => 'Custom inventory tracking system with barcode scanning support.',
                'status' => 'Planning',
                'priority' => 'Medium',
                'start_date' => '2026-10-01',
                'due_date' => '2026-12-20',
            ],
            [
                'client_name' => 'Tech Solutions Inc.',
                'project_name' => 'Mobile Application',
                'description' => 'Cross-platform mobile app for field service technicians.',
                'status' => 'Completed',
                'priority' => 'High',
                'start_date' => '2026-05-01',
                'due_date' => '2026-08-30',
            ],
            [
                'client_name' => 'Green Valley Farms',
                'project_name' => 'E-commerce Storefront',
                'description' => 'Online storefront for direct-to-consumer produce sales.',
                'status' => 'On Hold',
                'priority' => 'Low',
                'start_date' => '2026-07-15',
                'due_date' => null,
            ],
            [
                'client_name' => 'Bluepoint Logistics',
                'project_name' => 'Fleet Tracking Dashboard',
                'description' => 'Real-time dashboard for monitoring delivery fleet locations and status.',
                'status' => 'In Progress',
                'priority' => 'Medium',
                'start_date' => '2026-08-10',
                'due_date' => '2026-11-05',
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
