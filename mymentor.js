document.addEventListener("DOMContentLoaded", () => {

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  const username = user.username;

  const coursesRow = document.getElementById("coursesRow");

  // Load user profile
  const profile = JSON.parse(localStorage.getItem(`profile_${username}`)) || {};
  const skills = profile.skillsToLearn || [];

  // Dummy mentors (stored in localStorage)
  const mentorsList =
    JSON.parse(localStorage.getItem("allMentors")) || [
      {
        username: "mentor_py",
        name: "Aarav Sharma",
        skill: "Python",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Aarav"
      },
      {
        username: "mentor_java",
        name: "Meera K",
        skill: "Java",
        avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Meera"
      },
      {
        username: "mentor_css",
        name: "Rohit Singh",
        skill: "CSS",
        avatar: "https://api.dicebear.com/7.x/open-peeps/svg?seed=Rohit"
      }
    ];

  localStorage.setItem("allMentors", JSON.stringify(mentorsList));

  // Load assigned mentors map
  let mentorMap =
    JSON.parse(localStorage.getItem(`selectedMentors_${username}`)) || {};

  // ⭐ AUTO-ASSIGN one mentor per skill if missing
  skills.forEach(skill => {
    const existing = mentorMap[skill];
    if (!existing) {
      const mentor = mentorsList.find(m => m.skill === skill);
      if (mentor) {
        mentorMap[skill] = mentor.username;
      }
    }
  });

  // Save updated mentor map
  localStorage.setItem(
    `selectedMentors_${username}`,
    JSON.stringify(mentorMap)
  );

  // -------- Rendering mentor boxes ----------
  function renderBoxes() {
    coursesRow.innerHTML = "";

    skills.forEach(skill => {
      const assignedUser = mentorMap[skill];
      const mentor = mentorsList.find(m => m.username === assignedUser);

      const col = document.createElement("div");
      col.className = "course-column";

      col.innerHTML = `
        <h3 class="course-title">${skill}</h3>

        <div class="mentor-mini">
          <img class="mentor-avatar"
            src="${mentor ? mentor.avatar : 'default-avatar.png'}" />

          <div>
            <p class="mentor-name">
              ${mentor ? mentor.name : "No Mentor Selected"}
            </p>
          </div>
        </div>

        <div class="course-actions">
          <button class="chat-btn" data-skill="${skill}">
            Chat
          </button>

          <button class="end-btn" data-skill="${skill}">
            End Session
          </button>
        </div>
      `;

      coursesRow.appendChild(col);
    });
  }

  renderBoxes();

  // ---------- CHAT BUTTON ----------
  document.addEventListener("click", e => {
    if (e.target.classList.contains("chat-btn")) {
      const skill = e.target.getAttribute("data-skill");
      localStorage.setItem("chatSkill", skill);
      window.location.href = "chat.html";
    }
  });

  // ---------- END SESSION BUTTON ----------
  document.addEventListener("click", e => {
    if (e.target.classList.contains("end-btn")) {
      const skill = e.target.getAttribute("data-skill");

      const confirmEnd = confirm("Are you sure you want to end this session early?");
      if (!confirmEnd) return;

      // SAVE skill for early end form
      localStorage.setItem("endingSkill", skill);

      // redirect to early end form
      window.location.href = "earlyendform.html";
    }
  });

  // ---------- NAVIGATION ----------
  document.getElementById("dashBtn").onclick = () =>
    (window.location.href = "dashboard.html");

  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  };

});
