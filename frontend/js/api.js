const BASE_URL = "http://localhost:5000/api/v1";

function getToken() {
  return localStorage.getItem("token");
}

async function request(endpoint, method = "GET", body = null, auth = true) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers.Authorization = `Bearer ${getToken()}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(BASE_URL + endpoint, options);
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}

const api = {
  register: (body) => request("/auth/register", "POST", body, false),
  login: (body) => request("/auth/login", "POST", body, false),
  getMe: () => request("/auth/me"),
  getTasks: (query = "") => request("/tasks" + query),
  createTask: (body) => request("/tasks", "POST", body),
  updateTask: (id, body) => request(`/tasks/${id}`, "PUT", body),
  deleteTask: (id) => request(`/tasks/${id}`, "DELETE")
};
