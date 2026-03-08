import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { projects as projectsApi } from "../api";
import ProjectForm from "../components/ProjectForm";
import Pagination from "../components/Pagination";

export default function Dashboard() {
  const [data, setData] = useState({ projects: [], total: 0, page: 1, per_page: 10, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);

  const fetchProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await projectsApi.list(page, 10);
      setData(res);
    } catch (err) {
      setError(err.error || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page]);

  const handleCreated = () => {
    setShowForm(false);
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project and all its tasks?")) return;
    try {
      await projectsApi.delete(id);
      fetchProjects();
    } catch (err) {
      setError(err.error || "Failed to delete");
    }
  };

  return (
    <>
      <h1>My Projects</h1>
      {error && <div className="error">{error}</div>}
      <p>
        <button type="button" className="btn" onClick={() => setShowForm(true)}>
          New project
        </button>
      </p>
      {showForm && (
        <ProjectForm
          onSave={handleCreated}
          onCancel={() => setShowForm(false)}
        />
      )}
      {loading ? (
        <div className="loading">Loading projects…</div>
      ) : data.projects.length === 0 ? (
        <div className="card">No projects yet. Create one to get started.</div>
      ) : (
        <>
          {data.projects.map((p) => (
            <div key={p.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.25rem 0" }}>
                    <Link to={`/projects/${p.id}`}>{p.name}</Link>
                  </h3>
                  {p.description && <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>{p.description}</p>}
                  <p className="task-meta">{p.task_count ?? 0} task(s)</p>
                </div>
                <div>
                  <Link to={`/projects/${p.id}`} className="btn btn-sm btn-secondary" style={{ marginRight: "0.35rem" }}>
                    View
                  </Link>
                  <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Pagination page={data.page} pages={data.pages} total={data.total} onPageChange={setPage} />
        </>
      )}
    </>
  );
}
