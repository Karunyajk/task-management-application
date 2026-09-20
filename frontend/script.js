const API_URL = "https://task-management-application-0suh.onrender.com/tasks";
const USER_API = "https://task-management-application-0suh.onrender.com/users";

// =========================
// Load Tasks
// =========================
async function loadTasks() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            credentials: "include"
        });

        if (response.status === 403) {
            console.log("Not logged in or session expired.");
            displayTasks([]);
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to load tasks");
        }

        const tasks = await response.json();
        displayTasks(tasks);

    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}


// =========================
// Display Tasks
// =========================
function displayTasks(tasks) {

    let taskList = document.getElementById("taskList");

    if (!taskList) {
        taskList = document.createElement("div");
        taskList.id = "taskList";

        const form = document.getElementById("taskform");

        if (form) {
            form.parentNode.appendChild(taskList);
        } else {
            document.body.appendChild(taskList);
        }
    }

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const taskDiv = document.createElement("div");

        taskDiv.className = "task-item";

        taskDiv.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>

            <label>
                <input type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id}, this.checked)">
                Completed
            </label>

            <br><br>

            <button onclick="editTask(${task.id})">
                Edit
            </button>

            <button onclick="deleteTask(${task.id})">
                Delete
            </button>

            <hr>
        `;

        taskList.appendChild(taskDiv);
    });
}


// =========================
// Add Task
// =========================
document.getElementById("taskform")?.addEventListener("submit", async function(event) {

    event.preventDefault();

    const inputs = this.querySelectorAll("input");

    const titleInput =
        document.getElementById("title") ||
        document.getElementById("taskTitle") ||
        inputs[0];

    const descriptionInput =
        document.getElementById("description") ||
        document.getElementById("taskDescription") ||
        inputs[1];

    const title = titleInput.value;
    const description = descriptionInput.value;

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                description: description,
                completed: false
            })
        });

        if (response.status === 403) {
            alert("Please login first.");
            return;
        }

        if (!response.ok) {
            alert("Failed to add task");
            return;
        }

        titleInput.value = "";
        descriptionInput.value = "";

        loadTasks();

    } catch (error) {
        console.error("Error adding task:", error);
        alert("Failed to add task");
    }
});


// =========================
// Edit Task
// =========================
async function editTask(id) {

    try {

        const getResponse = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            credentials: "include"
        });

        if (getResponse.status === 403) {
            alert("Please login first.");
            return;
        }

        const task = await getResponse.json();

        const title = prompt("Enter new title:", task.title);

        if (title === null) {
            return;
        }

        const description =
            prompt("Enter new description:", task.description);

        if (description === null) {
            return;
        }

        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                description: description,
                completed: task.completed
            })
        });

        if (!response.ok) {
            alert("Failed to update task");
            return;
        }

        loadTasks();

    } catch (error) {
        console.error("Error updating task:", error);
    }
}


// =========================
// Toggle Completed
// =========================
async function toggleTask(id, completed) {

    try {

        const getResponse = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            credentials: "include"
        });

        if (getResponse.status === 403) {
            alert("Please login first.");
            return;
        }

        const task = await getResponse.json();

        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: task.title,
                description: task.description,
                completed: completed
            })
        });

        if (!response.ok) {
            alert("Failed to update task");
            return;
        }

        loadTasks();

    } catch (error) {
        console.error("Error changing task status:", error);
    }
}


// =========================
// Delete Task
// =========================
async function deleteTask(id) {

    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (response.status === 403) {
            alert("Please login first.");
            return;
        }

        if (!response.ok) {
            alert("Failed to delete task");
            return;
        }
        loadTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
    alert("Failed to delete task");
    }
}
// =========================
// Login
// =========================
document.getElementById("loginForm")?.addEventListener("submit", async function(event) {

    event.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {

        const response = await fetch(`${USER_API}/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const message = await response.text();

        document.getElementById("authMessage").textContent = message;

        if (response.ok) {
            loadTasks();
        }

    } catch (error) {
        console.error("Login error:", error);
        document.getElementById("authMessage").textContent =
            "Login failed. Please try again.";
    }
});
// ===============================
// REGISTER USER
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const username = document.getElementById("registerUsername").value.trim();
        const password = document.getElementById("registerPassword").value.trim();

        if (!username || !password) {
            alert("Please enter username and password.");
            return;
        }

        try {
            const response = await fetch(`${USER_API}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.log("Registration failed:", errorText);
                alert("Registration failed.");
                return;
            }

            alert("Registered successfully!");

            document.getElementById("registerUsername").value = "";
            document.getElementById("registerPassword").value = "";

        } catch (error) {
            console.error("Registration error:", error);
            alert("Unable to connect to the server.");
        }
    });
}