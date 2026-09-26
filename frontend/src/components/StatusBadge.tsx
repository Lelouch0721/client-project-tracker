import type { ProjectStatus } from "../types/project";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  Planning: "bg-slate-100 text-slate-700 ring-slate-600/20",
  "In Progress": "bg-blue-50 text-blue-700 ring-blue-600/20",
  "On Hold": "bg-amber-50 text-amber-700 ring-amber-600/20",
  Completed: "bg-green-50 text-green-700 ring-green-600/20",
};

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
