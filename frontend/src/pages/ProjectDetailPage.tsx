import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import { ErrorBanner, LoadingState } from "../components/Feedback";
import { ApiError, deleteProject, getProject } from "../services/projectService";
import type { Project } from "../types/project";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900">{value}</dd>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProject(Number(id))
      .then(setProject)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Unable to load this project.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!project) return;
    try {
      await deleteProject(project.id);
      navigate("/", { state: { flash: "Project deleted successfully." } });
    } catch {
      setError("Unable to delete the project. Please try again.");
      setConfirmOpen(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-800">
        ← Back to projects
      </Link>

      {loading && <LoadingState label="Loading project..." />}

      {!loading && error && (
        <div className="mt-4">
          <ErrorBanner message={error} />
        </div>
      )}

      {!loading && !error && project && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{project.project_name}</h1>
              <p className="text-sm text-slate-500">{project.client_name}</p>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={project.status} />
              <PriorityBadge priority={project.priority} />
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="Start Date" value={project.start_date ?? "Not set"} />
            <Field label="Due Date" value={project.due_date ?? "Not set"} />
          </dl>

          {project.description && (
            <div className="mt-6">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Description
              </dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                {project.description}
              </dd>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              onClick={() => setConfirmOpen(true)}
              className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
            <button
              onClick={() => navigate(`/projects/${project.id}/edit`)}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Edit Project
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this project?"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
