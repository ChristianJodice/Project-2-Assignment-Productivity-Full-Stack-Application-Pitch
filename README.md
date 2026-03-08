# Project & Task Manager

A full-stack productivity app for organizing work by projects and tasks. Users can sign up, create projects, add tasks with due dates and status, and manage everything in one place. Access is restricted to authenticated users and their own data.

## Technologies Used

- **Backend:** Flask, Flask-SQLAlchemy, Flask-Bcrypt, Flask-CORS
- **Database:** SQLite (default) or PostgreSQL via `DATABASE_URL`
- **Frontend:** React 18, React Router 6, Vite

## Core Functionality

- **Authentication:** Sign up, log in, log out (session-based). Only authenticated users can access the app.
- **Projects:** Full CRUD. Each project has a name and optional description. Users see only their own projects.
- **Tasks:** Full CRUD. Tasks belong to a project and have title, optional due date, and status (pending/complete). Users can only manage tasks in projects they own.
- **Pagination:** Project list and task list support `?page=1&per_page=10` (and similar) for paginated GET requests.
- **Error handling:** Failed requests return appropriate HTTP status codes and JSON error messages; the UI displays them.

## Set Up and Run

### Backend

1. From the project root, go to the backend folder and create a virtual environment (recommended):

   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate   # Windows
   # source venv/bin/activate   # macOS/Linux
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. (Optional) Use PostgreSQL by setting the environment variable:

   ```bash
   set DATABASE_URL=postgresql://user:password@localhost/productivity
   ```

   If not set, the app uses `sqlite:///productivity.db` in the backend directory.

4. Run the Flask server:

   ```bash
   python app.py
   ```

   The API runs at `http://127.0.0.1:5000`.

### Frontend

1. From the project root, go to the frontend folder and install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start the dev server (proxies `/api` to the backend):

   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser. Use **Sign up** to create an account, then create projects and tasks.

### Production build (frontend)

- Run `npm run build` in the `frontend` folder. Serve the `dist` folder with your preferred static host (e.g. Netlify, Vercel). Point the backend URL in production (e.g. via environment variable) and add that origin to Flask-CORS in `backend/app.py` if needed.

## Deployment (optional)

- **Backend:** Deploy the Flask app to Render, Railway, or similar; set `DATABASE_URL` (e.g. PostgreSQL) and `SECRET_KEY`.
- **Frontend:** Deploy the built `frontend/dist` to Netlify, Vercel, or similar; set the API base URL to your deployed backend and ensure CORS allows that origin.

## Repository and submission

- Code is in a public GitHub repository with a clear commit history.
- `.gitignore` excludes virtual environments, `node_modules`, `.env`, and common IDE/OS files.
- This README covers project title, description, technologies, setup/run, and core functionality.
