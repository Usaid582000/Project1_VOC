/* ─── STATE MANAGEMENT ─────────────────────────────────────── */
let currentStep = 1;
const totalSteps = 5;
const selectedSoftSkills = new Set();

/* --- INIT --- */
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
});

function setupEventListeners() {
  // Soft skill tag toggling
  const tags = document.querySelectorAll(".tag-option");
  tags.forEach(tag => {
    tag.addEventListener("click", () => {
      const val = tag.getAttribute("data-value");
      if (selectedSoftSkills.has(val)) {
        selectedSoftSkills.delete(val);
        tag.classList.remove("selected");
      } else {
        selectedSoftSkills.add(val);
        tag.classList.add("selected");
      }
    });
  });

  // Handle Enter key inside text inputs to prevent form submission issues
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        nextStep();
      }
    });
  });
}

/* ─── PAGE NAVIGATION ─────────────────────────────────────── */
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0);

  if (pageId === "form-page") {
    currentStep = 1;
    updateStepVisibility();
  }
}

/* ─── MULTI-STEP FORM FLOW & VALIDATION ───────────────────── */
function updateStepVisibility() {
  // Show active step, hide others
  for (let i = 1; i <= totalSteps; i++) {
    const stepEl = document.getElementById(`step-${i}`);
    if (i === currentStep) {
      stepEl.classList.add("active");
    } else {
      stepEl.classList.remove("active");
    }

    // Update dots
    const dot = document.querySelector(`.step-dot[data-step="${i}"]`);
    if (i < currentStep) {
      dot.className = "step-dot completed";
    } else if (i === currentStep) {
      dot.className = "step-dot active";
    } else {
      dot.className = "step-dot";
    }
  }

  // Update progress bar
  const percent = Math.round((currentStep / totalSteps) * 100);
  document.getElementById("progress-fill").style.width = `${percent}%`;
  document.getElementById("step-label").innerText = `Step ${currentStep} of ${totalSteps}: ${getStepTitle(currentStep)}`;
  document.getElementById("step-percent").innerText = `${percent}%`;

  // Back button visibility
  const prevBtn = document.getElementById("prev-btn");
  if (currentStep === 1) {
    prevBtn.style.visibility = "hidden";
  } else {
    prevBtn.style.visibility = "visible";
  }

  // Next button label
  const nextBtn = document.getElementById("next-btn");
  if (currentStep === totalSteps) {
    nextBtn.innerHTML = `Submit & Analyze <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  } else {
    nextBtn.innerHTML = `Next Step <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  }
}

function getStepTitle(step) {
  switch (step) {
    case 1: return "Personal Info";
    case 2: return "Education";
    case 3: return "Skills & Interests";
    case 4: return "Goals & Preferences";
    case 5: return "Final Details";
    default: return "";
  }
}

function validateCurrentStep() {
  if (currentStep === 1) {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const location = document.getElementById("location").value.trim();
    if (!name) { alert("Please enter your name."); return false; }
    if (!email || !validateEmail(email)) { alert("Please enter a valid email address."); return false; }
    if (!location) { alert("Please enter your preferred location."); return false; }
  } else if (currentStep === 2) {
    const eduLevel = document.getElementById("education-level").value;
    const currentCourse = document.getElementById("current-course").value.trim();
    if (!eduLevel) { alert("Please select your current education level."); return false; }
    if (!currentCourse) { alert("Please enter your current degree or course."); return false; }
  } else if (currentStep === 3) {
    const techSkills = document.getElementById("tech-skills").value.trim();
    const interests = document.getElementById("interests").value.trim();
    if (!techSkills) { alert("Please list some technical skills."); return false; }
    if (!interests) { alert("Please write about your interests."); return false; }
  } else if (currentStep === 4) {
    const careerGoals = document.getElementById("career-goals").value.trim();
    if (!careerGoals) { alert("Please describe your career goals."); return false; }
  } else if (currentStep === 5) {
    const modeSelected = document.querySelector('input[name="study-mode"]:checked');
    const counselSelected = document.querySelector('input[name="counseling"]:checked');
    if (!modeSelected) { alert("Please choose a study mode preference."); return false; }
    if (!counselSelected) { alert("Please choose a counseling interest level."); return false; }
  }
  return true;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    updateStepVisibility();
  }
}

