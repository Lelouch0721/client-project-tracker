# Client Project Tracker

A simple, professional web application that lets project managers at a
digital agency create, view, update, and delete client projects. Built as
two independent applications — a Laravel REST API and a React (TypeScript)
frontend — that communicate only over HTTP.

## Project Overview

Project managers can:

- View all client projects in a searchable, filterable, sortable dashboard
- View full details of a single project
- Create a new project
- Edit an existing project
- Delete a project, with a confirmation step

The backend enforces every business rule (required fields, allowed status
and priority values, due date not before start date) independently of the
frontend, and returns consistent JSON responses and HTTP status codes.

## Technology Stack

**Backend**
- Laravel (PHP 8.2+)
- MySQL
- Eloquent ORM
- Laravel Form Requests for validation

**Frontend**
- React + TypeScript
- Vite
- Axios
- React Router
- Tailwind CSS

## Project Structure

```text
client-project-tracker/
├── backend/                    Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/    ProjectController (thin — delegates to the service)
│   │   │   ├── Requests/       StoreProjectRequest, UpdateProjectRequest
│   │   │   └── Resources/      ProjectResource — consistent JSON shape
│   │   ├── Models/              Project
│   │   └── Services/            ProjectService — search/filter/sort + persistence
│   ├── database/
│   │   ├── migrations/          projects table
│   │   ├── factories/           ProjectFactory (used by tests)
│   │   └── seeders/              ProjectSeeder — 5 sample projects
│   ├── routes/api.php           RESTful routes (Route::apiResource)
│   ├── bootstrap/app.php         Custom 404 / 422 JSON responses
│   └── tests/Feature/            ProjectTest — full CRUD + validation coverage
│
├── frontend/                    React app
│   └── src/
│       ├── components/          ProjectForm, StatusBadge, PriorityBadge,
│       │                        ConfirmDialog, Feedback (loading/empty/error/toast)
│       ├── pages/                ProjectListPage, CreateProjectPage,
│       │                        EditProjectPage, ProjectDetailPage
│       ├── services/             api.ts (Axios instance), projectService.ts
│       ├── types/                project.ts — Project, form, and error types
│       └── hooks/                useProjectFormValidation.ts
│
└── README.md
```

## Requirements

- PHP 8.2+
- Composer
- MySQL 8+ (or MariaDB)
- Node.js 18+ and npm

## Installation

### Backend

This repo ships the **application-specific** Laravel files (models,
controllers, requests, routes, migrations, seeders, tests, and the
exception/CORS config) rather than the full framework skeleton
(`vendor/`, base `config/`, etc.), since that skeleton is fetched from
Packagist and is best generated fresh on your machine.

1. Generate a new Laravel app, then merge this `backend/` folder into it:

   ```bash
   composer create-project laravel/laravel client-project-tracker-app
   ```

   Copy (overwriting where prompted) everything from this project's
   `backend/` folder — `app/`, `database/`, `routes/api.php`,
   `bootstrap/app.php`, `config/cors.php`, `tests/Feature/`, and
   `.env.example` — into `client-project-tracker-app/`.

2. From inside `client-project-tracker-app/`:

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. Create a MySQL database matching `DB_DATABASE` in `.env` (defaults to
   `client_project_tracker`), then run:

   ```bash
   php artisan migrate --seed
   php artisan serve
   ```

The API will be available at `http://127.0.0.1:8000/api`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app will be available at `http://localhost:5173`.

## Environment Configuration

