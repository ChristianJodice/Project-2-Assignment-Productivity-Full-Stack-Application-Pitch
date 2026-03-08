import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projects as projectsApi, tasks as tasksApi } from "../api";
import ProjectForm from "../components/ProjectForm";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";
import Pagination from "../components/Pagination";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [taskData, setTaskData] = useState({ tasks: [], total: 0, page: 1, per_page: 10, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editProject, setEditProject] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskPage, setTaskPage] = useState(1);

  const fetchProject = async () => {
    try {
      const p = await projectsApi.get(projectId);
      setProject(p);
    } catch (err) {
      setError(err.error || "Project not found");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await tasksApi.list(projectId, taskPage, 10);
      setTaskData(res);
    } catch (err) {
      setError(err.error || "Failed to load tasks");
    }
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([fetchProject(), fetchTasks()]).finally(() => setLoading(false));
  }, [projectId, taskPage]);

  const handleProjectUpdated = () => {
    setEditProject(false);
    fetchProject();
  };

  const handleTaskSaved = () => {
    setShowTaskForm(false);
    setEditingTaskId(null);
    fetchTasks();
    fetchProject();
  };

  const handleTaskDeleted = () => {
    fetchTasks();
    fetchProject();
  };

  const handleProjectDelete = async () => {
    if (!window.confirm("Delete this project and all its tasks?")) return;
    try {
      await projectsApi.delete(projectId);
      navigate("/");
    } catch (err) {
      setError(err.error || "Failed to delete project");
    }
  };

  if (loading && !project) return <div className="loading">Loading…</div>;
  if (!project) return <div className="error">{error || "Project not found"}</div>;

  return (
    <>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>
            {editProject ? (
              <ProjectForm
                project={project}
                onSave={handleProjectUpdated}
                onCancel={() => setEditProject(false)}
              />
            ) : (
              <>
                <h2 style={{ margin: "0 0 0.25rem 0" }}>{project.name}</h2>
                {project.description && <p style={{ margin: 0, color: "#64748b" }}>{project.description}</p>}
              </>
            )}
          </div>
          {!editProject && (
            <div>
              <button type="button" className="btn btn-sm btn-secondary" onClick={() => setEditProject(true)} style={{ marginRight: "0.35rem" }}>
                Edit project
              </button>
              <button type="button" className="btn btn-sm btn-danger" onClick={handleProjectDelete}>
                Delete project
              </button>
            </div>
          )}
        </div>
      </div>

      <h3>Tasks</h3>
      {error && <div className="error">{error}</div>}
      <p>
        <button type="button" className="btn" onClick={() => { setShowTaskForm(true); setEditingTaskId(null); }}>
          Add task
        </button>
      </p>
      {showTaskForm && (
        <TaskForm
          projectId={projectId}
          task={editingTaskId ? taskData.tasks.find((t) => t.id === editingTaskId) : null}
          onSave={handleTaskSaved}
          onCancel={() => { setShowTaskForm(false); setEditingTaskId(null); }}
        />
      )}
      {taskData.tasks.length === 0 ? (
        <div className="card">No tasks yet. Add one above.</div>
      ) : (
        <>
          <div className="card" style={{ padding: 0 }}>
            {taskData.tasks.map((task) => (
              editingTaskId === task.id ? (
                <TaskForm
                  key={task.id}
                  projectId={projectId}
                  task={task}
                  onSave={handleTaskSaved}
                  onCancel={() => setEditingTaskId(null)}
                />
              ) : (
                <TaskItem
                  key={task.id}
                  projectId={projectId}
                  task={task}
                  onUpdate={fetchTasks}
                  onDelete={handleTaskDeleted}
                  onEdit={() => setEditingTaskId(task.id)}
                />
              )
            ))}
          </div>
          <Pagination page={taskData.page} pages={taskData.pages} total={taskData.total} onPageChange={setTaskPage} />
        </>
      )}
    </>
  );
}
