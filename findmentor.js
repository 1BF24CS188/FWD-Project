document.addEventListener("DOMContentLoaded", () => {

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  const username = user.username;

  const skillsToLearn =
    JSON.parse(localStorage.getItem(`profile_${username}`))?.skillsToLearn || [];

  // MOCK mentors database with certificates
  const mentors = [
    {
      username: "mentor1",
      name: "Aarav Sharma",
      skill: "Python",
      rating: 4.8,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav",
      bio: "Python developer with 5 years experience.",
      certificates: ["Python Fundamentals", "Advanced Python Programming"]
    },
    {
      username: "mentor2",
      name: "Neha Kapoor",
      skill: "Python",
      rating: 4.5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
      bio: "Backend engineer specializing in Python & APIs.",
      certificates: []
    },
    {
      username: "mentor3",
      name: "Riya Mehta",
      skill: "Singing",
      rating: 4.9,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Riya",
      bio: "Professional singer & vocal coach.",
      certificates: ["Classical Music Level 2"]
    }
  ];

  const container = document.getElementById("skillsContainer");

  function renderMentors() {
    container.innerHTML = "";

    skillsToLearn.forEach(skill => {
      const col = document.createElement("div");
      col.className = "skill-column";

      col.innerHTML = `<h2 class="skill-title">${skill}</h2>`;

      const mentorsList = mentors.filter(m => m.skill === skill);

      if (mentorsList.length === 0) {
        col.innerHTML += `<p>No mentors for this skill.</p>`;
      }

      mentorsList.forEach(mentor => {
        const card = document.createElement("div");
        card.className = "mentor-card";

        card.innerHTML = `
          <img src="${mentor.avatar}" class="mentor-avatar" />
          <div class="mentor-info">
            <h4 class="mentor-name">${mentor.name}</h4>
            <p class="rating">⭐ ${mentor.rating}</p>
          </div>
        `;

        // CLICK → open modal
        card.onclick = () => openModal(mentor);

        col.appendChild(card);
      });

      container.appendChild(col);
    });
  }

  renderMentors();

  // MODAL LOGIC
  const modal = document.getElementById("mentorModal");
  const modalClose = document.getElementById("modalClose");
  const modalName = document.getElementById("modalName");
  const modalBio = document.getElementById("modalBio");
  const modalCertificates = document.getElementById("modalCertificates");
  const modalReqBtn = document.getElementById("modalRequestBtn");

  function openModal(mentor) {
    modalName.textContent = mentor.name;
    modalBio.textContent = mentor.bio;

    // certificates
    if (mentor.certificates.length === 0) {
      modalCertificates.innerHTML = `<p>No certificates available</p>`;
    } else {
      modalCertificates.innerHTML = mentor.certificates
        .map(c => `<p>• <a href="certificates.html">${c}</a></p>`)
        .join("");
    }

    // request button
    let pending =
      JSON.parse(localStorage.getItem(`mentorRequests_${username}`)) || [];

    if (pending.includes(mentor.username)) {
      modalReqBtn.textContent = "Pending Approval";
      modalReqBtn.classList.add("pending");
    } else {
      modalReqBtn.textContent = "Request Mentor";
      modalReqBtn.classList.remove("pending");

      modalReqBtn.onclick = () => {
        pending.push(mentor.username);
        localStorage.setItem(`mentorRequests_${username}`, JSON.stringify(pending));

        modalReqBtn.textContent = "Pending Approval";
        modalReqBtn.classList.add("pending");
      };
    }

    modal.style.display = "block";
  }

  modalClose.onclick = () => (modal.style.display = "none");
  window.onclick = e => {
    if (e.target === modal) modal.style.display = "none";
  };

  // NAV BUTTONS
  document.getElementById("btnDashboard").onclick = () => {
    window.location.href = "dashboard.html";
  };
  document.getElementById("btnLogout").onclick = () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
  };
});
