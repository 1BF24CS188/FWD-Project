document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const identifierInput = document.getElementById("identifier");
  const errorMsg = document.getElementById("errorMessage");

  // Toggle password visibility
  togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "🙈" : "👁";
  });

  // Validators
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidMobile = m => /^[6-9]\d{9}$/.test(m);

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.add("shake");
    setTimeout(() => errorMsg.classList.remove("shake"), 500);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorMsg.textContent = "";

    const identifier = identifierInput.value.trim();
    const password = passwordInput.value.trim();

    // Empty check
    if (!identifier || !password) {
      showError("⚠️ Please fill in both fields.");
      return;
    }

    // Identifier validation
    if (
      !isValidEmail(identifier) &&
      !isValidMobile(identifier) &&
      identifier.length < 3
    ) {
      showError("❌ Invalid identifier! Use email, mobile, or username.");
      return;
    }

    // Fetch users
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(u =>
      u.username?.toLowerCase() === identifier.toLowerCase() ||
      u.email?.toLowerCase() === identifier.toLowerCase() ||
      u.mobile === identifier
    );

    if (!foundUser) {
      showError("🤔 No matching account found!");
      return;
    }

    if (foundUser.password !== password) {
      showError("❌ Incorrect password! Try again.");
      return;
    }

    // SUCCESS
    errorMsg.style.color = "#2ecc71";
    errorMsg.textContent = "✅ Login successful! Redirecting...";

    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));

    const username = foundUser.username;
    const profileDone =
      localStorage.getItem(`profileComplete_${username}`) === "true";

    setTimeout(() => {
      if (!profileDone) {
        window.location.href = "profile.html";
      } else {
        window.location.href = "dashboard.html";
      }
    }, 900);
  });

});
