document.addEventListener("DOMContentLoaded", () => {
  // Clear session data only, keep user profile info
  localStorage.removeItem("loggedInUser");

  // Optional: also mark user as logged out
  localStorage.setItem("isLoggedOut", "true");

  // Redirect to home page after 3 seconds
  setTimeout(() => {
    window.location.href = "home.html";
  }, 3000);
});
