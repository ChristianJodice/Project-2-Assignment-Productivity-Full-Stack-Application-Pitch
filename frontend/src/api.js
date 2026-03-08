const API = "/api";

async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${API}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

export const auth = {
  me: () => request("/auth/me"),
  login: (username, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  signup: (username, password) => request("/auth/signup", { method: "POST", body: JSON.stringify({ username, password }) }),
  logout: () => request("/auth/logout", { method: "POST" }),
};

export const projects = {
  list: (page = 1, per_page = 10) => request(`/projects?page=${page}&per_page=${per_page}`),
  get: (id) => request(`/projects/${id}`),
  create: (body) => request("/projects", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) => request(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (id) => request(`/projects/${id}`, { method: "DELETE" }),
};

export const tasks = {
  list: (projectId, page = 1, per_page = 10) => request(`/projects/${projectId}/tasks?page=${page}&per_page=${per_page}`),
  get: (projectId, taskId) => request(`/projects/${projectId}/tasks/${taskId}`),
  create: (projectId, body) => request(`/projects/${projectId}/tasks`, { method: "POST", body: JSON.stringify(body) }),
  update: (projectId, taskId, body) => request(`/projects/${projectId}/tasks/${taskId}`, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (projectId, taskId) => request(`/projects/${projectId}/tasks/${taskId}`, { method: "DELETE" }),
};
