<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-1 month', '+1 month');

        return [
            'client_name' => $this->faker->company(),
            'project_name' => $this->faker->catchPhrase(),
            'description' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(Project::STATUSES),
            'priority' => $this->faker->randomElement(Project::PRIORITIES),
            'start_date' => $startDate->format('Y-m-d'),
            'due_date' => $this->faker->dateTimeBetween($startDate, '+3 months')->format('Y-m-d'),
        ];
    }
}
