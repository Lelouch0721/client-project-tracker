<?php

namespace App\Http\Requests;

use App\Models\Project;
use Illuminate\Contracts\Validation\Validator as ValidatorContract;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Validator;

class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'client_name' => ['required', 'string', 'max:255'],
            'project_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'string', 'in:' . implode(',', Project::STATUSES)],
            'priority' => ['required', 'string', 'in:' . implode(',', Project::PRIORITIES)],
            'start_date' => ['nullable', 'date'],
            'due_date' => ['nullable', 'date'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'client_name.required' => 'The client name is required.',
            'project_name.required' => 'The project name is required.',
            'status.in' => 'The status must be one of: ' . implode(', ', Project::STATUSES) . '.',
            'priority.in' => 'The priority must be one of: ' . implode(', ', Project::PRIORITIES) . '.',
        ];
    }

    /**
     * Configure the validator instance to add the cross-field date check.
     */
    public function withValidator(ValidatorContract $validator): void
    {
        $validator->after(function (ValidatorContract $validator) {
            $startDate = $this->input('start_date');
            $dueDate = $this->input('due_date');

            if ($startDate && $dueDate && $dueDate < $startDate) {
                $validator->errors()->add(
                    'due_date',
                    'The due date cannot be earlier than the start date.'
                );
            }
        });
    }
}
