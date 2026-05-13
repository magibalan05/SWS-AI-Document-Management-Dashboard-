const API = "http://localhost:5000/api";

// Elements
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const progressContainer = document.getElementById("progressContainer");
const documentTable = document.getElementById("documentTable");
const totalDocsBadge = document.getElementById("totalDocsBadge");
const notificationDropdown = document.getElementById("notificationDropdown");
const notificationsContainer = document.getElementById("notifications");
const notificationCount = document.getElementById("notificationCount");
const toastContainer = document.getElementById("toastContainer");

// Drag and Drop Events
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  if (e.dataTransfer.files.length > 0) {
    handleFiles(e.dataTransfer.files);
  }
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    handleFiles(fileInput.files);
  }
  // reset input so the same files can be selected again if needed
  fileInput.value = "";
});

async function handleFiles(files) {
  const fileArray = Array.from(files);
  const isBulk = fileArray.length > 3;

  if (isBulk) {
    showToast(`Upload in progress — processing ${fileArray.length} files in background`);
  }

  // Upload files individually to track true per-file progress
  const uploadPromises = fileArray.map((file) => uploadSingleFile(file));

  // Wait for all to finish
  await Promise.all(uploadPromises);

  // If bulk upload, trigger the bulk notification
  if (isBulk) {
    await fetch(`${API}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: `${fileArray.length} files uploaded successfully`, type: "success" })
    });
  }

  loadDocuments();
  loadNotifications();
}

function uploadSingleFile(file) {
  return new Promise((resolve, reject) => {
    const id = "progress_" + Math.random().toString(36).substring(7);
    createProgressBar(id, file.name, file.size);

    const formData = new FormData();
    formData.append("files", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API}/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        updateProgressBar(id, percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        updateProgressBar(id, 100, "Completed", "success");
        resolve();
      } else {
        let errorMsg = "Failed";
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.message) errorMsg = res.message;
        } catch (e) {}
        updateProgressBar(id, 100, errorMsg, "error");
        resolve();
      }
    };

    xhr.onerror = () => {
      updateProgressBar(id, 100, "Network Error", "error");
      resolve();
    };

    xhr.send(formData);
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function createProgressBar(id, name, size) {
  const div = document.createElement("div");
  div.id = id;
  div.className = "progress-item";
  div.innerHTML = `
    <div class="progress-header">
      <div>
        <span class="file-info">${name}</span>
        <span class="file-size">${formatBytes(size)}</span>
      </div>
      <span class="status" id="${id}-status">0%</span>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar" id="${id}-bar"></div>
    </div>
  `;
  progressContainer.prepend(div);
}

function updateProgressBar(id, percent, statusText = null, statusClass = null) {
  const bar = document.getElementById(`${id}-bar`);
  const statusEl = document.getElementById(`${id}-status`);
  if (!bar || !statusEl) return;

  bar.style.width = percent + "%";
  
  if (statusText) {
    statusEl.innerText = statusText;
    if (statusClass) {
      statusEl.classList.add(statusClass);
      if (statusClass === "error") {
        bar.style.backgroundColor = "var(--error)";
      } else if (statusClass === "success") {
        bar.style.backgroundColor = "var(--success)";
      }
    }
  } else {
    statusEl.innerText = percent + "%";
  }
}

// Toast Notifications
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "fadeOut 0.3s ease forwards";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Document Listing
async function loadDocuments() {
  try {
    const res = await fetch(`${API}/documents`);
    const docs = await res.json();
    totalDocsBadge.innerText = docs.length;
    documentTable.innerHTML = "";
    docs.forEach((doc) => {
      documentTable.innerHTML += `
        <tr>
          <td><strong>${doc.filename}</strong></td>
          <td>${formatBytes(doc.filesize)}</td>
          <td>${new Date(doc.uploadDate).toLocaleString()}</td>
          <td><span class="badge" style="background:#dcfce7;color:#166534">${doc.status}</span></td>
          <td><a href="${API}/download/${doc._id}" class="download-link" download>Download</a></td>
        </tr>
      `;
    });
  } catch (error) {
    console.error("Failed to load documents", error);
  }
}

// Notification Center
function toggleNotifications() {
  notificationDropdown.classList.toggle("hidden");
}

async function loadNotifications() {
  try {
    const res = await fetch(`${API}/notifications`);
    const notifs = await res.json();
    
    const unread = notifs.filter((n) => !n.read).length;
    notificationCount.innerText = unread;
    notificationCount.style.display = unread > 0 ? "flex" : "none";

    notificationsContainer.innerHTML = "";
    
    if (notifs.length === 0) {
      notificationsContainer.innerHTML = `<div class="notification"><p style="color:var(--text-muted)">No notifications yet</p></div>`;
      return;
    }

    notifs.forEach((n) => {
      notificationsContainer.innerHTML += `
        <div class="notification ${n.read ? '' : 'unread'}" onclick="markAsRead(${n._id})">
          <p>${n.message}</p>
          <small>${new Date(n.timestamp).toLocaleString()}</small>
        </div>
      `;
    });
  } catch (error) {
    console.error("Failed to load notifications", error);
  }
}

async function markAsRead(id) {
  await fetch(`${API}/notifications/${id}`, { method: "PUT" });
  loadNotifications();
}

async function markAllRead() {
  await fetch(`${API}/notifications`, { method: "PUT" });
  loadNotifications();
}

// Close dropdown if clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".notification-container")) {
    notificationDropdown.classList.add("hidden");
  }
});

// Initialization
setInterval(loadNotifications, 5000);
loadDocuments();
loadNotifications();
