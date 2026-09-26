import { AxiosError } from "axios";
import api from "./api";
import type { Project, ProjectFormData, ValidationErrors } from "../types/project";

export interface ProjectQueryParams {
  search?: string;
  status?: string;
  priority?: string;
  sort_by?: string;
  sort_direction?: "asc" | "desc";
}

/** Thrown for 422 responses so callers can render field-level errors. */
export class ValidationApiError extends Error {
  errors: ValidationErrors;

  constructor(message: string, errors: ValidationErrors) {
    super(message);
    this.name = "ValidationApiError";
    this.errors = errors;
  }
}

/** Thrown for any other API failure (404, 500, network errors, etc). */
export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function handleError(error: unknown): never {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    if (status === 422) {
      throw new ValidationApiError(
        error.response?.data?.message ?? "The given data was invalid.",
        error.response?.data?.errors ?? {}
      );
    }

    if (status === 404) {
      throw new ApiError(error.response?.data?.message ?? "Project not found.", 404);
    }

    throw new ApiError("Unable to reach the server. Please try again.", status);
  }

  throw new ApiError("An unexpected error occurred. Please try again.");
}

export async function getProjects(params?: ProjectQueryParams): Promise<Project[]> {
  try {
    const response = await api.get<{ data: Project[] }>("/projects", { params });
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function getProject(id: number): Promise<Project> {
  try {
    const response = await api.get<{ data: Project }>(`/projects/${id}`);
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function createProject(data: ProjectFormData): Promise<Project> {
  try {
    const response = await api.post<{ data: Project }>("/projects", toPayload(data));
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function updateProject(id: number, data: ProjectFormData): Promise<Project> {
  try {
    const response = await api.put<{ data: Project }>(`/projects/${id}`, toPayload(data));
    return response.data.data;
  } catch (error) {
    return handleError(error);
  }
}

export async function deleteProject(id: number): Promise<void> {
  try {
    await api.delete(`/projects/${id}`);
  } catch (error) {
    return handleError(error);
  }
}

/** Converts empty-string optional fields to null before sending to the API. */
function toPayload(data: ProjectFormData) {
  return {
    ...data,
    description: data.description || null,
    start_date: data.start_date || null,
    due_date: data.due_date || null,
  };
}
