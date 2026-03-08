import { tasks as tasksApi } from "../api";

export default function TaskItem({ projectId, task, onUpdate, onDelete, onEdit }) {
  const isDone = task.status === "complete";

  const toggleStatus = async () => {
    try {
      await tasksApi.update(projectId, task.id, { status: isDone ? "pending" : "complete" });
      onUpdate();
    } catch {
      // keep UI as is on error
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await tasksApi.delete(projectId, task.id);
      onDelete();
    } catch {
      // error could be shown via parent
    }
  };

  return (
    <div className={`task-row ${isDone ? "task-done" : ""}`}>
      <div style={{ flex: 1 }}>
        <strong>{task.title}</strong>
        <div className="task-meta">
          {task.due_date && `Due: ${task.due_date}`}
          {task.due_date && " · "}
          {task.status}
        </div>
      </div>
      <div className="actions">
        <button type="button" className="btn btn-sm btn-secondary" onClick={toggleStatus}>
          {isDone ? "Mark pending" : "Mark complete"}
        </button>
        <button type="button" className="btn btn-sm btn-secondary" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="btn btn-sm btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
