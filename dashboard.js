document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  const username = user.username;

  // Redirect if mentor selection not done
  const mentorSelectionDone = localStorage.getItem(`mentorSelection_${username}`);
  if (!mentorSelectionDone) {
    window.location.href = "findmentor.html";
    return;
  }

  // DOM refs
  const quoteHeader = document.getElementById("quoteHeader");
  const statSkillsLearn = document.getElementById("statSkillsLearn");
  const statSkillsTeach = document.getElementById("statSkillsTeach");
  const statCompleted = document.getElementById("statCompleted");

  const completedCoursesList = document.getElementById("completedCoursesList");
  const badgeCountEl = document.getElementById("badgeCount");
  const leaderboardText = document.getElementById("leaderboardText");

  const notifBubble = document.getElementById("notifBubble");

  const profileBtn = document.getElementById("profileBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  const qaFindMentor = document.getElementById("qaFindMentor");
  const qaMyMentors = document.getElementById("qaMyMentors");
  const qaMyStudents = document.getElementById("qaMyStudents");
  const qaCertificates = document.getElementById("qaCertificates");
  const qaNotifications = document.getElementById("qaNotifications");

  // Quotes
  const quotes = [
    "Learning never exhausts the mind. — Leonardo da Vinci",
    "Consistency is the key to success. — Aristotle",
    "Every expert was once a beginner. — Helen Hayes",
    "Teach to learn twice. — Joseph Joubert",
    "The future belongs to those who learn more skills. — Robert Greene",
    "An investment in knowledge pays the best interest. — Benjamin Franklin",
    "Curiosity is the wick in the candle of learning. — William Arthur Ward"
  ];
  quoteHeader.textContent = quotes[new Date().getDate() % quotes.length];

  // Load profile
  const profile = JSON.parse(localStorage.getItem(`profile_${username}`)) || {};
  const skillsToLearn = profile.skillsToLearn || [];
  const skillsToTeach = profile.skillsToTeach || [];

  statSkillsLearn.textContent = skillsToLearn.length;
  statSkillsTeach.textContent = skillsToTeach.length;

  // Completed Courses
  function loadCompleted() {
    const progress = JSON.parse(localStorage.getItem(`progress_${username}`)) || [];
    const completed = progress.filter(p => Number(p.pct) === 100);

    statCompleted.textContent = completed.length;

    completedCoursesList.innerHTML = completed.length
      ? ""
      : "<li>No courses completed yet 🚀</li>";

    completed.forEach(c => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="course-name">${c.course}</span>
        <span class="course-date">${new Date(c.updated).toLocaleString()}</span>
      `;
      completedCoursesList.appendChild(li);
    });

    return completed.length;
  }

  const completedCount = loadCompleted();

  // Badges: 1 badge per completed course
  badgeCountEl.textContent = completedCount;

  // Leaderboard
  const rankKey = `rank_${username}`;
  let rank = localStorage.getItem(rankKey);
  if (!rank) {
    rank = Math.floor(Math.random() * 100) + 1;
    localStorage.setItem(rankKey, rank);
  }
  leaderboardText.textContent = `You are currently at position #${rank} on the SkillFusion leaderboard. 🎯`;

  // Notifications
  function loadNotifs() {
    const arr = JSON.parse(localStorage.getItem(`notifications_${username}`)) || [];
    const unread = arr.filter(n => !n.read).length;
    if (unread > 0) {
      notifBubble.style.display = "flex";
      notifBubble.textContent = unread > 9 ? "9+" : unread;
    } else {
      notifBubble.style.display = "none";
    }
  }
  loadNotifs();

  // Navigation
  profileBtn.onclick = () => window.location.href = "profile.html";
  logoutBtn.onclick = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  };

  // FIND MENTOR linked correctly
  qaFindMentor.onclick = () => window.location.href = "findmentor.html";

  qaMyMentors.onclick = () => window.location.href = "mymentor.html";
  qaMyStudents.onclick = () => window.location.href = "mystudent.html";
  qaCertificates.onclick = () => window.location.href = "certificates.html";
  // 🔔 Bell icon navigation
document.getElementById("notifBtn").onclick = () => {
  window.location.href = "notifications.html";
};
});