export type ProjectStatus = "Planning" | "In Progress" | "On Hold" | "Completed";

export type ProjectPriority = "Low" | "Medium" | "High";

export const PROJECT_STATUSES: ProjectStatus[] = [
  "Planning",
  "In Progress",
  "On Hold",
  "Completed",
];

export const PROJECT_PRIORITIES: ProjectPriority[] = ["Low", "Medium", "High"];

export interface Project {
  id: number;
  client_name: string;
  project_name: string;
  description?: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date?: string | null;
  due_date?: string | null;
  created_at: string;
  updated_at: string;
}

/** Shape of the form used for both creating and editing a project. */
export interface ProjectFormData {
  client_name: string;
  project_name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string;
  due_date: string;
}

export const emptyProjectForm: ProjectFormData = {
  client_name: "",
  project_name: "",
  description: "",
  status: "Planning",
  priority: "Medium",
  start_date: "",
  due_date: "",
};

/** Field-level validation errors as returned by the Laravel API (422 responses). */
export type ValidationErrors = Partial<Record<keyof ProjectFormData, string[]>>;
