document.addEventListener("DOMContentLoaded", () => {

  const contactInput = document.getElementById("contact");
  const sendCodeBtn = document.getElementById("sendCodeBtn");
  const verificationInput = document.getElementById("verificationCode");
  const verifyBtn = document.getElementById("verifyBtn");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const toggleNewPassword = document.getElementById("toggleNewPassword");
  const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");
  const form = document.getElementById("passwordForm");
  const errorMsg = document.getElementById("errorMessage");

  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const step3 = document.getElementById("step3");

  let generatedCode = null;
  let currentUser = null;

  // Validators
  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidMobile = m => /^[6-9]\d{9}$/.test(m);
  const isStrongPassword = p => /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/.test(p);

  const showError = msg => {
    errorMsg.style.color = "#e02b2b";
    errorMsg.textContent = msg;
    errorMsg.classList.add("shake");
    setTimeout(() => errorMsg.classList.remove("shake"), 500);
  };

  /* STEP 1: SEND CODE */
  sendCodeBtn.addEventListener("click", () => {
    const contact = contactInput.value.trim();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!contact) return showError("Please enter your registered email or mobile.");
    if (!isValidEmail(contact) && !isValidMobile(contact))
      return showError("Invalid email or mobile number.");

    currentUser = users.find(
      u => u.email?.toLowerCase() === contact.toLowerCase() || u.mobile === contact
    );

    if (!currentUser) return showError("No user found with these details.");

    generatedCode = "123456"; // mock OTP

    errorMsg.style.color = "#2ecc71";
    errorMsg.textContent = "Verification code sent successfully.";

    step1.style.display = "none";
    step2.style.display = "block";
  });

  /* STEP 2: VERIFY CODE */
  verifyBtn.addEventListener("click", () => {
    const code = verificationInput.value.trim();

    if (!code) return showError("Please enter the verification code.");
    if (code !== generatedCode) return showError("Incorrect verification code.");

    errorMsg.style.color = "#2ecc71";
    errorMsg.textContent = "Verification successful.";

    step2.style.display = "none";
    step3.style.display = "block";
  });

  /* STEP 3: RESET PASSWORD */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const pass = newPasswordInput.value.trim();
    const confirm = confirmPasswordInput.value.trim();

    if (!pass || !confirm)
      return showError("Please enter both password fields.");

    if (!isStrongPassword(pass))
      return showError("Password must have uppercase, lowercase, number & 6+ chars.");

    if (pass !== confirm)
      return showError("Passwords do not match.");

    // Update user’s password
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const updatedUsers = users.map(u =>
      u.email === currentUser.email || u.mobile === currentUser.mobile
        ? { ...u, password: pass }
        : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    errorMsg.style.color = "#2ecc71";
    errorMsg.textContent = "Password reset successful. Redirecting...";

    setTimeout(() => window.location.href = "login.html", 1500);
  });

});
