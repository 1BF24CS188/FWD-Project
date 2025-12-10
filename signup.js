document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("signupForm");

  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const mobileInput = document.getElementById("mobile");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  const togglePassword = document.getElementById("togglePassword");
  const toggleConfirm = document.getElementById("toggleConfirm");

  const errorMsg = document.getElementById("errorMessage");

  // Show / hide password
  togglePassword.addEventListener("click", () => {
    const hidden = passwordInput.type === "password";
    passwordInput.type = hidden ? "text" : "password";
    togglePassword.textContent = hidden ? "🙈" : "👁";
  });

  toggleConfirm.addEventListener("click", () => {
    const hidden = confirmPasswordInput.type === "password";
    confirmPasswordInput.type = hidden ? "text" : "password";
    toggleConfirm.textContent = hidden ? "🙈" : "👁";
  });

  // Validators
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidMobile = m => /^[6-9]\d{9}$/.test(m);
  const isStrongPassword = p => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/.test(p);

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.add("shake");
    setTimeout(() => errorMsg.classList.remove("shake"), 500);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorMsg.style.color = "#e02b2b";
    errorMsg.textContent = "";

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const mobile = mobileInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    // Empty fields
    if (!username || !email || !mobile || !password || !confirmPassword) {
      showError("⚠️ Please fill in all fields.");
      return;
    }

    if (username.length < 3) {
      showError(" Username must be at least 3 characters.");
      return;
    }

    if (!isValidEmail(email)) {
      showError(" Invalid email format!");
      return;
    }

    if (!isValidMobile(mobile)) {
      showError(" Invalid mobile number!");
      return;
    }

    if (!isStrongPassword(password)) {
      showError(" Weak password! Must contain upper, lower & number.");
      return;
    }

    if (password !== confirmPassword) {
      showError(" Passwords do not match!");
      return;
    }

    // Check duplicates
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const exists = users.some(u =>
      u.username.toLowerCase() === username.toLowerCase() ||
      u.email.toLowerCase() === email.toLowerCase() ||
      u.mobile === mobile
    );

    if (exists) {
      showError(" User already exists! Try logging in.");
      return;
    }

    // Add new user
    const newUser = { username, email, mobile, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Success
    errorMsg.style.color = "#2ecc71";
    errorMsg.textContent = "✔ Signup successful! Redirecting...";

    setTimeout(() => window.location.href = "login.html", 1200);
  });

});