**backend/.env**

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=client_project_tracker
DB_USERNAME=root
DB_PASSWORD=
FRONTEND_URL=http://localhost:5173
```

`FRONTEND_URL` is read by `config/cors.php` to allow the Vite dev server to
call the API.

**frontend/.env**

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## API Documentation

All responses are JSON. Successful list/detail/create/update responses are
wrapped in `{ "data": ... }`.

### List projects

```http
GET /api/projects
```

Optional query params: `search`, `status`, `priority`, `sort_by`
(`project_name`, `start_date`, `due_date`, `priority`), `sort_direction`
(`asc`|`desc`).

```json
{
  "data": [
    {
      "id": 1,
      "client_name": "ABC Corporation",
      "project_name": "Corporate Website",
      "description": "Company website redesign",
      "status": "In Progress",
      "priority": "High",
      "start_date": "2026-09-01",
      "due_date": "2026-10-15",
      "created_at": "2026-09-01T00:00:00+00:00",
      "updated_at": "2026-09-01T00:00:00+00:00"
    }
  ]
}
```

### Get a single project

```http
GET /api/projects/{id}
```

Returns `404` with `{ "message": "Project not found." }` if it doesn't exist.

### Create a project

```http
POST /api/projects
Content-Type: application/json

{
  "client_name": "ABC Corporation",
  "project_name": "Corporate Website",
  "description": "Company website redesign",
  "status": "Planning",
  "priority": "High",
  "start_date": "2026-09-25",
  "due_date": "2026-10-30"
}
```

Returns `201 Created` with the new project. Returns `422 Unprocessable
Entity` on validation failure:

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "due_date": ["The due date cannot be earlier than the start date."]
  }
}
```

### Update a project

```http
PUT /api/projects/{id}
```

Same body shape as create. Returns `200 OK`, or `404` if the project
doesn't exist.

### Delete a project

```http
DELETE /api/projects/{id}
```

Returns `204 No Content`, or `404` if the project doesn't exist.

## Features Implemented

- List all projects in a dashboard table with status and priority badges
- Search projects by client name or project name
- Filter projects by status and by priority
- Sort projects by project name, start date, due date, or priority
- View full details of a single project
- Create a new project, with client- and server-side validation
- Edit an existing project
- Delete a project, gated behind a confirmation dialog
- Loading, empty, and error states on the frontend for every data-fetching view
- Consistent JSON API responses and correct HTTP status codes (200, 201, 204, 404, 422) for every endpoint
- Server-side enforcement of required fields, allowed `status`/`priority` values, and the due-date-not-before-start-date rule
- Backend feature-test suite covering CRUD, validation, and 404 cases

## Assumptions Made

- **No authentication/authorization.** The spec didn't call for user accounts or login, so all projects are globally visible and editable — this would need to change before any real multi-user deployment.
- **No pagination.** `GET /api/projects` returns every project in one response. Fine for the expected demo/sample data volume; would need pagination at real scale.
- **`PUT` only, no `PATCH`.** The edit form always submits the full record, so partial updates weren't implemented.
- **Dates are plain calendar dates with no timezone handling.** `start_date`/`due_date` are stored and compared as `YYYY-MM-DD` strings; no timezone conversion is applied.
- **No soft deletes.** Deleting a project is permanent (matches the `204 No Content` / irreversible confirmation-dialog wording in the spec).
- **Single "status" and "priority" set, not configurable.** The four status values and three priority values are hardcoded (in `Project::STATUSES` / `Project::PRIORITIES` on the backend and mirrored in the frontend types) rather than stored in the database, since the spec fixed these lists.
- **CORS is left open for local development.** `config/cors.php` currently allows the Vite dev server origin via `FRONTEND_URL`; a production deployment would need this tightened to the real frontend domain.

## Running Tests

```bash
cd backend
php artisan test
```

Covers project creation, retrieval, update, deletion, required-field
validation, invalid status/priority, invalid date ranges, and 404s for
non-existent projects.

## Notes

- Business rules (allowed status/priority values, required fields, the
  due-date-after-start-date rule) are enforced server-side in
  `StoreProjectRequest` / `UpdateProjectRequest`, which is the source of
  truth. The frontend duplicates the required-field and date checks only
  for instant feedback before a request is even sent.
- All frontend HTTP calls go through `src/services/projectService.ts` —
  no component talks to Axios directly.
- `ProjectService` on the backend holds the search/filter/sort query
  logic so `ProjectController` stays thin.
