let allTasks = [];

const user = JSON.parse(localStorage.getItem("user") || "{}");
if (!localStorage.getItem("token")) window.location.href = "login.html";

document.getElementById("userNameDisplay").textContent = "Hi, " + (user.name || "User");

async function loadTasks() {
  try {
    const res = await api.getTasks();
    allTasks = res.data.tasks;
    renderTasks(allTasks);
    updateStats(allTasks);
  } catch (err) {
    if (err.message && err.message.includes("token")) logout();
  }
}

function updateStats(tasks) {
  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("doneCount").textContent = tasks.filter((t) => t.status === "done").length;
  document.getElementById("pendingCount").textContent = tasks.filter((t) => t.status !== "done").length;
}

function renderTasks(tasks) {
  const container = document.getElementById("taskList");
  if (!tasks.length) {
    container.innerHTML = '<div class="empty-state">No tasks found.</div>';
    return;
  }
  container.innerHTML = tasks
    .map(
      (t) => `
    <div class="task-item">
      <h4>${escHtml(t.title)}</h4>
      ${t.description ? `<p>${escHtml(t.description)}</p>` : ""}
      <div class="task-meta">
        <span class="badge badge-${t.status}">${t.status}</span>
        <span class="badge badge-${t.priority}">${t.priority}</span>
        ${t.dueDate ? `<span style="font-size:11px;color:#999">Due: ${new Date(t.dueDate).toLocaleDateString()}</span>` : ""}
      </div>
      <div class="task-actions">
        <button class="btn btn-sm btn-success" onclick="editTask('${t._id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteTask('${t._id}')">Delete</button>
      </div>
    </div>
  `
    )
    .join("");
}

async function saveTask() {
  const id = document.getElementById("editId").value;
  const body = {
    title: document.getElementById("taskTitle").value.trim(),
    description: document.getElementById("taskDesc").value.trim(),
    status: document.getElementById("taskStatus").value,
    priority: document.getElementById("taskPriority").value,
    dueDate: document.getElementById("taskDue").value || undefined
  };

  if (!body.title) {
    showFormMsg("formErr", "Title is required");
    return;
  }

  try {
    if (id) {
      await api.updateTask(id, body);
      showFormMsg("formOk", "Task updated!");
    } else {
      await api.createTask(body);
      showFormMsg("formOk", "Task created!");
    }
    resetForm();
    loadTasks();
  } catch (err) {
    showFormMsg("formErr", err.message || "Something went wrong");
  }
}

function editTask(id) {
  const task = allTasks.find((t) => t._id === id);
  if (!task) return;
  document.getElementById("editId").value = id;
  document.getElementById("taskTitle").value = task.title;
  document.getElementById("taskDesc").value = task.description || "";
  document.getElementById("taskStatus").value = task.status;
  document.getElementById("taskPriority").value = task.priority;
  document.getElementById("taskDue").value = task.dueDate ? task.dueDate.split("T")[0] : "";
  document.getElementById("formTitle").textContent = "Edit Task";
  document.getElementById("cancelBtn").style.display = "block";
  window.scrollTo(0, 0);
}

async function deleteTask(id) {
  if (!confirm("Delete this task?")) return;
  try {
    await api.deleteTask(id);
    loadTasks();
  } catch (err) {
    alert(err.message || "Delete failed");
  }
}

function resetForm() {
  document.getElementById("editId").value = "";
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDesc").value = "";
  document.getElementById("taskStatus").value = "todo";
  document.getElementById("taskPriority").value = "medium";
  document.getElementById("taskDue").value = "";
  document.getElementById("formTitle").textContent = "Add New Task";
  document.getElementById("cancelBtn").style.display = "none";
  document.getElementById("formErr").style.display = "none";
  document.getElementById("formOk").style.display = "none";
}

function showFormMsg(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = "block";
  setTimeout(() => {
    el.style.display = "none";
  }, 3000);
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function escHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

loadTasks();
