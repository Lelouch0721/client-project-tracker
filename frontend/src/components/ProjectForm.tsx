import { FormEvent } from "react";
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  ProjectFormData,
  ValidationErrors,
} from "../types/project";

interface ProjectFormProps {
  data: ProjectFormData;
  errors: ValidationErrors;
  submitting: boolean;
  submitLabel: string;
  onChange: (data: ProjectFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages || messages.length === 0) return null;
  return <p className="mt-1 text-sm text-red-600">{messages[0]}</p>;
}

export default function ProjectForm({
  data,
  errors,
  submitting,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  function set<K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  const inputClass =
    "mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={inputClass}
            value={data.client_name}
            onChange={(e) => set("client_name", e.target.value)}
            maxLength={255}
          />
          <FieldError messages={errors.client_name} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={inputClass}
            value={data.project_name}
            onChange={(e) => set("project_name", e.target.value)}
            maxLength={255}
          />
          <FieldError messages={errors.project_name} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <textarea
          className={inputClass}
          rows={3}
          value={data.description}
          onChange={(e) => set("description", e.target.value)}
        />
        <FieldError messages={errors.description} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            className={inputClass}
            value={data.status}
            onChange={(e) => set("status", e.target.value as ProjectFormData["status"])}
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <FieldError messages={errors.status} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            className={inputClass}
            value={data.priority}
            onChange={(e) => set("priority", e.target.value as ProjectFormData["priority"])}
          >
            {PROJECT_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          <FieldError messages={errors.priority} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Start Date</label>
          <input
            type="date"
            className={inputClass}
            value={data.start_date}
            onChange={(e) => set("start_date", e.target.value)}
          />
          <FieldError messages={errors.start_date} />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Due Date</label>
          <input
            type="date"
            className={inputClass}
            value={data.due_date}
            onChange={(e) => set("due_date", e.target.value)}
          />
          <FieldError messages={errors.due_date} />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
