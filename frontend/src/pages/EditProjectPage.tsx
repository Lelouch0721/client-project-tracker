import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import { ErrorBanner, LoadingState } from "../components/Feedback";
import { validateProjectForm } from "../hooks/useProjectFormValidation";
import { ApiError, getProject, updateProject, ValidationApiError } from "../services/projectService";
import { emptyProjectForm, Project, ProjectFormData, ValidationErrors } from "../types/project";

function toFormData(project: Project): ProjectFormData {
  return {
    client_name: project.client_name,
    project_name: project.project_name,
    description: project.description ?? "",
    status: project.status,
    priority: project.priority,
    start_date: project.start_date ?? "",
    due_date: project.due_date ?? "",
  };
}

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ProjectFormData>(emptyProjectForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getProject(Number(id))
      .then((project) => setData(toFormData(project)))
      .catch((error) => {
        setLoadError(error instanceof ApiError ? error.message : "Unable to load this project.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit() {
    if (!id) return;
    const clientErrors = validateProjectForm(data);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      await updateProject(Number(id), data);
      navigate("/", { state: { flash: "Project updated successfully." } });
    } catch (error) {
      if (error instanceof ValidationApiError) {
        setErrors(error.errors);
      } else {
        setServerError("Unable to update the project. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">Edit Project</h1>
      <p className="mt-1 text-sm text-slate-500">Update the details for this project.</p>

      {loading && <LoadingState label="Loading project..." />}

      {!loading && loadError && (
        <div className="mt-4">
          <ErrorBanner message={loadError} />
        </div>
      )}

      {!loading && !loadError && (
        <>
          {serverError && (
            <div className="mt-4">
              <ErrorBanner message={serverError} />
            </div>
          )}
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <ProjectForm
              data={data}
              errors={errors}
              submitting={submitting}
              submitLabel="Save Changes"
              onChange={setData}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/")}
            />
          </div>
        </>
      )}
    </div>
  );
}
