import { ProjectFormData, ValidationErrors } from "../types/project";

/**
 * Lightweight client-side validation that mirrors the backend's required
 * fields and date-range rule, so users get instant feedback before the
 * request even reaches the API. The backend remains the source of truth.
 */
export function validateProjectForm(data: ProjectFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.client_name.trim()) {
    errors.client_name = ["The client name is required."];
  }

  if (!data.project_name.trim()) {
    errors.project_name = ["The project name is required."];
  }

  if (data.start_date && data.due_date && data.due_date < data.start_date) {
    errors.due_date = ["The due date cannot be earlier than the start date."];
  }

  return errors;
}
