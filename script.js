const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const totalEl = document.getElementById("total");
const doneEl = document.getElementById("done");
const pendingEl = document.getElementById("pending");
const progressEl = document.getElementById("progress");
const progressText = document.getElementById("progressText");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let chart;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const value = taskInput.value.trim();

  if (!value) return;

  tasks.push({
    text: value,
    done: false
  });

  taskInput.value = "";
  saveTasks();
  render();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  render();
}

function render() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    li.innerHTML = `
      <span>${task.text}</span>
      <span class="status ${task.done ? "done" : "pending"}">
        ${task.done ? "Concluída" : "Pendente"}
      </span>
    `;

    li.addEventListener("click", () => toggleTask(index));
    taskList.appendChild(li);
  });

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(task => task.done).length;
  const pending = total - done;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  totalEl.textContent = total;
  doneEl.textContent = done;
  pendingEl.textContent = pending;
  progressEl.style.width = `${percent}%`;
  progressText.textContent = `${percent}%`;

  updateChart(done, pending);
}

function updateChart(done, pending) {
  const ctx = document.getElementById("chart");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Concluídas", "Pendentes"],
      datasets: [{
        data: [done, pending],
        backgroundColor: ["#22c55e", "#f87171"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: {
          labels: {
            color: "#e2e8f0"
          }
        }
      }
    }
  });
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

render();