function nextStep() {
  if (!validateCurrentStep()) return;

  if (currentStep < totalSteps) {
    currentStep++;
    updateStepVisibility();
  } else {
    // Submit form -> Run AI analysis page
    runAIAnalysis();
  }
}

/* ─── AI ANALYSIS SIMULATOR ───────────────────────────────── */
function runAIAnalysis() {
  showPage("analysis-page");

  const steps = [
    { id: "astep-1", progress: 12.5 },
    { id: "astep-2", progress: 25 },
    { id: "astep-3", progress: 37.5 },
    { id: "astep-4", progress: 50 },
    { id: "astep-5", progress: 62.5 },
    { id: "astep-6", progress: 75 },
    { id: "astep-7", progress: 87.5 },
    { id: "astep-8", progress: 100 }
  ];

  let currentAnalysisStepIndex = 0;
  const analysisFill = document.getElementById("analysis-fill");

  function processNextStep() {
    if (currentAnalysisStepIndex < steps.length) {
      const step = steps[currentAnalysisStepIndex];
      const stepEl = document.getElementById(step.id);

      // Mark active
      stepEl.classList.add("running");
      stepEl.querySelector(".astep-icon").innerText = "⚙️";
      stepEl.querySelector(".astep-status").innerText = "Analyzing...";

      // Duration: vary from 600ms to 1200ms
      const duration = 600 + Math.random() * 600;

      setTimeout(() => {
        // Mark complete
        stepEl.classList.remove("running");
        stepEl.classList.add("done");
        stepEl.querySelector(".astep-icon").innerText = "✅";
        stepEl.querySelector(".astep-status").innerText = "Completed";

        analysisFill.style.width = `${step.progress}%`;
        currentAnalysisStepIndex++;
        processNextStep();
      }, duration);
    } else {
      // Finished all analysis steps -> Show Report
      setTimeout(() => {
        generateReport();
      }, 500);
    }
  }

  // Clear previous states
  steps.forEach(step => {
    const el = document.getElementById(step.id);
    el.className = "analysis-step";
    el.querySelector(".astep-icon").innerText = "⏳";
    el.querySelector(".astep-status").innerText = "";
  });
  analysisFill.style.width = "0%";

  processNextStep();
}

/* ─── DYNAMIC LOGIC ENGINE (REAL RECOMMENDATIONS) ─────────── */
async function generateReport() {
  // Capture input values
  const student = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim() || "Not provided",
    location: document.getElementById("location").value.trim(),
    eduLevel: document.getElementById("education-level").value,
    currentCourse: document.getElementById("current-course").value.trim(),
    college: document.getElementById("college").value.trim() || "Not specified",
    year: document.getElementById("year").value.trim() || "Not specified",
    experience: document.getElementById("experience").value.trim() || "None",
    techSkills: document.getElementById("tech-skills").value.trim(),
    softSkills: Array.from(selectedSoftSkills),
    interests: document.getElementById("interests").value.trim(),
    careerGoals: document.getElementById("career-goals").value.trim(),
    preferredField: document.getElementById("preferred-field").value || "Technology / IT",
    studyMode: document.querySelector('input[name="study-mode"]:checked').value,
    budget: document.getElementById("budget").value || "₹5–10 lakhs",
    counseling: document.querySelector('input[name="counseling"]:checked').value
  };

  // Build the final prompt (Prompt 7) using the architecture
  const finalPrompt = `
You are a professional report writer. Generate a final career guidance report for the student.

Student Profile:
Name: ${student.name}
Current Education: ${student.eduLevel}
Current Degree/Course: ${student.currentCourse}
College/University: ${student.college}
Year/Semester: ${student.year}
Technical Skills: ${student.techSkills}
Soft Skills: ${student.softSkills.join(", ")}
Interests/Passions: ${student.interests}
Career Goals: ${student.careerGoals}
Preferred Field: ${student.preferredField}
Experience: ${student.experience}
Preferred Location: ${student.location}
Budget for Higher Ed: ${student.budget}
Higher Ed Preference: ${student.studyMode}
Counseling Intent: ${student.counseling}

Generate a concise, student-friendly report following the structure from PROMPT 7, responding in JSON format.
`;

  // Call Gemini API via proxy (you need to set up /api/gemini endpoint that forwards request with your API key)
  let geminiResponse;
  try {
    const apiResult = await fetchGeminiResponse(finalPrompt);
    geminiResponse = JSON.parse(apiResult);
  } catch (e) {
    console.error("Gemini API call failed, falling back to rule-based recommendations", e);
    // Fallback to existing rule-based logic
    const recommendations = getCareerRecommendations(student);
    renderReportFromRecommendations(student, recommendations);
    return;
  }

  // Render report using Gemini JSON response
  renderReportFromGemini(student, geminiResponse);
}

