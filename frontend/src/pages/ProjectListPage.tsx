import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import { EmptyState, ErrorBanner, LoadingState, SuccessToast } from "../components/Feedback";
import { deleteProject, getProjects } from "../services/projectService";
import type { Project, ProjectPriority, ProjectStatus } from "../types/project";
import { PROJECT_PRIORITIES, PROJECT_STATUSES } from "../types/project";

export default function ProjectListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority | "">("");
  const [sortBy, setSortBy] = useState("");
  const [toast, setToast] = useState<string | null>(
    (location.state as { flash?: string } | null)?.flash ?? null
  );
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    // Clear the navigation state so a page refresh doesn't re-show the toast.
    if (location.state) {
      window.history.replaceState({}, document.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects({
        search: search || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
        sort_by: sortBy || undefined,
      });
      setProjects(data);
    } catch {
      setError("Unable to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, sortBy]);

  useEffect(() => {
    const timeout = setTimeout(load, 250); // debounce search typing
    return () => clearTimeout(timeout);
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  async function confirmDelete() {
    if (pendingDeleteId === null) return;
    try {
      await deleteProject(pendingDeleteId);
      setProjects((prev) => prev.filter((p) => p.id !== pendingDeleteId));
      setToast("Project deleted successfully.");
    } catch {
      setError("Unable to delete the project. Please try again.");
    } finally {
      setPendingDeleteId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500">Manage your agency's client projects.</p>
        </div>
        <Link
          to="/projects/new"
          className="inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + New Project
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search by client or project name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 sm:max-w-xs"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | "")}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        >
          <option value="">All statuses</option>
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as ProjectPriority | "")}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        >
          <option value="">All priorities</option>
          {PROJECT_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        >
          <option value="">Sort: Newest first</option>
          <option value="project_name">Sort: Project Name</option>
          <option value="start_date">Sort: Start Date</option>
          <option value="due_date">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {error && (
          <div className="p-4">
            <ErrorBanner message={error} />
          </div>
        )}

        {!error && loading && <LoadingState />}

        {!error && !loading && projects.length === 0 && <EmptyState />}

        {!error && !loading && projects.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Client</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Project</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Priority</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Start</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-600">Due</th>
                  <th className="px-4 py-3 text-right font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">{project.client_name}</td>
                    <td className="px-4 py-3 text-slate-700">{project.project_name}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={project.priority} />
                    </td>
                    <td className="px-4 py-3 text-slate-500">{project.start_date ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-500">{project.due_date ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3 text-sm">
                        <button
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className="font-medium text-slate-600 hover:text-slate-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/projects/${project.id}/edit`)}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setPendingDeleteId(project.id)}
                          className="font-medium text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete this project?"
        message="Are you sure you want to delete this project? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />

      {toast && <SuccessToast message={toast} />}
    </div>
  );
}
