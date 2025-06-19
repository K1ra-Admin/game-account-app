const BASE_URL = "https://script.google.com/macros/s/AKfycbxUZVr6G9yHiQdJ2AIfk71U-zC8EXhHMfnmvh3DcS_HsAYkoIzCIk5kd4lq_Pp9t354/exec";

if (document.getElementById("registerForm")) {
  registerForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "register",
        email: email.value,
        password: password.value
      }),
    }).then(res => res.text()).then(alert).then(() => location.href = "index.html");
  });
}

if (document.getElementById("loginForm")) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "login",
        email: email.value,
        password: password.value
      }),
    }).then(res => res.json()).then(data => {
      if (data.status === "success") {
        localStorage.setItem("user_id", data.id);
        location.href = "profile.html";
      } else {
        alert("Login gagal!");
      }
    });
  });
}

if (document.getElementById("profile-info")) {
  const id = localStorage.getItem("user_id");
  fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify({ action: "get_profile", id })
  }).then(res => res.json()).then(data => {
    profileInfo.innerHTML = `
      <p><strong>ID:</strong> ${data.id}</p>
      <p><strong>Email:</strong> ${data.email}</p>
    `;
    document.getElementById("toHistory").href = "history.html?id=" + data.id;
  });

  updateForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "update_profile",
        id: localStorage.getItem("user_id"),
        username: username.value,
        leader: leader.value
      })
    }).then(res => res.text()).then(alert);
  });
}

if (document.getElementById("singleAccountForm")) {
  singleAccountForm.addEventListener("submit", e => {
    e.preventDefault();
    fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "submit_account",
        id: localStorage.getItem("user_id"),
        email: accountEmail.value,
        password: accountPassword.value
      })
    }).then(res => res.text()).then(alert);
  });
}

if (document.getElementById("history-container")) {
  const id = new URLSearchParams(location.search).get("id");
  fetch(`${BASE_URL}?action=get_history&id=${id}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("history-container");
      container.innerHTML = "";
      if (data.length === 0) {
        container.innerHTML = "<p>Belum ada data akun.</p>";
        return;
      }
      data.forEach(item => {
        const statusIcon = item.status === "✅" ? "✔️" : item.status === "❌" ? "❌" : "⏳";
        const div = document.createElement("div");
        div.innerHTML = `<p><strong>Email:</strong> ${item.email}</p><p><strong>Status:</strong> ${statusIcon}</p><hr/>`;
        container.appendChild(div);
      });
    }).catch(() => {
      document.getElementById("history-container").innerHTML = "<p>Gagal memuat data.</p>";
    });
}
