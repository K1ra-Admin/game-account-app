const BASE_URL = "https://script.google.com/macros/s/AKfycbytkO0ccfauJUFEwQEy7xCwiMsshPv_2bjV2XvbRDd0LK0ckD9309MsEMI3SicJVvG_/exec";

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
    }).then(res => res.json()).then(data => {
      if (data.success) {
        localStorage.setItem("user_id", data.id);
        location.href = "profile.html";
      } else {
        alert("Gagal mendaftar.");
      }
    });
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
      if (data.success) {
        localStorage.setItem("user_id", data.id);
        location.href = "profile.html";
      } else {
        alert("Login gagal!");
      }
    });
  });
}
