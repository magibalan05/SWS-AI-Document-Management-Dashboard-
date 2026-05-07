const API = "http://localhost:5000/api";

async function uploadFiles() {
  const fileInput = document.getElementById("fileInput");
  const files = fileInput.files;
  const formData = new FormData();

  for (let file of files) {
    formData.append("files", file);
    createProgressBar(file.name);
  }

  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${API}/upload`);

  xhr.upload.onprogress = function (e) {
    const percent = Math.round((e.loaded / e.total) * 100);
    document.querySelectorAll(".progress").forEach((bar) => {
      bar.style.width = percent + "%";
    });
  };

  xhr.onload = function () {
    loadDocuments();
    loadNotifications();
  };

  xhr.send(formData);

  if (files.length > 3) {
    alert(`Upload in progress — processing ${files.length} files in background`);
  }
}

function createProgressBar(name) {
  const container = document.getElementById("progressContainer");
  const div = document.createElement("div");
  div.classList.add("progress-item");
  div.innerHTML = `
    <p>${name}</p>
    <div class="progress-bar">
      <div class="progress"></div>
    </div>
  `;
  container.appendChild(div);
}

async function loadDocuments() {
  const res = await fetch(`${API}/documents`);
  const docs = await res.json();
  const table = document.getElementById("documentTable");
  table.innerHTML = "";
  docs.forEach((doc) => {
    table.innerHTML += `
      <tr>
        <td>${doc.filename}</td>
        <td>${(doc.filesize / 1024).toFixed(2)} KB</td>
        <td>${new Date(doc.uploadDate).toLocaleString()}</td>
        <td>${doc.status}</td>
        <td><a href="${API}/download/${doc._id}">Download</a></td>
      </tr>
    `;
  });
}

async function loadNotifications() {
  const res = await fetch(`${API}/notifications`);
  const notifications = await res.json();
  const container = document.getElementById("notifications");
  const unread = notifications.filter((n) => !n.read).length;
  document.getElementById("notificationCount").innerText = unread;
  container.innerHTML = "";
  notifications.forEach((n) => {
    container.innerHTML += `
      <div class="notification ${n.read ? '' : 'unread'}">
        <p>${n.message}</p>
        <small>${new Date(n.timestamp).toLocaleString()}</small>
      </div>
    `;
  });
}

setInterval(loadNotifications, 5000);
loadDocuments();
loadNotifications();
