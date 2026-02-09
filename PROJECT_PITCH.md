# Project 2 Pitch: Full-Stack Productivity Application

---

## Step 1: Business Problem Scenario

### The Problem
Individuals and small teams often juggle multiple projects without a single place to see what needs to be done. Tasks live in sticky notes, email, or scattered lists, leading to missed deadlines and mental overload.

### Target Users
- **Solo workers and students** who manage several projects (e.g., coursework, side projects, job search).
- **Small teams** who need a lightweight way to assign and track tasks without heavy project tools.

### Daily Frustrations
- No clear view of which tasks belong to which project.
- Hard to tell what’s done vs. pending.
- Time wasted re-checking multiple places for next actions.

### Why This Solution Adds Value
A **Project & Task Manager** gives one place to:
- Organize work by project.
- Create, update, and complete tasks with due dates and status.
- See progress at a glance (e.g., task counts per project).

*Optional extension:* A simple external API (e.g., motivational quote or time/date) could be used on a dashboard to support focus or planning—handled only if time allows.

### Primary Goals
1. Let users create and manage **projects** and **tasks** in one app.
2. Support full **create, read, update, delete (CRUD)** on tasks (and basic management of projects).
3. Store all data in a **SQL database** with clear relationships and error handling.

### Example User Stories
- As a user, I can **create a project** (e.g., “Coursework”) so that I can group related work.
- As a user, I can **add tasks** to a project with title, due date, and status so that I know what to do.
- As a user, I can **mark a task complete** or **edit/delete** it so that my list stays accurate.
- As a user, I can **view all projects and their tasks** on a simple dashboard so that I see my workload at a glance.
- As a user, I see **clear error messages** when something fails (e.g., save error, invalid input) so that I can correct issues.

---

## Step 2: Problem-Solving Process

### Step-by-Step Build Process (5 steps)

1. **Planning & design**  
   Lock in data models (Project, Task), API routes, and main UI screens. Sketch a simple flowchart or list of pages and actions.

2. **Backend setup**  
   Set up Flask app, SQLAlchemy, and config. Define **Project** and **Task** models with a one-to-many relationship (one project, many tasks). Create migrations and seed data for testing.

3. **Backend API & CRUD**  
   Implement REST-style routes for projects and tasks (index, create, get by id, update, delete). Add validation and **error handling** for failed requests (e.g., 400/404/500 with clear messages). Ensure all create/update operations persist to the SQL database.

4. **Frontend structure & styling**  
   Build React app with routing (e.g., React Router). Create components for: project list, project detail (with task list), task create/edit forms, and a simple dashboard. Use `useState`/`useEffect` for data fetching and form state. Apply clean, readable styling (CSS or a minimal library).

5. **Integration, testing & polish**  
   Connect frontend to backend APIs. Test CRUD flows and error cases. Fix bugs, add a brief README and deployment/run instructions. Optionally add a short reflection or presentation notes.

### Conceptual Outline

**Data models (and relations)**  
- **Project**: id, name, description (optional), created_at.  
- **Task**: id, title, due_date (optional), status (e.g., "pending" / "complete"), project_id (foreign key).  
- **Relationship**: One Project has many Tasks.

**Planned app features (high-level)**  
- List all projects.  
- View one project and its tasks.  
- Create / edit / delete tasks (full CRUD on Task).  
- Create / edit / delete projects (at least create and list; full CRUD if time permits).  
- Simple dashboard or home view summarizing projects and task counts.  
- Error handling: display user-friendly messages when API requests fail.

**React component breakdown (simplified)**  
- **App** – Router and layout.  
- **Dashboard / ProjectList** – list projects, link to project detail.  
- **ProjectDetail** – show one project and its tasks; links to add/edit task.  
- **TaskForm** – create/edit task (title, due date, status, project).  
- **TaskItem** – single task row with actions (edit, delete, mark complete).  
- Shared **ErrorMessage** or toast for failed requests.

**Tools & technologies**  
- **Backend:** Flask, SQLAlchemy, PostgreSQL or SQLite (per course setup).  
- **Frontend:** React, React Router, `useState` / `useEffect`.  
- **Storage:** SQL database; all created/updated data stored via SQLAlchemy.  
- **Quality:** Error handling on API and optional client-side validation.

### Rubric Alignment
- **Built from scratch:** New Flask + React codebase, no copying of full solutions.  
- **Productivity focus:** Organizing projects and tasks.  
- **2+ relational resources:** Project and Task with a defined relationship.  
- **CRUD on at least one custom resource:** Full CRUD on Task; projects at least list/create.  
- **SQL + SQLAlchemy:** All persistent data in SQL DB via SQLAlchemy models.  
- **Error handling:** Failed requests return appropriate status codes and messages; frontend surfaces them.

---

## Step 3: Timeline and Scope

| Phase | Activities | Estimated time |
|-------|------------|----------------|
| **1. Planning & research** | Finalize models and routes; quick flowchart or feature list; check rubric and assignment requirements. | 1–2 hours |
| **2. Backend setup & modeling** | Flask app, SQLAlchemy, Project and Task models, migrations, seed data. | 2–3 hours |
| **3. Backend API & CRUD** | Routes for projects and tasks, validation, error handling, DB persistence. | 2–3 hours |
| **4. Frontend structure & styling** | React app, Router, components (Dashboard, ProjectDetail, TaskForm, TaskItem), basic styling. | 3–4 hours |
| **5. Integration & debugging** | Connect frontend to API, test CRUD and errors, fix bugs, handle edge cases. | 2–3 hours |
| **6. README, presentation, reflection** | Run instructions, env setup, optional demo notes or short reflection. | 1–2 hours |

**Total (approximate):** 11–17 hours, spread across the project window.

### Time-boxing
- Cap backend at ~5–6 hours so enough time remains for frontend and testing.
- If a feature (e.g., optional API) risks scope creep, document it as “stretch” and implement only after core rubric items are done.

### Research / learning
- Allocate time early for: Flask + SQLAlchemy relationship syntax, React Router basics, and `fetch`/error handling in React if needed.

### Iteration and risks
- **After peer critique (if any):** Reserve 1–2 hours for addressing feedback and small fixes.  
- **Risks / open questions:**  
  - “May need to review Flask error handling patterns for consistent status codes.”  
  - “API key handling only if optional external API is added; will use env variables.”

### Scope boundaries
- **In scope:** Two resources (Project, Task), full CRUD on tasks, SQL storage, error handling, clean UI, README.  
- **Out of scope / stretch:** Auth, multiple users, file uploads, complex reporting. Optional: one simple external API for dashboard enhancement.

---

*Document length: ~1–2 pages when formatted. You can paste this into a Google Doc, add headings/bold as needed, and attach any flowchart or wireframe image before submission.*
