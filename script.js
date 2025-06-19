const BASE_URL = "https://script.google.com/macros/s/AKfycbxUZVr6G9yHiQdJ2AIfk71U-zC8EXhHMfnmvh3DcS_HsAYkoIzCIk5kd4lq_Pp9t354/exec";

// REGISTER
if (document.getElementById("registerForm")) {
  document.getElementById("registerForm").addEventListener("submit", e => {
    e.preventDefault();
    fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "register",
        email: email.value,
        password: password.value
      }),
    }).then(res => res.text()).then(result => {
      alert(result);
      window.location.href = "index.html";
    });
  });
}

// LOGIN
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", e => {
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
        window.location.href = "profile.html";
      } else {
        alert("Login gagal!");
      }
    });
  });
}

// PROFILE
if (document.getElementById("profile-info")) {
  const userId = localStorage.getItem("user_id");
  fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "get_profile",
      id: userId
    }),
  }).then(res => res.json()).then(data => {
    document.getElementById("profile-info").innerHTML = `
      <p><strong>ID:</strong> ${data.id}</p>
      <p><strong>Email:</strong> ${data.email}</p>
    `;
    document.getElementById("toHistory").href = "history.html?id=" + data.id;
  });

  document.getElementById("updateForm").addEventListener("submit", e => {
    e.preventDefault();
    fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "update_profile",
        id: localStorage.getItem("user_id"),
        username: username.value,
        leader: leader.value
      }),
    }).then(res => res.text()).then(alert);
  });
}

// ACCOUNT SUBMIT
if (document.getElementById("singleAccountForm")) {
  document.getElementById("singleAccountForm").addEventListener("submit", e => {
    e.preventDefault();
    fetch(BASE_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "submit_account",
        id: localStorage.getItem("user_id"),
        email: accountEmail.value,
        password: accountPassword.value
      }),
    }).then(res => res.text()).then(result => {
      alert(result);
      accountEmail.value = "";
      accountPassword.value = "";
    });
  });
}

// HISTORY
if (document.getElementById("history-container")) {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");

  fetch(`${BASE_URL}?action=get_history&id=${userId}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("history-container");
      container.innerHTML = "";

      if (data.length === 0) {
        container.innerHTML = "<p>Belum ada data akun.</p>";
        return;
      }

      data.forEach(item => {
        const statusIcon = item.status === "✅" ? "✔️"
                          : item.status === "❌" ? "❌"
                          : "⏳";

        const div = document.createElement("div");
        div.innerHTML = `
          <p><strong>Email:</strong> ${item.email}</p>
          <p><strong>Status:</strong> ${statusIcon} (${item.status})</p>
          <hr/>
        `;
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error(err);
      document.getElementById("history-container").innerHTML = "<p>Gagal memuat data.</p>";
    });
}
