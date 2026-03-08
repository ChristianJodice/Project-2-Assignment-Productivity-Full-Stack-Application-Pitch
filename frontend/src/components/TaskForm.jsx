import { useState, useEffect } from "react";
import { tasks as tasksApi } from "../api";

export default function TaskForm({ projectId, task, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDueDate(task.due_date ? task.due_date.slice(0, 10) : "");
      setStatus(task.status || "pending");
    } else {
      setTitle("");
      setDueDate("");
      setStatus("pending");
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = { title: title.trim(), status, due_date: dueDate || null };
      if (task?.id) {
        await tasksApi.update(projectId, task.id, body);
      } else {
        await tasksApi.create(projectId, body);
      }
      onSave();
    } catch (err) {
      setError(err.error || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <label>Task title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="What needs to be done?"
        />
        <label>Due date (optional)</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        >
          <option value="pending">Pending</option>
          <option value="complete">Complete</option>
        </select>
        <button type="submit" className="btn btn-sm" disabled={loading}>
          {loading ? "Saving…" : task?.id ? "Update task" : "Add task"}
        </button>
        <button type="button" className="btn btn-sm btn-secondary" onClick={onCancel} style={{ marginLeft: "0.5rem" }}>
          Cancel
        </button>
      </form>
    </div>
  );
}