async function fetchGeminiResponse(prompt) {
  // Configuration: primary and fallback model endpoints
  const endpoints = [
    "/api/gemini", // primary endpoint, default model
    "/api/gemini-alt" // fallback endpoint, can be configured to use another Gemini model
  ];

  for (let i = 0; i < endpoints.length; i++) {
    const url = endpoints[i];
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        // If server returns 503 (high demand) try next endpoint
        if (response.status === 503 && i < endpoints.length - 1) {
          console.warn(`Gemini primary endpoint returned 503, retrying with fallback endpoint ${endpoints[i + 1]}`);
          continue; // try next endpoint
        }
        throw new Error(`Gemini request failed: ${response.status}`);
      }

      const data = await response.json();
      // Assuming the proxy returns { result: "..." }
      return data.result;
    } catch (e) {
      // Network or other error – if this is the last endpoint, rethrow
      if (i === endpoints.length - 1) {
        console.error("Gemini request failed on all endpoints", e);
        throw e;
      }
      console.warn(`Error contacting Gemini endpoint ${url}, attempting fallback.`, e);
    }
  }
  // Should never reach here; throw generic error
  throw new Error("All Gemini endpoints failed");
}

/** Render the UI when Gemini provides a full JSON report. */
function renderReportFromGemini(student, data) {
  // Update name banner
  document.querySelector("#report-name-banner strong").innerText = student.name;

  // Build report using data fields. For simplicity, we map the expected sections.
  const reportBody = document.getElementById("report-body");
  reportBody.innerHTML = `
    <!-- Section 1: Your Career Profile -->
    <div class="report-section">
      <div class="report-section-header"><h2 class="report-section-title">1. Your Career Profile</h2></div>
      <div class="skills-eval-grid">
        <div class="skills-eval-card"><h3>Technical Skills</h3><div class="eval-tags">${student.techSkills.split(",").map(s => `<span class="eval-tag">${s.trim()}</span>`).join("")}</div></div>
        <div class="skills-eval-card"><h3>Soft Skills</h3><div class="eval-tags">${student.softSkills.length > 0 ? student.softSkills.map(s => `<span class="eval-tag strength">${s}</span>`).join("") : `<span class="eval-tag">Problem Solving</span><span class="eval-tag">Communication</span>`}</div></div>
      </div>
      <div class="aptitude-analysis-block">
        <div class="analysis-point"><h4>Natural Strengths & Aptitude</h4><p>${data.profile_summary || ""}</p></div>
        <div class="analysis-point"><h4>Market Relevance Check</h4><p>${data.market_insight || ""}</p></div>
      </div>
    </div>
    <!-- Section 2: Recommended Career Paths -->
    <div class="report-section"><div class="report-section-header"><h2 class="report-section-title">2. Recommended Career Paths</h2></div>
      <div class="paths-list">
        ${data.career_recommendations.map((c, i) => `
          <div class="path-recommendation-card">
            <div class="path-header"><div class="path-title-wrapper"><div class="path-rank">${i + 1}</div><div class="path-title">${c.career_path}</div></div><span class="path-match">${c.match}% Match</span></div>
            <div class="path-details"><p class="path-reasoning"><strong>Why this suits you:</strong> ${c.why}</p>
              <div class="path-grid-details"><div class="path-column"><h4>Key Job Roles</h4><ul>${c.roles.map(r => `<li>${r}</li>`).join("")}</ul></div>
              <div class="path-column"><h4>Skills to Focus On</h4><ul>${c.skills.map(s => `<li>${s}</li>`).join("")}</ul></div></div>
              <div class="salary-banner"><div class="salary-item"><span>Entry Level Salary</span> <strong>${c.salaryEntry}</strong></div><div class="salary-item"><span>Mid-Level Salary</span> <strong>${c.salaryMid}</strong></div></div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
    <!-- Section 3: Skills Learning Path -->
    <div class="report-section"><div class="report-section-header"><h2 class="report-section-title">3. Skills Learning Path</h2></div>
      <p style="margin-bottom: 24px; color: var(--color-text-muted);">${data.skills_intro || "We have prioritized the top skills you need to build next, complete with learning options."}</p>
      <div class="skills-roadmap-list">
        ${data.skills_roadmap.map((s, i) => `
          <div class="skill-roadmap-card">
            <div class="skill-rm-header"><div class="skill-rm-title">${s.name}</div><div class="skill-rm-rank">${i + 1}</div></div>
            <div class="skill-rm-details"><div>Importance: <strong>${s.importance}</strong></div><div>Estimated Time: <strong>${s.time}</strong></div><div>Resource: <strong>${s.resource}</strong></div><a href="#" class="course-link" onclick="event.preventDefault(); alert('Redirecting to the course platform...');">Start Learning →</a></div>
          </div>
        `).join("")}
      </div>
    </div>
    <!-- Section 4: Educational Pathways -->
    <div class="report-section"><div class="report-section-header"><h2 class="report-section-title">4. Educational Pathways</h2></div>
      <div class="degrees-grid">
        ${data.degrees.map(d => `
          <div class="degree-card">
            <div class="degree-header"><div class="degree-type">${d.type} Pathway</div><div class="degree-name">${d.name}</div></div>
            <div class="degree-info-row"><span>Duration</span><strong>${d.duration}</strong></div>
            <div class="degree-info-row"><span>Approx. Cost</span><strong>${d.cost}</strong></div>
            <div class="degree-info-row"><span>Preferred Mode</span><strong>${student.studyMode} Preferred</strong></div>
            <p class="degree-desc">${d.why}</p>
          </div>
        `).join("")}
      </div>
      <h3 style="font-family: var(--font-heading); font-size: 1.3rem; margin: 40px 0 20px;">Top University Options</h3>
      <div class="uni-list">
        ${data.universities.map(u => `
          <div class="uni-card">
            <div class="uni-name">${u.name}</div>
            <div class="uni-loc">📍 ${u.location}</div>
            <div class="uni-badge-row"><span class="uni-badge">${u.mode}</span><span class="uni-badge">${u.affordability}</span></div>
            <div class="uni-details-list"><div><span>Admissions:</span> <strong>${u.difficulty}</strong></div><div><span>Placement Support:</span> <strong>${u.placement}</strong></div></div>
          </div>
        `).join("")}
      </div>
    </div>
    <!-- Section 5: Action Plan (same as existing static template) -->
    ${document.getElementById("short-term-content").outerHTML}
    ${document.getElementById("long-term-content").outerHTML}
    <!-- Section 6: Lead Qualification Counselor Box -->
    <div class="counselor-box"><div class="counselor-avatar">🧑‍💼</div><div class="counselor-info"><h3>Need help planning? Speak with our Lead Counselor</h3><p>Based on your profile details, you are qualified for a free 1-on-1 counseling session with our higher education specialists. Let us guide you on university admissions, scholarship applications, and career transition support.</p><div class="counselor-meta"><div class="meta-pill">Interest Level: <strong>${student.counseling}</strong></div><div class="meta-pill">Mode: <strong>${student.studyMode} Preferred</strong></div><div class="meta-pill">Lead Quality: <strong>Highly Qualified</strong></div></div></div></div>
  `;

  // Submit lead data
  console.log("Submitting Student Lead details to simulated database...", student);
  saveLeadSimulated(student, data);
  showPage("report-page");
}

/** Fallback rendering using the existing rule-based recommendations. */
function renderReportFromRecommendations(student, recommendations) {
  // Use rule-based recommendations as fallback when API fails
  const reportBody = document.getElementById("report-body");
  document.querySelector("#report-name-banner strong").innerText = student.name;

  // Build report from rule-based recommendations
  reportBody.innerHTML = `
    <div class="report-section">
      <div class="report-section-header"><h2 class="report-section-title">1. Your Career Profile</h2></div>
      <div class="skills-eval-grid">
        <div class="skills-eval-card"><h3>Technical Skills</h3><div class="eval-tags">${student.techSkills.split(",").map(s => `<span class="eval-tag">${s.trim()}</span>`).join("")}</div></div>
        <div class="skills-eval-card"><h3>Soft Skills</h3><div class="eval-tags">${student.softSkills.length > 0 ? student.softSkills.map(s => `<span class="eval-tag strength">${s}</span>`).join("") : `<span class="eval-tag">Problem Solving</span><span class="eval-tag">Communication</span>`}</div></div>
      </div>
    </div>
    <div class="report-section">
      <div class="report-section-header"><h2 class="report-section-title">2. Recommended Career Paths</h2></div>
      <div class="paths-list">
        ${recommendations.careers.map((c, i) => `
          <div class="path-recommendation-card">
            <div class="path-header"><div class="path-rank">${i + 1}</div><div class="path-title">${c.path}</div></div>
            <div class="path-details"><p>${c.description}</p></div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  console.log("Submitting Student Lead details to simulated database...", student);
  saveLeadSimulated(student, recommendations);
  showPage("report-page");
}

/* ─── DECISION LOGIC MATRIX (Rule-based fallback) ─────────── */
function getCareerRecommendations(student) {
  const field = student.preferredField.toLowerCase();

  // Rule-based career recommendations
  let careers = [];
  let skillsRoadmap = [];
  let degrees = [];
  let unis = [];

  // Determine careers based on preferred field
  if (field.includes("tech") || field.includes("it") || field.includes("computer")) {
    careers = [
      { path: "Software Developer", description: "Build applications and systems" },
      { path: "Data Analyst", description: "Work with data and insights" },
      { path: "Cloud Architect", description: "Design cloud infrastructure" }
    ];
    skillsRoadmap = [
      { name: "Python", importance: "High", time: "3 months", resource: "Udemy" },
      { name: "Cloud Computing (AWS/Azure)", importance: "High", time: "2 months", resource: "Coursera" },
      { name: "System Design", importance: "Medium", time: "2 months", resource: "YouTube" }
    ];
    degrees = [
      { name: "B.Tech Computer Science", type: "Bachelor's", duration: "4 years", cost: "₹3-8 lakhs", why: "Comprehensive IT foundation" },
      { name: "M.Tech / MCA", type: "Master's", duration: "2 years", cost: "₹5-10 lakhs", why: "Advanced specialization" }
    ];
    unis = [
      { name: "IIT Delhi", location: "Delhi", mode: "Offline", affordability: "Government", difficulty: "Hard", placement: "Excellent" },
      { name: "BITS Pilani", location: "Pilani", mode: "Offline", affordability: "Private", difficulty: "Hard", placement: "Excellent" }
    ];
  } else if (field.includes("business") || field.includes("management") || field.includes("finance")) {
    careers = [
      { path: "Business Analyst", description: "Analyze business processes" },
      { path: "Financial Analyst", description: "Analyze financial data" },
      { path: "Project Manager", description: "Manage projects and teams" }
    ];
    skillsRoadmap = [
      { name: "Excel & Data Analysis", importance: "High", time: "1 month", resource: "Udemy" },
      { name: "Business Communication", importance: "High", time: "2 months", resource: "LinkedIn Learning" },
      { name: "Financial Modeling", importance: "Medium", time: "3 months", resource: "Coursera" }
    ];
    degrees = [
      { name: "B.Comm / BBA", type: "Bachelor's", duration: "3 years", cost: "₹2-5 lakhs", why: "Business foundation" },
      { name: "MBA / PGDM", type: "Master's", duration: "2 years", cost: "₹8-20 lakhs", why: "Advanced management skills" }
    ];
    unis = [
      { name: "ISB Hyderabad", location: "Hyderabad", mode: "Offline", affordability: "Private", difficulty: "Hard", placement: "Excellent" },
      { name: "XLRI Jamshedpur", location: "Jamshedpur", mode: "Offline", affordability: "Private", difficulty: "Hard", placement: "Excellent" }
    ];
  } else {
    // Default recommendations
    careers = [
      { path: "Domain Specialist", description: "Become an expert in your field" },
      { path: "Consultant", description: "Advise organizations on strategy" },
      { path: "Entrepreneur", description: "Start your own venture" }
    ];
    skillsRoadmap = [
      { name: "Industry Knowledge", importance: "High", time: "6 months", resource: "Self-study" },
      { name: "Communication", importance: "High", time: "3 months", resource: "Workshops" },
      { name: "Leadership", importance: "Medium", time: "6 months", resource: "Courses" }
    ];
    degrees = [
      { name: "Relevant Master's Degree", type: "Master's", duration: "2 years", cost: "₹5-15 lakhs", why: "Specialized knowledge" },
      { name: "Professional Certifications", type: "Certification", duration: "6-12 months", cost: "₹50k-2 lakhs", why: "Industry recognition" }
    ];
    unis = [
      { name: "University of your choice", location: "Your preference", mode: "Online/Offline", affordability: "Varies", difficulty: "Varies", placement: "Varies" }
    ];
  }

  return {
    careers: careers,
    skillsRoadmap: skillsRoadmap,
    degrees: degrees,
    universities: unis
  };
}

/* ─── TAB SWITCHING FOR ACTION PLANS ────────────────────────── */
function switchPlanTab(tabId) {
  document.querySelectorAll(".plan-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".plan-content").forEach(c => c.classList.remove("active"));

  if (tabId === "short-term") {
    document.querySelectorAll(".plan-tab")[0].classList.add("active");
    document.getElementById("short-term-content").classList.add("active");
  } else {
    document.querySelectorAll(".plan-tab")[1].classList.add("active");
    document.getElementById("long-term-content").classList.add("active");
  }
}

/* ─── RESET FORM ───────────────────────────────────────────── */
function startOver() {
  // Clear inputs
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("location").value = "";
  document.getElementById("education-level").value = "";
  document.getElementById("current-course").value = "";
  document.getElementById("college").value = "";
  document.getElementById("year").value = "";
  document.getElementById("experience").value = "";
  document.getElementById("tech-skills").value = "";
  document.getElementById("interests").value = "";
  document.getElementById("career-goals").value = "";
  document.getElementById("preferred-field").value = "";

  // Clear tags
  selectedSoftSkills.clear();
  document.querySelectorAll(".tag-option").forEach(t => t.classList.remove("selected"));

  // Reset radios
  document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);

  showPage("landing-page");
}

/* ─── SIMULATED GOOGLE SHEETS API LEAD CAPTURE ────────────── */
function saveLeadSimulated(student, recommendations) {
  const payload = {
    timestamp: new Date().toISOString(),
    name: student.name,
    email: student.email,
    phone: student.phone,
    location: student.location,
    educationLevel: student.eduLevel,
    degreeCourse: student.currentCourse,
    counselingIntent: student.counseling,
    recommendedPath: recommendations.careers?.[0]?.path || "General Recommendation",
    leadType: student.counseling === "Yes" ? "Counseling Interested" : "Degree Explorer",
    urgency: "Short-term (within 6 months)"
  };

  // Log this payload representing successful integration and storage
  console.log("SUCCESSFULLY SENT TO SIMULATED GOOGLE SHEETS CONNECTOR:", payload);
}
