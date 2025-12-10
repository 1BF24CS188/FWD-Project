document.addEventListener("DOMContentLoaded", () => {
  const username = JSON.parse(localStorage.getItem("loggedInUser"))?.username;

  const mentorData = JSON.parse(localStorage.getItem("earlyEndData"));
  if (!mentorData) {
    alert("No mentor selected.");
    window.location.href = "mymentor.html";
    return;
  }

  document.getElementById("mentorName").value = mentorData.mentor;
  document.getElementById("skill").value = mentorData.skill;

  document.getElementById("endForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const reason = document.getElementById("reason").value.trim();
    if (!reason) return;

    const feedbackKey = `earlyEndFeedback_${username}`;
    const existing = JSON.parse(localStorage.getItem(feedbackKey)) || [];

    existing.push({
      mentor: mentorData.mentor,
      skill: mentorData.skill,
      reason,
      timestamp: new Date().toISOString()
    });

    localStorage.setItem(feedbackKey, JSON.stringify(existing));

    // Clear temporary data
    localStorage.removeItem("earlyEndData");

    alert("Feedback submitted successfully.");

    window.location.href = "mymentor.html";
  });
});
