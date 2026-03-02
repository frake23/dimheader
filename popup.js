const headersList = document.getElementById("headersList");
const addBtn = document.getElementById("addBtn");
const emptyState = document.getElementById("emptyState");
const masterToggle = document.getElementById("masterToggle");

let headers = [];
let enabled = true;

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function save() {
  chrome.storage.sync.set({ headers, enabled });
}

function updateEmptyState() {
  emptyState.classList.toggle("hidden", headers.length > 0);
}

function createRow(header, animate = true) {
  const row = document.createElement("div");
  row.className = "header-row" + (header.enabled ? "" : " disabled");
  if (!animate) row.style.animation = "none";
  row.dataset.id = header.id;

  row.innerHTML = `
    <label class="row-toggle" title="Toggle header">
      <input type="checkbox" ${header.enabled ? "checked" : ""} />
      <span class="toggle-track"><span class="toggle-thumb"></span></span>
    </label>
    <input type="text" class="input-name"     placeholder="Название заголовка" value="${escapeAttr(header.name)}" spellcheck="false" />
    <span class="separator">:</span>
    <input type="text" class="input-value" placeholder="Значение" value="${escapeAttr(header.value)}" spellcheck="false" />
    <button class="delete-btn" title="Remove">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  `;

  const toggle = row.querySelector(".row-toggle input");
  const nameInput = row.querySelector(".input-name");
  const valueInput = row.querySelector(".input-value");
  const deleteBtn = row.querySelector(".delete-btn");

  toggle.addEventListener("change", () => {
    header.enabled = toggle.checked;
    row.classList.toggle("disabled", !header.enabled);
    save();
  });

  nameInput.addEventListener("input", () => {
    header.name = nameInput.value;
    save();
  });

  valueInput.addEventListener("input", () => {
    header.value = valueInput.value;
    save();
  });

  deleteBtn.addEventListener("click", () => {
    row.classList.add("removing");
    row.addEventListener("animationend", () => {
      headers = headers.filter((h) => h.id !== header.id);
      row.remove();
      updateEmptyState();
      save();
    });
  });

  return row;
}

function escapeAttr(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

addBtn.addEventListener("click", () => {
  const header = { id: generateId(), name: "", value: "", enabled: true };
  headers.push(header);
  headersList.appendChild(createRow(header));
  updateEmptyState();
  save();

  const nameInput = headersList.lastElementChild.querySelector(".input-name");
  nameInput.focus();
});

masterToggle.addEventListener("change", () => {
  enabled = masterToggle.checked;
  document.querySelectorAll(".header-row").forEach((row) => {
    row.style.transition = "opacity 0.3s ease";
    row.style.opacity = enabled ? "" : "0.35";
    row.style.pointerEvents = enabled ? "" : "none";
  });
  addBtn.style.opacity = enabled ? "" : "0.35";
  addBtn.style.pointerEvents = enabled ? "" : "none";
  save();
});

chrome.storage.sync.get({ headers: [], enabled: true }, (data) => {
  headers = data.headers;
  enabled = data.enabled;
  masterToggle.checked = enabled;

  headers.forEach((h) => headersList.appendChild(createRow(h, false)));
  updateEmptyState();

  if (!enabled) {
    document.querySelectorAll(".header-row").forEach((row) => {
      row.style.opacity = "0.35";
      row.style.pointerEvents = "none";
    });
    addBtn.style.opacity = "0.35";
    addBtn.style.pointerEvents = "none";
  }
});
