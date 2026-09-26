import type { ProjectPriority } from "../types/project";

const PRIORITY_STYLES: Record<ProjectPriority, string> = {
  Low: "bg-slate-100 text-slate-600 ring-slate-500/20",
  Medium: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  High: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

export default function PriorityBadge({ priority }: { priority: ProjectPriority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${PRIORITY_STYLES[priority]}`}
    >
      {priority}
    </span>
  );
}
