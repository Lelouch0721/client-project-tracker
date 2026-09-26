import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import { ErrorBanner } from "../components/Feedback";
import { validateProjectForm } from "../hooks/useProjectFormValidation";
import { createProject, ValidationApiError } from "../services/projectService";
import { emptyProjectForm, ProjectFormData, ValidationErrors } from "../types/project";

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<ProjectFormData>(emptyProjectForm);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit() {
    const clientErrors = validateProjectForm(data);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      await createProject(data);
      navigate("/", { state: { flash: "Project created successfully." } });
    } catch (error) {
      if (error instanceof ValidationApiError) {
        setErrors(error.errors);
      } else {
        setServerError("Unable to create the project. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">New Project</h1>
      <p className="mt-1 text-sm text-slate-500">
        Fill in the details below to create a new client project.
      </p>

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
          submitLabel="Create Project"
          onChange={setData}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/")}
        />
      </div>
    </div>
  );
}
