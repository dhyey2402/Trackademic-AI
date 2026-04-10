// DOM Elements
const branchSelect = document.getElementById('branch-select');
const focusSelect = document.getElementById('focus-select');
const generateBtn = document.getElementById('generate-btn');
const heroPage = document.getElementById('hero-page');
const curriculumPage = document.getElementById('curriculum-page');
const curriculumContent = document.getElementById('curriculum-content');
const yearTabs = document.getElementById('year-tabs');
const backBtn = document.getElementById('back-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingStep = document.getElementById('loading-step');
const loadingBar = document.getElementById('loading-bar');
const loadingSteps = document.getElementById('loading-steps');

let currentCurriculum = null;
let currentYearIdx = 0;

// Initialize
function init() {
  setupEventListeners();
}


function setupEventListeners() {
  branchSelect.addEventListener('change', (e) => {
    const branch = e.target.value;
    focusSelect.innerHTML = '<option value="">-- Select Focus Area --</option>';
    
    if (branch && BRANCH_OPTS[branch]) {
      focusSelect.disabled = false;
      BRANCH_OPTS[branch].forEach(focus => {
        const option = document.createElement('option');
        option.value = focus;
        option.textContent = focus;
        focusSelect.appendChild(option);
      });
    } else {
      focusSelect.disabled = true;
    }
    validateForm();
  });

  focusSelect.addEventListener('change', validateForm);

  generateBtn.addEventListener('click', handleGenerate);
  
  backBtn.addEventListener('click', () => {
    curriculumPage.classList.remove('active');
    heroPage.classList.add('active');
  });

  yearTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('year-tab')) {
      document.querySelectorAll('.year-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      currentYearIdx = parseInt(e.target.dataset.year);
      renderYear(currentYearIdx);
    }
  });

  document.getElementById('print-btn').addEventListener('click', () => window.print());
}

function validateForm() {
  generateBtn.disabled = !branchSelect.value || !focusSelect.value;
}

async function handleGenerate() {
  const branch = branchSelect.value;
  const focus = focusSelect.value;

  loadingOverlay.classList.remove('hidden');
  loadingSteps.innerHTML = '';
  
  const steps = [
    "Simulating Multi-Agent Pipeline...",
    "Curriculum Planner generating structure...",
    "Subject Generator populating semesters...",
    "Intelligence Analyzer mapping skills...",
    "Finalizing Industry Standards..."
  ];

  for (let i = 0; i < steps.length; i++) {
    loadingStep.textContent = steps[i];
    loadingBar.style.width = `${(i + 1) * 20}%`;
    const stepEl = document.createElement('div');
    stepEl.className = 'step-item active';
    stepEl.innerHTML = `<span>⚡</span> ${steps[i]}`;
    loadingSteps.appendChild(stepEl);
    
    await new Promise(r => setTimeout(r, 600));
    stepEl.classList.remove('active');
    stepEl.classList.add('done');
    stepEl.querySelector('span').innerHTML = '✅';
  }

  const architect = new CurriculumArchitect(branch, focus);
  currentCurriculum = architect.generate();

  await new Promise(r => setTimeout(r, 400));
  
  loadingOverlay.classList.add('hidden');
  renderCurriculum();
}

function renderCurriculum() {
  heroPage.classList.remove('active');
  curriculumPage.classList.add('active');
  
  document.getElementById('curr-program-title').textContent = `B.Tech in ${currentCurriculum.program}`;
  document.getElementById('curr-focus-subtitle').textContent = `Specialization: ${currentCurriculum.focus}`;
  
  currentYearIdx = 0;
  yearTabs.querySelector('[data-year="0"]').click();
}

function renderYear(yearIdx) {
  const yearData = currentCurriculum.years[yearIdx];
  curriculumContent.innerHTML = '';

  yearData.semesters.forEach(sem => {
    const semSection = document.createElement('div');
    semSection.className = 'semester-section';
    
    const title = document.createElement('h2');
    title.className = 'semester-title';
    title.textContent = `Semester ${sem.semester}`;
    semSection.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'subject-grid';

    sem.subjects.forEach(subject => {
      const card = document.createElement('div');
      card.className = 'subject-card';
      
      card.innerHTML = `
        <div class="subject-name">${subject.name}</div>
        <div class="subject-desc">${subject.description}</div>
        <div class="subject-meta">
          ${subject.skills_gained.slice(0, 3).map(s => `<span class="meta-tag">${s}</span>`).join('')}
        </div>
        
        <div class="intelligence-overlay">
          <div class="intel-block">
             <span class="intel-label">PURPOSE</span>
             <p class="intel-text">${subject.purpose}</p>
          </div>
        </div>

        <div class="modules-container">
          ${subject.modules.map(m => `
            <div class="module-item">
              <div class="module-header">${m.module_name}</div>
              <div class="module-desc">${m.description || ''}</div>
              <div class="module-topics">
                ${m.topics.map(t => `<span class="topic-chip">${t}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `;
      grid.appendChild(card);
    });

    semSection.appendChild(grid);
    curriculumContent.appendChild(semSection);
  });
}

function exportJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentCurriculum, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", `curriculum_${currentCurriculum.program.replace(/ /g, '_')}.json`);
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

init();
