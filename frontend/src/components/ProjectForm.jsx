import { useState, useEffect } from "react";
import { projects as projectsApi } from "../api";

export default function ProjectForm({ project, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setDescription(project.description || "");
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (project?.id) {
        await projectsApi.update(project.id, { name: name.trim(), description: description.trim() });
      } else {
        await projectsApi.create({ name: name.trim(), description: description.trim() });
      }
      onSave();
    } catch (err) {
      setError(err.error || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <label>Project name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="e.g. Coursework"
      />
      <label>Description (optional)</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Brief description"
      />
      <button type="submit" className="btn" disabled={loading}>
        {loading ? "Saving…" : project?.id ? "Update project" : "Create project"}
      </button>
      <button type="button" className="btn btn-secondary" onClick={onCancel} style={{ marginLeft: "0.5rem" }}>
        Cancel
      </button>
    </form>
  );
}
