document.addEventListener("DOMContentLoaded", () => {
  const selectedAvatar = document.getElementById("selectedAvatar");
  const avatarGallery = document.getElementById("avatarGallery");
  const refreshAvatars = document.getElementById("refreshAvatars");
  const form = document.getElementById("profileForm");
  const errorMsg = document.getElementById("errorMessage");
  const successMsg = document.getElementById("successMessage");
  const learnSelect = document.getElementById("skillsToLearn");
  const teachSelect = document.getElementById("skillsToTeach");

  const username = JSON.parse(localStorage.getItem("loggedInUser"))?.username || "guest";
  const savedProfile = JSON.parse(localStorage.getItem(`profile_${username}`)) || {};

  // ⭐ Full Skills List (used for matching & validation)
  const allSkills = [
    "Python", "C", "C++", "Java", "HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js",
    "Django", "Flask", "SQL", "MongoDB", "PostgreSQL", "AI/ML", "Data Science", "Cybersecurity",
    "Cloud Computing", "AWS", "Azure", "DevOps", "Git & GitHub", "UI/UX Design", "Web Development",
    "Mobile App Development", "IoT", "Blockchain", "Game Development", "Testing", "Networking",
    "System Design", "Embedded Systems", "Software Engineering", "AI Prompting", "Chatbot Development",
    "Photography", "Video Editing", "Music Production", "Singing", "Dancing", "Acting",
    "Content Writing", "Creative Writing", "Public Speaking", "Sketching", "Painting",
    "Illustration", "Filmmaking", "Voice Acting", "3D Modelling", "Animation", "Podcasting",
    "Marketing", "Finance", "Accounting", "Entrepreneurship", "Leadership", "Management",
    "Negotiation", "Event Planning", "Sales", "Digital Marketing", "SEO", "Business Analytics",
    "Project Management", "Customer Service", "Human Resources", "Team Building",
    "Mathematics", "Physics", "Chemistry", "Biology", "Engineering", "Medical Science",
    "Economics", "Psychology", "Sociology", "Political Science", "Geography", "History",
    "Philosophy", "Education", "Teaching", "Research Methodology", "Statistics", "Astronomy",
    "Yoga", "Fitness", "Cooking", "Baking", "Gardening", "Language Learning", "Time Management",
    "Mindfulness", "Coaching", "Volunteering", "Career Guidance", "Meditation",
    "Fashion Design", "Graphic Design", "Crafting", "Photography Editing", "Interior Design",
    "Pet Training", "Culinary Arts", "Architecture", "Robotics"
  ];

  // ⭐ Populate dropdowns
  allSkills.forEach(skill => {
    learnSelect.add(new Option(skill, skill));
    teachSelect.add(new Option(skill, skill));
  });

  // ⭐ Load saved profile data (if any)
  if (savedProfile.avatarUrl) selectedAvatar.src = savedProfile.avatarUrl;
  document.getElementById("bio").value = savedProfile.bio || "";

  (savedProfile.skillsToLearn || []).forEach(skill => {
    [...learnSelect.options].forEach(o => { if (o.value === skill) o.selected = true; });
  });

  (savedProfile.skillsToTeach || []).forEach(skill => {
    [...teachSelect.options].forEach(o => { if (o.value === skill) o.selected = true; });
  });

  // ⭐ Avatar Generator
  const avatarStyles = ["adventurer", "bottts", "big-smile", "fun-emoji", "pixel-art", "avataaars", "open-peeps"];

  function generateAvatars() {
    avatarGallery.innerHTML = "";
    for (let i = 0; i < 6; i++) {
      const style = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
      const seed = Math.random().toString(36).substring(2, 9);
      const url = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;

      const img = document.createElement("img");
      img.src = url;
      img.alt = "Avatar Option";
      img.addEventListener("click", () => {
        document.querySelectorAll(".avatar-gallery img").forEach(a => a.classList.remove("selected-avatar"));
        img.classList.add("selected-avatar");
        selectedAvatar.src = url;
      });

      avatarGallery.appendChild(img);
    }
  }

  refreshAvatars.addEventListener("click", generateAvatars);
  generateAvatars();

  // ⭐ Save Profile Handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const bio = document.getElementById("bio").value.trim();
    const skillsToLearn = Array.from(learnSelect.selectedOptions).map(o => o.value);
    const skillsToTeach = Array.from(teachSelect.selectedOptions).map(o => o.value);

    errorMsg.textContent = "";
    successMsg.textContent = "";

    // ⭐ RULE: Max 3 learning skills
    if (skillsToLearn.length > 3) {
      errorMsg.textContent = "⚠ You can select ONLY up to 3 skills to learn.";
      return;
    }

    // ⭐ Learning cannot be empty
    if (skillsToLearn.length === 0) {
      errorMsg.textContent = "⚠ Please select at least 1 skill to learn.";
      return;
    }

    // ⭐ Teaching cannot be empty
    if (skillsToTeach.length === 0) {
      errorMsg.textContent = "⚠ Please select at least 1 skill you can teach.";
      return;
    }

    // ⭐ Bio must contain at least one real skill keyword
    const skillKeywords = allSkills.map(s => s.toLowerCase());
    const bioValid = skillKeywords.some(kw => bio.toLowerCase().includes(kw));

    if (bio.length < 10) {
      errorMsg.textContent = "⚠ Bio is too short. Please describe your background or skills.";
      return;
    }

    if (!bioValid) {
      errorMsg.textContent = "❌ Bio must mention at least one real skill or education-related word.";
      return;
    }

    // ⭐ SAVE PROFILE
    const profileData = {
      avatarUrl: selectedAvatar.src,
      bio,
      skillsToLearn,
      skillsToTeach
    };

    localStorage.setItem(`profile_${username}`, JSON.stringify(profileData));
    localStorage.setItem(`profileComplete_${username}`, "true");

    successMsg.textContent = "✅ Profile saved successfully! Redirecting to Find Mentors...";

    setTimeout(() => {
      window.location.href = "findmentor.html";  // redirect to new page
    }, 1500);
  });
});
