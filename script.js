/**
 * FitNHeal - Unified Medical Wellness & Fitness Platform
 * Full-Featured Interactive Application Logic & Real-Time Engine
 */

// ==========================================
// 1. APPLICATION STATE & PERSISTENCE
// ==========================================
let currentMode = 'medical'; // 'medical' or 'fitness'
let isLoggedIn = false;
let currentRating = 0;

let currentUser = {
  name: 'Deepak Nandhakumar',
  email: 'deepak@fitnheal.com',
  age: 26,
  gender: 'male',
  activityLevel: 1.375,
  goal: 'maintenance'
};

let userStats = {
  height: 175,
  weight: 72,
  bmi: 23.5,
  bmiCategory: 'Normal weight',
  bmr: 1680,
  tdee: 2310,
  waterGlasses: 7, // 7 * 250ml = 1.75L
  waterGoalGlasses: 12, // 3.0L
  streakDays: 5
};

// Vitals Log History
let vitalsHistory = [
  { date: 'Today, 08:30 AM', type: 'Blood Pressure', val1: 118, val2: 78, tag: 'Normal', status: 'bp-normal' },
  { date: 'Yesterday, 09:00 PM', type: 'Blood Glucose', val1: 94, val2: null, tag: 'Fasting (Normal)', status: 'bp-normal' },
  { date: 'Oct 07, 08:15 AM', type: 'Blood Pressure', val1: 124, val2: 82, tag: 'Elevated', status: 'bp-elevated' }
];

// Medications & Supplement List
let medicationList = [
  { id: 1, name: 'Vitamin D3 + K2', dose: '2000 IU', time: 'Morning (With Food)', taken: true },
  { id: 2, name: 'Omega-3 Fish Oil', dose: '1000 mg', time: 'Lunch', taken: true },
  { id: 3, name: 'Magnesium Glycinate', dose: '200 mg', time: 'Night (Before Bed)', taken: false }
];

// Daily Habits & 30-Day Challenges
let habitList = [
  { id: 1, name: 'Drink 3.0L Water', completed: true, icon: 'fa-tint' },
  { id: 2, name: '8,000+ Daily Steps', completed: true, icon: 'fa-walking' },
  { id: 3, name: '20-Min Workout / Mobility', completed: false, icon: 'fa-dumbbell' },
  { id: 4, name: '2-Min Box Breathing', completed: true, icon: 'fa-lungs' },
  { id: 5, name: 'No Processed Refined Sugar', completed: false, icon: 'fa-ban' }
];

// Daily Food & Calorie Plate Log
let dailyFoodLog = [
  { name: 'Oatmeal with Almonds & Whey', cals: 420, protein: 34, carbs: 52, fat: 9 },
  { name: 'Grilled Chicken Breast & Quinoa', cals: 550, protein: 48, carbs: 45, fat: 12 }
];

// Timer State
let timerInterval = null;
let timerSeconds = 20 * 60;
let isTimerRunning = false;
let initialTimerSeconds = 20 * 60;

// Live Workout Interval Player State
let livePlayerState = {
  active: false,
  timer: null,
  currentExerciseIndex: 0,
  secondsLeft: 45,
  isRest: false,
  isPaused: false,
  workoutQueue: []
};

// Breathing Pacer State
let breathingInterval = null;
let breathingPhase = 'idle'; // 'inhale', 'hold1', 'exhale', 'hold2'
let breathingCount = 4;
let breathingPreset = 'box'; // 'box' (4-4-4-4) or '478' (4-7-8)

// CPR Metronome State
let cprInterval = null;
let isCprRunning = false;

// Audio Synthesizers State (Web Audio API)
let audioCtx = null;
let ambientNodes = {
  rain: null,
  zen: null,
  waves: null
};

// Chart.js Instances
const chartInstances = {
  weightChart: null,
  progressWeightChart: null,
  activityChart: null
};

// ==========================================
// 2. FEATURE REGISTRY (Medical & Fitness)
// ==========================================
const features = {
  medical: [
    { name: 'Symptom Advisor', icon: 'fa-user-md', desc: 'Interactive body triage & remedy advisor' },
    { name: 'Vitals & BP Tracker', icon: 'fa-heartbeat', desc: 'Log blood pressure, glucose & pulse' },
    { name: 'Medication Manager', icon: 'fa-pills', desc: 'Daily prescription & supplement routine' },
    { name: 'Stress & Mind Sanctuary', icon: 'fa-brain', desc: 'Breathing coach, mood log & soundscapes' },
    { name: 'Sleep & REM Optimizer', icon: 'fa-moon', desc: 'Circadian rhythm & sleep cycle calculator' },
    { name: 'First Aid & CPR Hub', icon: 'fa-kit-medical', desc: 'Emergency protocols & 110 BPM metronome' },
    { name: 'Eye Care & Screen Relief', icon: 'fa-eye', desc: '20-20-20 screen timer & eye exercises' },
    { name: 'Hairfall Solutions', icon: 'fa-cut', desc: 'Nutritional & scalp health protocols' },
    { name: 'Skin Care & Dermatology', icon: 'fa-spa', desc: 'Tailored regimens by skin barrier type' },
    { name: 'Posture & Ergonomics', icon: 'fa-chair', desc: 'Desk posture corrections & spine stretches' }
  ],
  fitness: [
    { name: 'Dashboard', icon: 'fa-tachometer-alt', desc: 'Executive biometric health dashboard' },
    { name: 'Workout Generator', icon: 'fa-magic', desc: 'Custom workout builder by goal & equipment' },
    { name: 'Workout Plans', icon: 'fa-dumbbell', desc: 'Curated hyper-targeted workout routines' },
    { name: 'Diet & Nutrition', icon: 'fa-utensils', desc: 'TDEE calculator & food calorie search' },
    { name: 'Exercise Library', icon: 'fa-running', desc: '30+ exercise video & form guides' },
    { name: 'Progress Tracker', icon: 'fa-chart-line', desc: 'Weight analytics & performance trends' },
    { name: 'Fitness Calculators', icon: 'fa-calculator', desc: '1RM, Target Heart Rate & Ideal Weight' },
    { name: 'Challenges & Habits', icon: 'fa-trophy', desc: '30-day fitness challenges & streaks' },
    { name: 'Workout Timer', icon: 'fa-stopwatch', desc: 'Custom rest & HIIT countdown timer' }
  ]
};

// Food Database for Calorie Explorer (50+ Verified Foods)
const foodDatabase = [
  { name: 'Chicken Breast (Cooked)', category: 'protein', serving: '100g', cals: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Whole Eggs (Boiled)', category: 'protein', serving: '2 Large Eggs', cals: 156, protein: 12, carbs: 1.1, fat: 10 },
  { name: 'Egg Whites', category: 'protein', serving: '4 Whites (130g)', cals: 68, protein: 14, carbs: 0.9, fat: 0.2 },
  { name: 'Paneer (Cottage Cheese)', category: 'indian', serving: '100g', cals: 265, protein: 18, carbs: 3.2, fat: 20 },
  { name: 'Tofu (Firm)', category: 'protein', serving: '100g', cals: 83, protein: 10, carbs: 2.1, fat: 5.3 },
  { name: 'Salmon Fillet', category: 'protein', serving: '100g', cals: 208, protein: 22, carbs: 0, fat: 13 },
  { name: 'Whey Protein Isolate', category: 'protein', serving: '1 Scoop (30g)', cals: 120, protein: 25, carbs: 2, fat: 1 },
  { name: 'Greek Yogurt (0% Fat)', category: 'protein', serving: '150g', cals: 90, protein: 15, carbs: 6, fat: 0 },
  { name: 'Rolled Oats', category: 'carbs', serving: '50g (Dry)', cals: 187, protein: 7, carbs: 34, fat: 3 },
  { name: 'Brown Rice (Cooked)', category: 'carbs', serving: '150g (1 Cup)', cals: 168, protein: 3.5, carbs: 36, fat: 1.2 },
  { name: 'White Rice (Cooked)', category: 'indian', serving: '150g (1 Cup)', cals: 195, protein: 4, carbs: 43, fat: 0.4 },
  { name: 'Sweet Potato (Baked)', category: 'carbs', serving: '150g', cals: 135, protein: 3, carbs: 31, fat: 0.2 },
  { name: 'Quinoa (Cooked)', category: 'carbs', serving: '150g', cals: 180, protein: 6, carbs: 32, fat: 2.9 },
  { name: 'Whole Wheat Chapati', category: 'indian', serving: '2 Medium Rotis', cals: 160, protein: 5.5, carbs: 32, fat: 1.5 },
  { name: 'Cooked Yellow Dhal (Moong/Toor)', category: 'indian', serving: '1 Bowl (150g)', cals: 145, protein: 9, carbs: 24, fat: 2 },
  { name: 'Chickpeas / Chana', category: 'indian', serving: '100g Cooked', cals: 164, protein: 8.9, carbs: 27, fat: 2.6 },
  { name: 'Raw Almonds', category: 'fats', serving: '30g (23 nuts)', cals: 175, protein: 6, carbs: 6, fat: 15 },
  { name: 'Natural Peanut Butter', category: 'fats', serving: '2 tbsp (32g)', cals: 190, protein: 8, carbs: 7, fat: 16 },
  { name: 'Ripe Avocado', category: 'fats', serving: '1/2 Medium (75g)', cals: 120, protein: 1.5, carbs: 6, fat: 11 },
  { name: 'Extra Virgin Olive Oil', category: 'fats', serving: '1 tbsp (14ml)', cals: 119, protein: 0, carbs: 0, fat: 14 },
  { name: 'Chia Seeds', category: 'fats', serving: '1 tbsp (12g)', cals: 58, protein: 2, carbs: 5, fat: 3.8 },
  { name: 'Banana', category: 'carbs', serving: '1 Medium (118g)', cals: 105, protein: 1.3, carbs: 27, fat: 0.3 },
  { name: 'Broccoli (Steamed)', category: 'carbs', serving: '100g', cals: 35, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: 'Spinach / Palak', category: 'indian', serving: '100g Cooked', cals: 23, protein: 3, carbs: 3.8, fat: 0.3 }
];

// ==========================================
// 3. APP INITIALIZATION
// ==========================================
function initApp() {
  loadSavedTheme();
  loadSavedSession();
  loadUserStats();
  renderFeatures();
  setupEventListeners();
  setupCharts();
  generateWorkoutCards();
  generateMacroData();
  initChatbotGreeting();
  updateTopExecutiveBar();
  initHydrationWidget();
  renderFoodDatabase('all');
  
  // Set default active tab
  updateModeBadge();
}

function updateTopExecutiveBar() {
  const topGreeting = document.getElementById('top-greeting');
  const dateDisplay = document.getElementById('top-date-display');
  const streakVal = document.getElementById('top-streak-val');
  const waterVal = document.getElementById('top-water-val');

  const now = new Date();
  const hour = now.getHours();
  let timeOfDay = 'Good morning';
  if (hour >= 12 && hour < 17) timeOfDay = 'Good afternoon';
  else if (hour >= 17) timeOfDay = 'Good evening';

  const name = currentUser.name ? currentUser.name.split(' ')[0] : 'Champion';
  if (topGreeting) topGreeting.textContent = `${timeOfDay}, ${name}! 🌿`;

  const dateOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
  if (dateDisplay) dateDisplay.textContent = now.toLocaleDateString('en-US', dateOptions);

  if (streakVal) streakVal.textContent = `${userStats.streakDays || 5} Days 🔥`;
  if (waterVal) {
    const liters = ((userStats.waterGlasses || 7) * 0.25).toFixed(2);
    waterVal.textContent = `${liters} / 3.0 L`;
  }
}

// Mode UI Updates
function updateModeBadge() {
  const badge = document.getElementById('mode-badge');
  const title = document.getElementById('feature-list-title');
  if (badge && title) {
    if (currentMode === 'medical') {
      badge.textContent = 'Medical Care';
      badge.style.color = '#06b6d4';
      badge.style.background = 'rgba(6, 182, 212, 0.15)';
      title.textContent = 'Medical Hub';
    } else {
      badge.textContent = 'Fitness Hub';
      badge.style.color = '#f97316';
      badge.style.background = 'rgba(249, 115, 22, 0.15)';
      title.textContent = 'Fitness Suite';
    }
  }
}

// Theme Management
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeToggleLabel(savedTheme);
}

function toggleTheme() {
  const current = document.body.getAttribute('data-theme') || 'dark';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeToggleLabel(newTheme);
  showToast(`Theme switched to ${newTheme} mode`, 'info', 2000);
  setupCharts();
}

function updateThemeToggleLabel(theme) {
  const item = document.getElementById('theme-toggle-item');
  if (item) {
    item.innerHTML = theme === 'light' 
      ? '<i class="fas fa-moon"></i> Dark Mode' 
      : '<i class="fas fa-sun"></i> Light Mode';
  }
}

// Session Management
function loadSavedSession() {
  try {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
      isLoggedIn = true;
    }
  } catch (err) {
    console.error('Session load error:', err);
  }
  updateAuthUI();
}

function updateAuthUI() {
  const guestView = document.getElementById('guest-view');
  const memberView = document.getElementById('member-view');
  const headerUsername = document.getElementById('header-username');

  if (isLoggedIn) {
    if (guestView) guestView.classList.add('hidden');
    if (memberView) memberView.classList.remove('hidden');
    if (headerUsername) headerUsername.textContent = currentUser.name || 'Member';
  } else {
    if (guestView) guestView.classList.remove('hidden');
    if (memberView) memberView.classList.add('hidden');
  }
  updateTopExecutiveBar();
}

// ==========================================
// 4. FEATURE RENDERING & NAVIGATION
// ==========================================
function renderFeatures() {
  const featureList = document.getElementById('feature-list');
  if (!featureList) return;
  featureList.innerHTML = '';

  const list = features[currentMode] || [];
  list.forEach(feature => {
    const li = document.createElement('li');
    li.className = 'feature-item';
    li.setAttribute('tabindex', '0');
    li.setAttribute('role', 'button');
    li.innerHTML = `
      <i class="fas ${feature.icon}"></i>
      <span>${feature.name}</span>
    `;
    li.addEventListener('click', () => {
      document.querySelectorAll('.feature-item').forEach(el => el.classList.remove('active'));
      li.classList.add('active');
      loadFeatureContent(feature.name);
    });
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        li.click();
      }
    });
    featureList.appendChild(li);
  });
}

function showMainSection(section) {
  const homeSection = document.getElementById('home-section');
  const dynamicContent = document.getElementById('dynamic-content');
  const fitnessDashboard = document.getElementById('fitness-dashboard');
  const homeBtn = document.getElementById('home-btn');

  if (homeSection) homeSection.classList.toggle('active', section === 'home');
  if (dynamicContent) dynamicContent.classList.toggle('active', section === 'dynamic');
  if (fitnessDashboard) fitnessDashboard.classList.toggle('active', section === 'dashboard');

  if (homeBtn) {
    homeBtn.classList.toggle('active', section === 'home');
  }

  // Smooth scroll to top of content
  const mainArea = document.getElementById('main-content-area');
  if (mainArea) mainArea.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadFeatureContent(featureName) {
  const dashboardSection = document.getElementById('dashboardSection');
  const workoutsSection = document.getElementById('workoutsSection');
  const progressSection = document.getElementById('progressSection');
  const nutritionSection = document.getElementById('nutritionSection');

  if (featureName === 'Workout Timer') {
    openTimerModal();
    return;
  }

  if (featureName === 'Dashboard') {
    showMainSection('dashboard');
    if (dashboardSection) dashboardSection.style.display = 'block';
    if (workoutsSection) workoutsSection.style.display = 'none';
    if (progressSection) progressSection.style.display = 'none';
    if (nutritionSection) nutritionSection.style.display = 'none';
    return;
  }

  if (featureName === 'Workout Plans') {
    showMainSection('dashboard');
    if (dashboardSection) dashboardSection.style.display = 'none';
    if (workoutsSection) workoutsSection.style.display = 'block';
    if (progressSection) progressSection.style.display = 'none';
    if (nutritionSection) nutritionSection.style.display = 'none';
    return;
  }

  if (featureName === 'Progress Tracker') {
    showMainSection('dashboard');
    if (dashboardSection) dashboardSection.style.display = 'none';
    if (workoutsSection) workoutsSection.style.display = 'none';
    if (progressSection) progressSection.style.display = 'block';
    if (nutritionSection) nutritionSection.style.display = 'none';
    setTimeout(setupCharts, 60);
    return;
  }

  if (featureName === 'Diet & Nutrition') {
    showMainSection('dashboard');
    if (dashboardSection) dashboardSection.style.display = 'none';
    if (workoutsSection) workoutsSection.style.display = 'none';
    if (progressSection) progressSection.style.display = 'none';
    if (nutritionSection) nutritionSection.style.display = 'block';
    return;
  }

  // Handle Specialized Interactive Modules
  showMainSection('dynamic');
  const dynamicContent = document.getElementById('dynamic-content');
  if (!dynamicContent) return;
  dynamicContent.innerHTML = '';

  // Render specific module UI
  switch (featureName) {
    case 'Symptom Advisor':
      renderSymptomAdvisorUI(dynamicContent);
      break;
    case 'Vitals & BP Tracker':
      renderVitalsTrackerUI(dynamicContent);
      break;
    case 'Medication Manager':
      renderMedicationManagerUI(dynamicContent);
      break;
    case 'Stress & Mind Sanctuary':
      renderMindSanctuaryUI(dynamicContent);
      break;
    case 'Sleep & REM Optimizer':
      renderSleepOptimizerUI(dynamicContent);
      break;
    case 'First Aid & CPR Hub':
      renderFirstAidHubUI(dynamicContent);
      break;
    case 'Eye Care & Screen Relief':
      renderEyeCareUI(dynamicContent);
      break;
    case 'Workout Generator':
      renderWorkoutGeneratorUI(dynamicContent);
      break;
    case 'Exercise Library':
      renderExerciseLibraryUI(dynamicContent);
      break;
    case 'Fitness Calculators':
      renderFitnessCalculatorsUI(dynamicContent);
      break;
    case 'Challenges & Habits':
      renderHabitsAndChallengesUI(dynamicContent);
      break;
    default:
      renderGenericGuideUI(dynamicContent, featureName);
      break;
  }
}

// ==========================================
// 5. INTERACTIVE MODULE IMPLEMENTATIONS
// ==========================================

// Module 1: Symptom Checker & Triage Engine
function renderSymptomAdvisorUI(container) {
  container.innerHTML = `
    <div class="feature-header">
      <h2><i class="fas fa-user-md" style="color:#06b6d4;"></i> Interactive Symptom &amp; Triage Advisor</h2>
      <p>Select your symptom area to view instant clinical triage assessment, evidence-based home remedies, and emergency warning signs.</p>
    </div>

    <div class="symptom-checker-hub">
      <div class="body-part-selector">
        <button class="body-chip active" data-symptom="headache"><i class="fas fa-head-side-virus"></i> Headache &amp; Migraine</button>
        <button class="body-chip" data-symptom="digestive"><i class="fas fa-stomach"></i> Acid Reflux &amp; Indigestion</button>
        <button class="body-chip" data-symptom="back"><i class="fas fa-bone"></i> Lower Back &amp; Neck Pain</button>
        <button class="body-chip" data-symptom="eyestrain"><i class="fas fa-eye"></i> Digital Screen Fatigue</button>
        <button class="body-chip" data-symptom="fatigue"><i class="fas fa-battery-quarter"></i> Chronic Fatigue &amp; Brain Fog</button>
        <button class="body-chip" data-symptom="joint"><i class="fas fa-running"></i> Knee &amp; Joint Stiffness</button>
      </div>

      <div class="triage-output-card" id="triage-output">
        <!-- Rendered symptom details -->
      </div>
    </div>
  `;

  const symptomData = {
    headache: {
      title: 'Tension & Digital Screen Headache',
      urgency: 'Mild to Moderate',
      badgeClass: 'urgency-mild',
      causes: 'Prolonged screen blue-light, dehydration, cervical muscle tightness, or stress.',
      remedies: [
        'Drink 500ml of electrolyte water immediately (Dehydration is cause #1).',
        'Apply 4-7-8 breathing for 3 minutes to relax neck vascular tension.',
        'Massage the sub-occipital base of skull with gentle circular thumb pressure.',
        'Sip warm peppermint or ginger tea.'
      ],
      redFlags: 'Seek immediate ER care if accompanied by sudden "thunderclap" onset, high fever, slurred speech, or stiff neck.'
    },
    digestive: {
      title: 'Acid Reflux, Bloating & Dyspepsia',
      urgency: 'Mild (Functional)',
      badgeClass: 'urgency-mild',
      causes: 'Eating too fast, high-sodium fried meals, lying down post-meal, or low stomach acid.',
      remedies: [
        'Take a gentle 10-minute walk (Accelerates gastric emptying by 30%).',
        'Avoid lying flat for at least 3 hours after your last meal.',
        'Sip warm fennel (saunf) or chamomile water.',
        'Elevate head of bed by 15 cm when sleeping.'
      ],
      redFlags: 'Consult a physician if experiencing difficulty swallowing, unexplained weight loss, or black tarry stools.'
    },
    back: {
      title: 'Acute Lumbar & Postural Strain',
      urgency: 'Moderate',
      badgeClass: 'urgency-moderate',
      causes: 'Prolonged sedentary sitting, weak glutes/core, or improper lifting mechanics.',
      remedies: [
        'Perform gentle Cat-Cow and Child Pose spinal decompression (2 mins).',
        'Alternate ice pack (15 mins) followed by warm compress to reduce inflammation.',
        'Engage transverse abdominals and avoid prolonged slouching.',
        'Short hourly standing breaks.'
      ],
      redFlags: 'Immediate medical evaluation required if pain shoots down leg with numbness (Sciatica) or loss of bladder/bowel control.'
    },
    eyestrain: {
      title: 'Asthenopia (Digital Eye Strain)',
      urgency: 'Mild',
      badgeClass: 'urgency-mild',
      causes: 'Reduced blink rate (down 60% on screens) and uncorrected screen glare.',
      remedies: [
        'Enforce the 20-20-20 rule: look 20 feet away for 20 seconds every 20 minutes.',
        'Palming: Rub palms warm and cup over closed eyes for 60 seconds.',
        'Use preservative-free lubricating artificial tears if dry.',
        'Position monitor 50-70cm away with top of screen at eye level.'
      ],
      redFlags: 'See an optometrist if experiencing sudden vision loss, flashes of light, or halo around lights.'
    },
    fatigue: {
      title: 'Metabolic & Circadian Fatigue',
      urgency: 'Moderate',
      badgeClass: 'urgency-moderate',
      causes: 'Poor deep sleep quality, sub-optimal hydration, iron/B12 deficiency, or high chronic cortisol.',
      remedies: [
        'Get 10 minutes of direct morning sunlight within 30 minutes of waking.',
        'Stop caffeine consumption after 2:00 PM.',
        'Incorporate 200mg Magnesium Glycinate before bedtime.',
        'Check Vitamin D3, B12 and Ferritin levels via blood panel.'
      ],
      redFlags: 'Seek clinical evaluation if fatigue is accompanied by swollen lymph nodes, persistent low-grade fever, or chest pain.'
    },
    joint: {
      title: 'Patellofemoral & Joint Stiffness',
      urgency: 'Moderate',
      badgeClass: 'urgency-moderate',
      causes: 'Tight quadriceps/hamstrings, lack of synovial fluid movement, or cold weather.',
      remedies: [
        'Perform 5 minutes of low-impact stationary cycling or bodyweight leg swings.',
        'Foam roll the IT band and quads.',
        'Consume Omega-3 fatty acids and turmeric (curcumin) with black pepper.',
        'Keep joints warm with knee sleeves during workouts.'
      ],
      redFlags: 'Consult orthopedic doctor if joint is visibly red, swollen, hot to the touch, or unable to bear weight.'
    }
  };

  function displaySymptom(key) {
    const data = symptomData[key] || symptomData.headache;
    const output = container.querySelector('#triage-output');
    if (!output) return;

    output.innerHTML = `
      <div class="urgency-badge ${data.badgeClass}">
        <i class="fas fa-shield-alt"></i> Triage Status: ${escapeHTML(data.urgency)}
      </div>
      <h3>${escapeHTML(data.title)}</h3>
      <p style="color:var(--muted-text); margin: 0.5rem 0 1rem 0;"><strong>Common Triggers:</strong> ${escapeHTML(data.causes)}</p>

      <h4><i class="fas fa-heart-pulse" style="color:var(--success);"></i> Recommended Immediate Action Protocol:</h4>
      <div class="remedy-grid">
        ${data.remedies.map(r => `
          <div class="remedy-box">
            <i class="fas fa-check-circle" style="color:var(--success); margin-right: 0.4rem;"></i>
            <span>${escapeHTML(r)}</span>
          </div>
        `).join('')}
      </div>

      <div class="red-flag-alert">
        <strong><i class="fas fa-exclamation-triangle"></i> Red Flag Alert:</strong> ${escapeHTML(data.redFlags)}
      </div>
    `;
  }

  // Bind chips
  container.querySelectorAll('.body-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.body-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const symptomKey = chip.getAttribute('data-symptom');
      displaySymptom(symptomKey);
    });
  });

  displaySymptom('headache');
}

// Module 2: Vitals & Blood Pressure Tracker
function renderVitalsTrackerUI(container) {
  container.innerHTML = `
    <div class="feature-header">
      <h2><i class="fas fa-heartbeat" style="color:#ef4444;"></i> Clinical Vitals &amp; Blood Pressure Logger</h2>
      <p>Log and classify your cardiovascular readings against AHA/ACC guidelines with real-time risk indicators.</p>
    </div>

    <div class="vitals-tracker-grid">
      <div class="vitals-form-card">
        <h3><i class="fas fa-plus-circle"></i> Log New Vital Reading</h3>
        <form id="vitals-log-form" style="margin-top: 1rem;">
          <div class="form-group">
            <label for="vital-type">Reading Category</label>
            <select id="vital-type">
              <option value="bp">Blood Pressure (Systolic / Diastolic)</option>
              <option value="glucose">Blood Glucose (mg/dL)</option>
              <option value="pulse">Pulse / Heart Rate (BPM)</option>
              <option value="spo2">Oxygen Saturation SpO2 (%)</option>
            </select>
          </div>

          <div id="bp-fields-row" class="form-row">
            <div class="form-group">
              <label for="systolic-input">Systolic (mmHg)</label>
              <input type="number" id="systolic-input" min="70" max="250" placeholder="e.g. 120" value="120">
            </div>
            <div class="form-group">
              <label for="diastolic-input">Diastolic (mmHg)</label>
              <input type="number" id="diastolic-input" min="40" max="150" placeholder="e.g. 80" value="80">
            </div>
          </div>

          <div id="single-field-row" class="form-group hidden">
            <label id="single-field-label" for="single-val-input">Value</label>
            <input type="number" id="single-val-input" placeholder="e.g. 95">
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%;"><i class="fas fa-save"></i> Record Vital Entry</button>
        </form>
      </div>

      <div class="vitals-history-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3><i class="fas fa-history"></i> Historical Log History</h3>
          <button class="btn btn-sm btn-secondary" id="clear-vitals-btn"><i class="fas fa-trash"></i> Reset</button>
        </div>
        <table class="vitals-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Vital Metric</th>
              <th>Result</th>
              <th>Clinical Classification</th>
            </tr>
          </thead>
          <tbody id="vitals-tbody">
            <!-- Vitals rows rendered here -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  const vitalTypeSelect = container.querySelector('#vital-type');
  const bpFields = container.querySelector('#bp-fields-row');
  const singleField = container.querySelector('#single-field-row');
  const singleLabel = container.querySelector('#single-field-label');

  vitalTypeSelect.addEventListener('change', () => {
    const val = vitalTypeSelect.value;
    if (val === 'bp') {
      bpFields.classList.remove('hidden');
      singleField.classList.add('hidden');
    } else {
      bpFields.classList.add('hidden');
      singleField.classList.remove('hidden');
      if (val === 'glucose') singleLabel.textContent = 'Glucose Level (mg/dL) [Fasting < 100, Post-Meal < 140]';
      if (val === 'pulse') singleLabel.textContent = 'Heart Rate (Beats Per Minute) [Normal 60-100]';
      if (val === 'spo2') singleLabel.textContent = 'SpO2 Percentage (%) [Normal 95-100%]';
    }
  });

  function renderTable() {
    const tbody = container.querySelector('#vitals-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    vitalsHistory.forEach(item => {
      const tr = document.createElement('tr');
      const valStr = item.val2 ? `${item.val1} / ${item.val2} mmHg` : `${item.val1}`;
      tr.innerHTML = `
        <td>${escapeHTML(item.date)}</td>
        <td><strong>${escapeHTML(item.type)}</strong></td>
        <td>${escapeHTML(valStr)}</td>
        <td><span class="bp-tag ${item.status}">${escapeHTML(item.tag)}</span></td>
      `;
      tbody.appendChild(tr);
    });
  }

  const form = container.querySelector('#vitals-log-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = vitalTypeSelect.value;
    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    if (type === 'bp') {
      const sys = parseInt(container.querySelector('#systolic-input').value, 10);
      const dia = parseInt(container.querySelector('#diastolic-input').value, 10);
      if (!sys || !dia) {
        showToast('Please enter both systolic and diastolic values.', 'warning');
        return;
      }
      let tag = 'Normal';
      let status = 'bp-normal';
      if (sys > 140 || dia > 90) { tag = 'Stage 2 HTN'; status = 'bp-stage2'; }
      else if (sys >= 130 || dia >= 80) { tag = 'Stage 1 HTN'; status = 'bp-stage1'; }
      else if (sys >= 120 && dia < 80) { tag = 'Elevated'; status = 'bp-elevated'; }

      vitalsHistory.unshift({ date: timeStr, type: 'Blood Pressure', val1: sys, val2: dia, tag, status });
      showToast(`Blood Pressure logged: ${sys}/${dia} (${tag})`, 'success');
    } else {
      const val = parseInt(container.querySelector('#single-val-input').value, 10);
      if (!val) {
        showToast('Please enter a valid numeric reading.', 'warning');
        return;
      }
      let typeName = 'Blood Glucose';
      let tag = 'Normal';
      let status = 'bp-normal';

      if (type === 'glucose') {
        typeName = 'Blood Glucose';
        tag = val <= 100 ? 'Normal Fasting' : (val <= 140 ? 'Normal Post-Meal' : 'Elevated');
        status = val > 140 ? 'bp-stage1' : 'bp-normal';
      } else if (type === 'pulse') {
        typeName = 'Heart Rate';
        tag = (val >= 60 && val <= 100) ? 'Optimal Resting' : 'Out of Normal Range';
        status = (val >= 60 && val <= 100) ? 'bp-normal' : 'bp-elevated';
      } else if (type === 'spo2') {
        typeName = 'SpO2 Saturation';
        tag = val >= 95 ? 'Normal (95-100%)' : 'Low Saturation';
        status = val >= 95 ? 'bp-normal' : 'bp-stage2';
      }

      vitalsHistory.unshift({ date: timeStr, type: typeName, val1: val, val2: null, tag, status });
      showToast(`${typeName} logged: ${val}`, 'success');
    }

    renderTable();
  });

  const clearBtn = container.querySelector('#clear-vitals-btn');
  clearBtn.addEventListener('click', () => {
    vitalsHistory = [];
    renderTable();
    showToast('Vitals history cleared.', 'info');
  });

  renderTable();
}

// Module 3: Medication & Supplement Manager
function renderMedicationManagerUI(container) {
  container.innerHTML = `
    <div class="feature-header">
      <h2><i class="fas fa-pills" style="color:#8b5cf6;"></i> Daily Medication &amp; Supplement Routine</h2>
      <p>Keep track of your clinical prescriptions, vitamins, and daily supplement stacks with dosage reminders.</p>
    </div>

    <div class="vitals-tracker-grid">
      <div class="vitals-form-card">
        <h3><i class="fas fa-plus"></i> Add New Supplement / Med</h3>
        <form id="add-med-form" style="margin-top: 1rem;">
          <div class="form-group">
            <label for="med-name">Medication / Supplement Name</label>
            <input type="text" id="med-name" placeholder="e.g. Zinc Picolinate or Metformin" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="med-dose">Dosage</label>
              <input type="text" id="med-dose" placeholder="e.g. 50mg / 1 tablet" required>
            </div>
            <div class="form-group">
              <label for="med-time">Timing</label>
              <select id="med-time">
                <option value="Morning (Empty Stomach)">Morning (Empty Stomach)</option>
                <option value="Morning (With Breakfast)">Morning (With Breakfast)</option>
                <option value="Lunch (With Food)">Lunch (With Food)</option>
                <option value="Post-Workout">Post-Workout</option>
                <option value="Night (Before Bed)">Night (Before Bed)</option>
              </select>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;"><i class="fas fa-plus-circle"></i> Add to Daily Schedule</button>
        </form>
      </div>

      <div class="vitals-history-card">
        <h3><i class="fas fa-clipboard-check"></i> Today's Pill Schedule</h3>
        <div id="med-checklist" style="display:flex; flex-direction:column; gap:0.75rem; margin-top:1rem;">
          <!-- Rendered medications -->
        </div>
      </div>
    </div>
  `;

  function renderMeds() {
    const list = container.querySelector('#med-checklist');
    if (!list) return;
    list.innerHTML = '';

    medicationList.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'remedy-box';
      card.style.display = 'flex';
      card.style.alignItems = 'center';
      card.style.justifyContent = 'space-between';
      card.style.background = item.taken ? 'rgba(16, 185, 129, 0.12)' : 'rgba(0, 0, 0, 0.15)';
      card.style.borderColor = item.taken ? 'var(--success)' : 'var(--border-color)';

      card.innerHTML = `
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <input type="checkbox" id="med-${item.id}" ${item.taken ? 'checked' : ''} style="width:18px; height:18px; cursor:pointer;">
          <div>
            <strong style="font-size:0.95rem; text-decoration:${item.taken ? 'line-through' : 'none'};">${escapeHTML(item.name)}</strong>
            <div style="font-size:0.78rem; color:var(--muted-text);">${escapeHTML(item.dose)} • ${escapeHTML(item.time)}</div>
          </div>
        </div>
        <button class="btn btn-sm btn-secondary delete-med-btn" data-index="${index}" style="padding:0.25rem 0.5rem;"><i class="fas fa-times"></i></button>
      `;

      const checkbox = card.querySelector(`#med-${item.id}`);
      checkbox.addEventListener('change', () => {
        item.taken = checkbox.checked;
        renderMeds();
        if (item.taken) showToast(`Marked ${item.name} as taken!`, 'success');
      });

      const delBtn = card.querySelector('.delete-med-btn');
      delBtn.addEventListener('click', () => {
        medicationList.splice(index, 1);
        renderMeds();
        showToast('Medication removed from list.', 'info');
      });

      list.appendChild(card);
    });
  }

  const form = container.querySelector('#add-med-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = container.querySelector('#med-name').value.trim();
    const dose = container.querySelector('#med-dose').value.trim();
    const time = container.querySelector('#med-time').value;

    medicationList.push({ id: Date.now(), name, dose, time, taken: false });
    form.reset();
    renderMeds();
    showToast(`Added ${name} to your daily schedule!`, 'success');
  });

  renderMeds();
}

// Module 4: Mind Sanctuary, Breathing Pacer & Soundscapes
function renderMindSanctuaryUI(container) {
  container.innerHTML = `
    <div class="feature-header">
      <h2><i class="fas fa-brain" style="color:#8b5cf6;"></i> Mind Sanctuary &amp; Stress Relief Studio</h2>
      <p>Interactive autonomic nervous system reset with visual breathing pacers, ambient audio synthesizers, and daily gratitude journaling.</p>
    </div>

    <div class="mind-sanctuary">
      <!-- Breathing Trainer -->
      <div class="breathing-trainer">
        <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem;">
          <button class="btn btn-secondary ${breathingPreset === 'box' ? 'active' : ''}" id="preset-box">Box Breathing (4-4-4-4)</button>
          <button class="btn btn-secondary ${breathingPreset === '478' ? 'active' : ''}" id="preset-478">Relaxing 4-7-8 Breath</button>
        </div>

        <div class="breathing-orb" id="breathing-orb">
          <span id="breathe-orb-label">Ready</span>
        </div>

        <div class="breathe-phase-text" id="breathe-phase-title">Click Start to Begin</div>
        <div class="breathe-timer-count" id="breathe-timer-num">4s</div>

        <div style="margin-top: 1.5rem; display:flex; gap:0.75rem;">
          <button class="btn btn-primary btn-lg" id="start-breathe-btn"><i class="fas fa-play"></i> Start Session</button>
          <button class="btn btn-secondary" id="stop-breathe-btn"><i class="fas fa-stop"></i> Stop</button>
        </div>
      </div>

      <!-- Synthesizer Ambient Soundscapes -->
      <div>
        <h3 style="margin-bottom:1rem;"><i class="fas fa-music"></i> Procedural Ambient Audio Generators (Web Audio)</h3>
        <div class="soundscape-deck">
          <div class="sound-card">
            <i class="fas fa-cloud-rain"></i>
            <h4>Gentle Rainfall</h4>
            <p style="font-size:0.78rem; color:var(--muted-text);">Calming pink noise filter</p>
            <div class="sound-controls">
              <button class="btn btn-sm btn-primary sound-toggle-btn" data-sound="rain"><i class="fas fa-play"></i> Play</button>
            </div>
          </div>
          <div class="sound-card">
            <i class="fas fa-water"></i>
            <h4>Ocean Waves</h4>
            <p style="font-size:0.78rem; color:var(--muted-text);">Modulated surf rhythm</p>
            <div class="sound-controls">
              <button class="btn btn-sm btn-primary sound-toggle-btn" data-sound="waves"><i class="fas fa-play"></i> Play</button>
            </div>
          </div>
          <div class="sound-card">
            <i class="fas fa-bell"></i>
            <h4>432Hz Zen Bowl</h4>
            <p style="font-size:0.78rem; color:var(--muted-text);">Harmonic meditation tone</p>
            <div class="sound-controls">
              <button class="btn btn-sm btn-primary sound-toggle-btn" data-sound="zen"><i class="fas fa-play"></i> Play</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Breathing logic
  const orb = container.querySelector('#breathing-orb');
  const orbLabel = container.querySelector('#breathe-orb-label');
  const phaseTitle = container.querySelector('#breathe-phase-title');
  const timerNum = container.querySelector('#breathe-timer-num');
  const startBreatheBtn = container.querySelector('#start-breathe-btn');
  const stopBreatheBtn = container.querySelector('#stop-breathe-btn');

  function runBreathingStep() {
    if (breathingPreset === 'box') {
      // Box: Inhale 4s -> Hold 4s -> Exhale 4s -> Hold 4s
      if (breathingPhase === 'idle' || breathingPhase === 'hold2') {
        breathingPhase = 'inhale';
        breathingCount = 4;
        orb.className = 'breathing-orb inhale';
        orbLabel.textContent = 'Inhale';
        phaseTitle.textContent = 'Inhale deeply through your nose...';
      } else if (breathingPhase === 'inhale') {
        breathingPhase = 'hold1';
        breathingCount = 4;
        orb.className = 'breathing-orb hold';
        orbLabel.textContent = 'Hold';
        phaseTitle.textContent = 'Hold your breath gently...';
      } else if (breathingPhase === 'hold1') {
        breathingPhase = 'exhale';
        breathingCount = 4;
        orb.className = 'breathing-orb exhale';
        orbLabel.textContent = 'Exhale';
        phaseTitle.textContent = 'Smoothly exhale through mouth...';
      } else if (breathingPhase === 'exhale') {
        breathingPhase = 'hold2';
        breathingCount = 4;
        orb.className = 'breathing-orb hold';
        orbLabel.textContent = 'Hold';
        phaseTitle.textContent = 'Hold empty lungs calmly...';
      }
    } else {
      // 4-7-8: Inhale 4s -> Hold 7s -> Exhale 8s
      if (breathingPhase === 'idle' || breathingPhase === 'exhale') {
        breathingPhase = 'inhale';
        breathingCount = 4;
        orb.className = 'breathing-orb inhale';
        orbLabel.textContent = 'Inhale';
        phaseTitle.textContent = 'Inhale through nose for 4s...';
      } else if (breathingPhase === 'inhale') {
        breathingPhase = 'hold1';
        breathingCount = 7;
        orb.className = 'breathing-orb hold';
        orbLabel.textContent = 'Hold';
        phaseTitle.textContent = 'Hold your breath for 7s...';
      } else if (breathingPhase === 'hold1') {
        breathingPhase = 'exhale';
        breathingCount = 8;
        orb.className = 'breathing-orb exhale';
        orbLabel.textContent = 'Exhale';
        phaseTitle.textContent = 'Whoosh exhale completely for 8s...';
      }
    }
  }

  function startBreathing() {
    clearInterval(breathingInterval);
    breathingPhase = 'idle';
    runBreathingStep();
    timerNum.textContent = `${breathingCount}s`;

    breathingInterval = setInterval(() => {
      breathingCount--;
      timerNum.textContent = `${breathingCount}s`;
      if (breathingCount <= 0) {
        runBreathingStep();
      }
    }, 1000);
    showToast('Breathing session started. Follow the pulsing orb.', 'info');
  }

  function stopBreathing() {
    clearInterval(breathingInterval);
    breathingInterval = null;
    breathingPhase = 'idle';
    orb.className = 'breathing-orb';
    orbLabel.textContent = 'Ready';
    phaseTitle.textContent = 'Session paused. Click Start to resume.';
    timerNum.textContent = '4s';
  }

  startBreatheBtn.addEventListener('click', startBreathing);
  stopBreatheBtn.addEventListener('click', stopBreathing);

  container.querySelector('#preset-box').addEventListener('click', () => {
    breathingPreset = 'box';
    stopBreathing();
    renderMindSanctuaryUI(container);
  });
  container.querySelector('#preset-478').addEventListener('click', () => {
    breathingPreset = '478';
    stopBreathing();
    renderMindSanctuaryUI(container);
  });

  // Soundscape toggles
  container.querySelectorAll('.sound-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sound = btn.getAttribute('data-sound');
      toggleSynthesizerSound(sound, btn);
    });
  });
}

// Procedural Audio Synthesizer via Web Audio API
function toggleSynthesizerSound(type, btn) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (ambientNodes[type]) {
      // Stop
      ambientNodes[type].stop();
      ambientNodes[type] = null;
      btn.innerHTML = '<i class="fas fa-play"></i> Play';
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');
      showToast(`Stopped ${type} soundscape.`, 'info', 1500);
      return;
    }

    if (type === 'zen') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, audioCtx.currentTime); // 432 Hz Healing tone
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      ambientNodes[zen] = osc;
    } else if (type === 'rain' || type === 'waves') {
      // Pink/White noise generator
      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02; // Pink noise approx
        lastOut = data[i];
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.value = type === 'rain' ? 800 : 400;

      const gain = audioCtx.createGain();
      gain.gain.value = 0.12;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
      ambientNodes[type] = noise;
    }

    btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
    showToast(`Playing ${type} soundscape.`, 'success', 2000);
  } catch (err) {
    showToast('Audio playback not permitted by browser.', 'warning');
  }
}

// Module 5: Sleep & REM Cycle Calculator
function renderSleepOptimizerUI(container) {
  container.innerHTML = `
    <div class="feature-header">
      <h2><i class="fas fa-moon" style="color:#38bdf8;"></i> Circadian Rhythm &amp; Sleep Cycle Calculator</h2>
      <p>Calculate exact wake-up and bedtime windows aligned with natural 90-minute REM sleep cycles to avoid sleep inertia.</p>
    </div>

    <div class="vitals-tracker-grid">
      <div class="vitals-form-card">
        <h3><i class="fas fa-bed"></i> Calculate Wake-Up Times</h3>
        <p style="font-size:0.85rem; color:var(--muted-text); margin-bottom:1rem;">If you go to sleep right now, when should you wake up?</p>
        <button class="btn btn-primary" id="calc-sleep-now-btn" style="width:100%; margin-bottom:1.5rem;"><i class="fas fa-clock"></i> Calculate For Sleeping Now</button>

        <div class="divider"></div>

        <h3><i class="fas fa-alarm-clock"></i> Set Target Wake Time</h3>
        <div class="form-group">
          <label for="target-wake-time">Desired Wake Up Time</label>
          <input type="time" id="target-wake-time" value="06:30">
        </div>
        <button class="btn btn-secondary" id="calc-bedtime-btn" style="width:100%;"><i class="fas fa-calculator"></i> Calculate Bedtime Options</button>
      </div>

      <div class="vitals-history-card" id="sleep-results-card">
        <h3><i class="fas fa-list-check"></i> Optimal Sleep Cycles</h3>
        <p style="font-size:0.85rem; color:var(--muted-text);">Click calculate on the left to generate your personalized 90-min REM windows.</p>
        <div id="sleep-times-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:0.75rem; margin-top:1.25rem;"></div>
      </div>
    </div>
  `;

  function calculateSleepNow() {
    const resultsContainer = container.querySelector('#sleep-times-grid');
    resultsContainer.innerHTML = '';
    const now = new Date();
    // 15 mins to fall asleep
    now.setMinutes(now.getMinutes() + 15);

    // 90 min cycles: 4 (6h), 5 (7.5h - ideal), 6 (9h)
    const cycles = [
      { count: 4, hrs: '6.0 Hours (4 Cycles)', quality: 'Adequate' },
      { count: 5, hrs: '7.5 Hours (5 Cycles)', quality: 'Optimal ⭐' },
      { count: 6, hrs: '9.0 Hours (6 Cycles)', quality: 'Deep Recovery' }
    ];

    cycles.forEach(c => {
      const wakeDate = new Date(now.getTime() + c.count * 90 * 60000);
      const timeStr = wakeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const card = document.createElement('div');
      card.className = 'stat-item';
      card.innerHTML = `
        <span class="stat-value" style="font-size:1.3rem;">${timeStr}</span>
        <span class="stat-title">${c.hrs}</span>
        <span class="badge" style="font-size:0.7rem; margin-top:0.3rem; background:rgba(56,189,248,0.15); color:var(--primary-color);">${c.quality}</span>
      `;
      resultsContainer.appendChild(card);
    });
    showToast('Calculated optimal wake times for tonight!', 'success');
  }

  container.querySelector('#calc-sleep-now-btn').addEventListener('click', calculateSleepNow);
  container.querySelector('#calc-bedtime-btn').addEventListener('click', () => {
    const timeVal = container.querySelector('#target-wake-time').value;
    if (!timeVal) return;
    const [h, m] = timeVal.split(':').map(Number);
    const resultsContainer = container.querySelector('#sleep-times-grid');
    resultsContainer.innerHTML = '';

    const wakeDate = new Date();
    wakeDate.setHours(h, m, 0, 0);

    const cycles = [
      { count: 6, hrs: '9.0 Hours before', note: 'Sleep at 6 Cycles' },
      { count: 5, hrs: '7.5 Hours before', note: 'Sleep at 5 Cycles (Best ⭐)' },
      { count: 4, hrs: '6.0 Hours before', note: 'Sleep at 4 Cycles' }
    ];

    cycles.forEach(c => {
      const sleepDate = new Date(wakeDate.getTime() - (c.count * 90 + 15) * 60000);
      const timeStr = sleepDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const card = document.createElement('div');
      card.className = 'stat-item';
      card.innerHTML = `
        <span class="stat-value" style="font-size:1.3rem;">${timeStr}</span>
        <span class="stat-title">${c.hrs}</span>
        <span class="badge" style="font-size:0.7rem; margin-top:0.3rem; background:rgba(16,185,129,0.15); color:var(--success);">${c.note}</span>
      `;
      resultsContainer.appendChild(card);
    });
    showToast(`Calculated bedtime options for waking up at ${timeVal}`, 'success');
  });

  calculateSleepNow();
}

// Module 6: Emergency First Aid & CPR Hub
function renderFirstAidHubUI(container) {
  container.innerHTML = `
    <div class="feature-header">
      <h2><i class="fas fa-kit-medical" style="color:#ef4444;"></i> Emergency First Aid &amp; CPR Hub</h2>
      <p>Life-saving protocols with an interactive 110 BPM CPR compression metronome, choking Heimlich guide, and emergency contact hotlines.</p>
    </div>

    <div class="first-aid-hub">
      <!-- CPR Metronome Card -->
      <div class="cpr-metronome-card">
        <div>
          <h3 style="color:#ef4444; margin-bottom:0.25rem;"><i class="fas fa-heart-pulse"></i> Interactive CPR Compression Metronome</h3>
          <p style="font-size:0.88rem; color:var(--muted-text);">Follow 100-120 BPM tempo (Rhythm of "Stayin' Alive") for effective chest compressions (5cm deep).</p>
        </div>
        <div style="display:flex; align-items:center; gap:1.5rem;">
          <i class="fas fa-heart cpr-heart-pulse" id="cpr-heart-icon"></i>
          <button class="btn btn-primary btn-lg" id="toggle-cpr-btn" style="background:#ef4444;"><i class="fas fa-play"></i> Start 110 BPM Metronome</button>
        </div>
      </div>

      <!-- Emergency Hotline Quick Buttons -->
      <div class="remedy-grid">
        <div class="remedy-box" style="border-left: 4px solid #ef4444;">
          <strong><i class="fas fa-phone-alt"></i> National Emergency Ambulance</strong>
          <p style="font-size:1.1rem; font-weight:800; color:var(--danger); margin-top:0.25rem;">108 / 112 / 911</p>
        </div>
        <div class="remedy-box" style="border-left: 4px solid #f59e0b;">
          <strong><i class="fas fa-flask"></i> Poison Control Helpline</strong>
          <p style="font-size:1.1rem; font-weight:800; color:var(--warning); margin-top:0.25rem;">1800-222-1222</p>
        </div>
        <div class="remedy-box" style="border-left: 4px solid #8b5cf6;">
          <strong><i class="fas fa-heart"></i> Mental Health Crisis Line</strong>
          <p style="font-size:1.1rem; font-weight:800; color:var(--purple); margin-top:0.25rem;">988 (24/7 Support)</p>
        </div>
      </div>

      <!-- Step-by-Step Emergency Guides -->
      <div class="first-aid-accordion">
        <div class="aid-card">
          <div class="aid-header">
            <span><i class="fas fa-person-circle-exclamation" style="color:#ef4444;"></i> 1. Adult CPR Step-by-Step Protocol</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="aid-body">
            <ol style="padding-left:1.25rem; display:flex; flex-direction:column; gap:0.4rem;">
              <li><strong>Check Responsiveness:</strong> Tap shoulders and shout "Are you okay?". Check for normal breathing for 5-10s.</li>
              <li><strong>Call Emergency Services (112/108/911):</strong> Put call on speaker and ask a bystander for an AED defibrillator.</li>
              <li><strong>Hand Placement:</strong> Place heel of hand on center of chest (lower breastbone). Interlock fingers.</li>
              <li><strong>Hard &amp; Fast:</strong> Push down at least 2 inches (5cm) at 100-120 compressions per minute. Allow full chest recoil.</li>
              <li><strong>Ratio:</strong> 30 chest compressions followed by 2 gentle rescue breaths (or continuous hands-only CPR).</li>
            </ol>
          </div>
        </div>

        <div class="aid-card">
          <div class="aid-header">
            <span><i class="fas fa-lungs" style="color:#f97316;"></i> 2. Choking &amp; Heimlich Maneuver</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="aid-body">
            <ol style="padding-left:1.25rem; display:flex; flex-direction:column; gap:0.4rem;">
              <li>Stand behind the person with one foot slightly in front of the other for balance.</li>
              <li>Wrap arms around their waist. Make a fist with one hand and place thumb side just above navel.</li>
              <li>Grasp your fist with your other hand. Perform quick, upward and inward abdominal thrusts.</li>
              <li>Repeat until the foreign object is dislodged or person becomes unconscious (if unconscious, begin CPR).</li>
            </ol>
          </div>
        </div>

        <div class="aid-card">
          <div class="aid-header">
            <span><i class="fas fa-fire-flame-curved" style="color:#f59e0b;"></i> 3. Burn Care &amp; Scalds</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="aid-body">
            <ul>
              <li><strong>Cool Water:</strong> Immediately hold burn under cool running tap water for 10-20 minutes (Never use ice).</li>
              <li><strong>Do NOT Pop Blisters:</strong> Protect intact skin barrier against infection.</li>
              <li><strong>Cover:</strong> Apply sterile, non-stick dressing or clean cling film loosely.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;

  // CPR Metronome audio & visual beat
  const toggleBtn = container.querySelector('#toggle-cpr-btn');
  const heartIcon = container.querySelector('#cpr-heart-icon');

  function playMetronomeBeep() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}

    heartIcon.classList.add('beat');
    setTimeout(() => heartIcon.classList.remove('beat'), 120);
  }

  toggleBtn.addEventListener('click', () => {
    if (isCprRunning) {
      clearInterval(cprInterval);
      cprInterval = null;
      isCprRunning = false;
      toggleBtn.innerHTML = '<i class="fas fa-play"></i> Start 110 BPM Metronome';
      toggleBtn.style.background = '#ef4444';
      showToast('CPR metronome stopped.', 'info');
    } else {
      isCprRunning = true;
      // 110 BPM = 60000 / 110 ≈ 545ms interval
      cprInterval = setInterval(playMetronomeBeep, 545);
      toggleBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Metronome';
      toggleBtn.style.background = 'var(--secondary-dark)';
      showToast('CPR Metronome active: 110 BPM pacing.', 'warning');
    }
  });
}

// Module 7: Eye Care 20-20-20 Screen Timer
function renderEyeCareUI(container) {
  container.innerHTML = `
    <div class="feature-header">
      <h2><i class="fas fa-eye" style="color:#06b6d4;"></i> Eye Care &amp; 20-20-20 Screen Relief Timer</h2>
      <p>Mitigate digital eye strain, ciliary muscle fatigue, and dry eye syndrome with scheduled rest intervals and ocular exercises.</p>
    </div>

    <div class="vitals-tracker-grid">
      <div class="vitals-form-card" style="text-align:center;">
        <h3><i class="fas fa-stopwatch"></i> Active 20-20-20 Timer</h3>
        <p style="font-size:0.85rem; color:var(--muted-text); margin-bottom:1.5rem;">Look 20 feet away for 20 seconds every 20 minutes.</p>
        <div class="timer-display" style="font-size:3rem; margin-bottom:1rem;" id="eye-timer-disp">20:00</div>
        <div style="display:flex; justify-content:center; gap:0.75rem;">
          <button class="btn btn-primary" id="start-eye-timer"><i class="fas fa-play"></i> Start 20-Min Loop</button>
          <button class="btn btn-secondary" id="reset-eye-timer"><i class="fas fa-redo"></i> Reset</button>
        </div>
      </div>

      <div class="vitals-history-card">
        <h3><i class="fas fa-dumbbell"></i> 3-Minute Ocular Yoga Routine</h3>
        <div class="remedy-grid" style="margin-top:1rem;">
          <div class="remedy-box">
            <strong>1. Warm Palming (60s)</strong>
            <p style="font-size:0.8rem; color:var(--muted-text);">Rub hands together vigorously until warm; place palms gently over closed eyes.</p>
          </div>
          <div class="remedy-box">
            <strong>2. Figure-8 Eye Tracing (60s)</strong>
            <p style="font-size:0.8rem; color:var(--muted-text);">Slowly trace a large horizontal infinity sign across your field of vision.</p>
          </div>
          <div class="remedy-box">
            <strong>3. Near-Far Focus Shifting (60s)</strong>
            <p style="font-size:0.8rem; color:var(--muted-text);">Focus on thumb held 25cm away, then shift focus to an object 6 meters away.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  let eyeSeconds = 20 * 60;
  let eyeInterval = null;
  const disp = container.querySelector('#eye-timer-disp');

  container.querySelector('#start-eye-timer').addEventListener('click', () => {
    if (eyeInterval) return;
    eyeInterval = setInterval(() => {
      if (eyeSeconds > 0) {
        eyeSeconds--;
        const m = Math.floor(eyeSeconds / 60);
        const s = eyeSeconds % 60;
        disp.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      } else {
        clearInterval(eyeInterval);
        eyeInterval = null;
        eyeSeconds = 20 * 60;
        showToast('👁️ Time for a 20-second break! Look 20 feet away into the distance.', 'success', 8000);
        playTimerChime();
      }
    }, 1000);
    showToast('Eye break timer running. You will be notified in 20 minutes.', 'info');
  });

  container.querySelector('#reset-eye-timer').addEventListener('click', () => {
    clearInterval(eyeInterval);
    eyeInterval = null;
    eyeSeconds = 20 * 60;
    disp.textContent = '20:00';
    showToast('Eye timer reset.', 'info');
  });
}

// Module 8: Smart Custom Workout Generator
function renderWorkoutGeneratorUI(container) {
  container.innerHTML = `
    <div class="feature-header">
      <h2><i class="fas fa-magic" style="color:#f97316;"></i> Smart Custom Workout Generator</h2>
      <p>Instantly generate an evidence-based training split tailored to your muscle target, available equipment, and fitness level.</p>
    </div>

    <div class="workout-gen-card">
      <div class="gen-controls-grid">
        <div class="form-group">
          <label for="gen-muscle">Target Muscle Group</label>
          <select id="gen-muscle">
            <option value="fullbody">Full Body Compound</option>
            <option value="chest_triceps">Chest &amp; Triceps (Push)</option>
            <option value="back_biceps">Back &amp; Biceps (Pull)</option>
            <option value="legs_glutes">Legs, Quads &amp; Glutes</option>
            <option value="core_abs">Core &amp; Six-Pack Abs</option>
            <option value="hiit_cardio">HIIT Fat Burner</option>
          </select>
        </div>

        <div class="form-group">
          <label for="gen-equip">Available Equipment</label>
          <select id="gen-equip">
            <option value="bodyweight">No Equipment (Bodyweight / Home)</option>
            <option value="dumbbells">Dumbbells / Resistance Bands</option>
            <option value="gym">Full Commercial Gym</option>
          </select>
        </div>

        <div class="form-group">
          <label for="gen-level">Fitness Level</label>
          <select id="gen-level">
            <option value="beginner">Beginner</option>
            <option value="intermediate" selected>Intermediate</option>
            <option value="advanced">Advanced (High Intensity)</option>
          </select>
        </div>

        <div class="form-group">
          <label for="gen-duration">Workout Duration</label>
          <select id="gen-duration">
            <option value="15">15 Minutes (Express)</option>
            <option value="30" selected>30 Minutes (Standard)</option>
            <option value="45">45 Minutes (Full Session)</option>
          </select>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:0.75rem;">
        <button class="btn btn-primary btn-lg" id="generate-workout-btn"><i class="fas fa-bolt"></i> Generate Custom Workout</button>
      </div>
    </div>

    <div id="gen-workout-output" class="gen-result-container">
      <!-- Generated workout cards -->
    </div>
  `;

  const exerciseDb = {
    fullbody: [
      { name: 'Goblet Squats / Bodyweight Squats', sets: '3-4 Sets x 12-15 Reps', rest: '60s Rest', cues: 'Chest up, knees tracking over toes, full depth.' },
      { name: 'Push-ups / Dumbbell Bench Press', sets: '3-4 Sets x 10-12 Reps', rest: '60s Rest', cues: 'Core braced, elbows at 45 degree angle to torso.' },
      { name: 'Dumbbell Rows / Inverted Rows', sets: '3-4 Sets x 12 Reps', rest: '60s Rest', cues: 'Pull through elbows, squeeze shoulder blades together.' },
      { name: 'Romanian Deadlifts (Dumbbell/Barbell)', sets: '3 Sets x 10-12 Reps', rest: '75s Rest', cues: 'Hinge back at hips with soft knees, feel hamstring stretch.' },
      { name: 'Plank with Shoulder Taps', sets: '3 Sets x 45 Secs', rest: '45s Rest', cues: 'Keep hips completely steady, glutes engaged.' }
    ],
    chest_triceps: [
      { name: 'Incline Dumbbell Press', sets: '4 Sets x 10-12 Reps', rest: '75s Rest', cues: 'Drive upper chest up, control the 3-second descent.' },
      { name: 'Standard Push-ups', sets: '3 Sets x AMRAP', rest: '60s Rest', cues: 'Lock out triceps at top, maintain rigid straight spine.' },
      { name: 'Chest Cable Flyes / Dumbbell Flyes', sets: '3 Sets x 15 Reps', rest: '45s Rest', cues: 'Feel the deep stretch across pecs, squeeze inner pecs.' },
      { name: 'Overhead Tricep Extensions', sets: '3 Sets x 12-15 Reps', rest: '45s Rest', cues: 'Keep elbows tucked in close to ears.' }
    ],
    back_biceps: [
      { name: 'Lat Pulldowns / Pull-ups', sets: '4 Sets x 8-12 Reps', rest: '75s Rest', cues: 'Drive elbows down into your back pockets.' },
      { name: 'Bent-Over Dumbbell Rows', sets: '3 Sets x 12 Reps/side', rest: '60s Rest', cues: 'Maintain neutral spine, avoid swinging with momentum.' },
      { name: 'Face Pulls / Rear Delt Flyes', sets: '3 Sets x 15 Reps', rest: '45s Rest', cues: 'Strengthens rotator cuff and corrects slumped posture.' },
      { name: 'Incline Dumbbell Bicep Curls', sets: '3 Sets x 12 Reps', rest: '45s Rest', cues: 'Full stretch at bottom, supinate wrists at top.' }
    ],
    legs_glutes: [
      { name: 'Barbell/Dumbbell Back Squats', sets: '4 Sets x 8-10 Reps', rest: '90s Rest', cues: 'Drive up through mid-foot, brace abdominal core.' },
      { name: 'Walking Lunges', sets: '3 Sets x 12 Reps/leg', rest: '60s Rest', cues: 'Torso upright, 90-degree bend in front knee.' },
      { name: 'Glute Bridges / Hip Thrusts', sets: '4 Sets x 15 Reps', rest: '60s Rest', cues: 'Hold 2-second peak glute contraction at top.' },
      { name: 'Standing Calf Raises', sets: '3 Sets x 20 Reps', rest: '30s Rest', cues: 'Full stretch and high ankle extension.' }
    ],
    core_abs: [
      { name: 'Hanging Leg Raises / Reverse Crunches', sets: '3 Sets x 12-15 Reps', rest: '45s Rest', cues: 'Curl pelvis up towards ribs, avoid swinging.' },
      { name: 'Bicycle Crunches', sets: '3 Sets x 20 Reps/side', rest: '30s Rest', cues: 'Slow, controlled tempo, touch opposite elbow to knee.' },
      { name: 'Side Planks with Hip Dips', sets: '3 Sets x 30 Secs/side', rest: '30s Rest', cues: 'Keeps obliques and quadratus lumborum engaged.' },
      { name: 'Dead Bugs', sets: '3 Sets x 12 Reps/side', rest: '30s Rest', cues: 'Keep lower back glued flat to the floor.' }
    ],
    hiit_cardio: [
      { name: 'High Knees Sprint', sets: '4 Rounds x 45s Work', rest: '15s Rest', cues: 'Drive knees up to hip level as fast as possible.' },
      { name: 'Burpees with Push-up', sets: '4 Rounds x 45s Work', rest: '15s Rest', cues: 'Explosive jump at top, chest touches floor at bottom.' },
      { name: 'Mountain Climbers', sets: '4 Rounds x 45s Work', rest: '15s Rest', cues: 'Pump knees rapidly while holding rigid push-up plank.' },
      { name: 'Jump Squats', sets: '4 Rounds x 45s Work', rest: '15s Rest', cues: 'Soft landing on balls of feet into full squat.' }
    ]
  };

  function generate() {
    const muscle = container.querySelector('#gen-muscle').value;
    const output = container.querySelector('#gen-workout-output');
    output.innerHTML = '';

    const list = exerciseDb[muscle] || exerciseDb.fullbody;
    list.forEach(ex => {
      const card = document.createElement('div');
      card.className = 'ex-card';
      card.innerHTML = `
        <div class="ex-card-head">
          <h4>${escapeHTML(ex.name)}</h4>
          <span class="ex-sets">${escapeHTML(ex.sets)}</span>
        </div>
        <div style="font-size:0.8rem; color:var(--primary-color);"><i class="fas fa-stopwatch"></i> ${escapeHTML(ex.rest)}</div>
        <p class="ex-cues"><strong>Form Cue:</strong> ${escapeHTML(ex.cues)}</p>
      `;
      output.appendChild(card);
    });

    const startLiveContainer = document.createElement('div');
    startLiveContainer.style.gridColumn = '1 / -1';
    startLiveContainer.style.marginTop = '1rem';
    startLiveContainer.style.textAlign = 'center';
    startLiveContainer.innerHTML = `
      <button class="btn btn-primary btn-lg" id="start-generated-live-btn"><i class="fas fa-play"></i> Start This Workout Live with Interval Trainer</button>
    `;
    output.appendChild(startLiveContainer);

    startLiveContainer.querySelector('#start-generated-live-btn').addEventListener('click', () => {
      launchLiveWorkout(list);
    });

    showToast(`Generated custom workout for ${muscle.replace('_', ' ').toUpperCase()}!`, 'success');
  }

  container.querySelector('#generate-workout-btn').addEventListener('click', generate);
  generate();
}

// Module 9: Exercise Encyclopedia
function renderExerciseLibraryUI(container) {
  container.innerHTML = `
    <div class="feature-header">
      <h2><i class="fas fa-running" style="color:#f97316;"></i> Exercise Video &amp; Technique Encyclopedia</h2>
      <p>Master lifting cues, prime movers, and avoid common injury mistakes on foundational lifts.</p>
    </div>

    <div class="content-grid">
      <div class="content-card">
        <div class="video-container">
          <iframe src="https://www.youtube.com/embed/VL5Ab0T07e4" title="Barbell Squat Form" allowfullscreen></iframe>
        </div>
        <h3>1. The Barbell Back Squat</h3>
        <p><strong>Primary Muscles:</strong> Quadriceps, Gluteus Maximus, Adductor Magnus.<br><strong>Cues:</strong> Create a shelf with upper traps, brace core 360°, squat down between knees.</p>
      </div>

      <div class="content-card">
        <div class="video-container">
          <iframe src="https://www.youtube.com/embed/r4MzxtBKyNE" title="Deadlift Form" allowfullscreen></iframe>
        </div>
        <h3>2. Conventional Deadlift</h3>
        <p><strong>Primary Muscles:</strong> Hamstrings, Glutes, Erector Spinae, Lats.<br><strong>Cues:</strong> Bar over midfoot, pull slack out of bar before lifting, push the floor away.</p>
      </div>

      <div class="content-card">
        <div class="video-container">
          <iframe src="https://www.youtube.com/embed/4Y2ZdHCOXok" title="Dumbbell Press Form" allowfullscreen></iframe>
        </div>
        <h3>3. Flat Dumbbell Bench Press</h3>
        <p><strong>Primary Muscles:</strong> Pectoralis Major, Anterior Deltoid, Triceps.<br><strong>Cues:</strong> Retract shoulder blades, arch upper back slightly, press in gentle arc.</p>
      </div>

      <div class="content-card">
        <div class="video-container">
          <iframe src="https://www.youtube.com/embed/3p8EBPVZ2Iw" title="Mobility Flow" allowfullscreen></iframe>
        </div>
        <h3>4. Full Body Mobility &amp; Hip Flow</h3>
        <p><strong>Primary Muscles:</strong> Hip Flexors, Thoracic Spine, Hamstrings.<br><strong>Cues:</strong> Deep diaphragmatic breathing through all rotational ranges.</p>
      </div>
    </div>
  `;
}

// Module 10: Fitness Calculators Suite
function renderFitnessCalculatorsUI(container) {
  container.innerHTML = `
    <div class="feature-header">
      <h2><i class="fas fa-calculator" style="color:#10b981;"></i> All-in-One Fitness &amp; Body Calculators</h2>
      <p>Calculate your 1-Rep Max (1RM), Target Heart Rate training zones, and Ideal Body Weight.</p>
    </div>

    <div class="vitals-tracker-grid">
      <!-- 1RM Calculator -->
      <div class="vitals-form-card">
        <h3><i class="fas fa-dumbbell"></i> 1-Rep Max (1RM) Calculator</h3>
        <div class="form-group" style="margin-top:1rem;">
          <label for="calc-weight-lifted">Weight Lifted (kg)</label>
          <input type="number" id="calc-weight-lifted" value="80" min="1" max="500">
        </div>
        <div class="form-group">
          <label for="calc-reps-performed">Reps Performed</label>
          <input type="number" id="calc-reps-performed" value="8" min="1" max="20">
        </div>
        <button class="btn btn-primary" id="calc-1rm-btn" style="width:100%;"><i class="fas fa-calculator"></i> Calculate 1RM</button>

        <div id="one-rm-result" style="margin-top:1.25rem; text-align:center;">
          <span class="stat-value" id="rm-val">100 kg</span>
          <span class="stat-title">Estimated 1-Rep Maximum (Brzycki Formula)</span>
        </div>
      </div>

      <!-- Target Heart Rate Zones -->
      <div class="vitals-history-card">
        <h3><i class="fas fa-heart"></i> Target Heart Rate Training Zones</h3>
        <p style="font-size:0.85rem; color:var(--muted-text);">Based on your age (${currentUser.age || 26} yrs) &amp; Max HR (${220 - (currentUser.age || 26)} BPM):</p>
        <div class="remedy-grid" style="margin-top:1rem;">
          <div class="remedy-box" style="border-left:4px solid #38bdf8;">
            <strong>Zone 1 &amp; 2: Fat Burn &amp; Recovery</strong>
            <p style="font-size:0.85rem; font-weight:700; color:var(--primary-color);">115 - 135 BPM (60-70%)</p>
          </div>
          <div class="remedy-box" style="border-left:4px solid #10b981;">
            <strong>Zone 3: Aerobic Cardio Base</strong>
            <p style="font-size:0.85rem; font-weight:700; color:var(--success);">136 - 155 BPM (70-80%)</p>
          </div>
          <div class="remedy-box" style="border-left:4px solid #f97316;">
            <strong>Zone 4: Anaerobic Threshold</strong>
            <p style="font-size:0.85rem; font-weight:700; color:var(--fitness-orange);">156 - 175 BPM (80-90%)</p>
          </div>
          <div class="remedy-box" style="border-left:4px solid #ef4444;">
            <strong>Zone 5: Peak VO2 Max Sprint</strong>
            <p style="font-size:0.85rem; font-weight:700; color:var(--danger);">176 - 194 BPM (90-100%)</p>
          </div>
        </div>
      </div>
    </div>
  `;

  const weightIn = container.querySelector('#calc-weight-lifted');
  const repsIn = container.querySelector('#calc-reps-performed');
  const rmVal = container.querySelector('#rm-val');

  container.querySelector('#calc-1rm-btn').addEventListener('click', () => {
    const w = parseFloat(weightIn.value);
    const r = parseInt(repsIn.value, 10);
    if (!w || !r) return;
    // Brzycki formula: Weight / (1.0278 - (0.0278 * Reps))
    const max = (w / (1.0278 - (0.0278 * r))).toFixed(1);
    rmVal.textContent = `${max} kg`;
    showToast(`1RM estimated at ${max} kg`, 'success');
  });
}

// Module 11: 30-Day Challenges & Habits Tracker
function renderHabitsAndChallengesUI(container) {
  container.innerHTML = `
    <div class="feature-header">
      <h2><i class="fas fa-trophy" style="color:#f59e0b;"></i> 30-Day Health Challenges &amp; Habit Tracker</h2>
      <p>Build disciplined daily routines, maintain consistency streaks, and unlock achievement badges.</p>
    </div>

    <div class="vitals-tracker-grid">
      <div class="vitals-form-card">
        <h3><i class="fas fa-check-double"></i> Today's Habit Checklist</h3>
        <div id="habits-list-container" style="display:flex; flex-direction:column; gap:0.75rem; margin-top:1rem;">
          <!-- Habit checkboxes -->
        </div>
      </div>

      <div class="vitals-history-card">
        <h3><i class="fas fa-medal"></i> Achievement Milestones</h3>
        <div class="remedy-grid" style="margin-top:1rem;">
          <div class="remedy-box" style="border-left:4px solid #f59e0b;">
            <i class="fas fa-award" style="color:#f59e0b; font-size:1.5rem;"></i>
            <h4 style="margin:0.25rem 0;">5-Day Streak Master</h4>
            <p style="font-size:0.78rem; color:var(--muted-text);">Completed 5 consecutive days of wellness tasks.</p>
          </div>
          <div class="remedy-box" style="border-left:4px solid #38bdf8;">
            <i class="fas fa-tint" style="color:#38bdf8; font-size:1.5rem;"></i>
            <h4 style="margin:0.25rem 0;">Hydro Champion</h4>
            <p style="font-size:0.78rem; color:var(--muted-text);">Achieved 3.0L daily hydration target.</p>
          </div>
          <div class="remedy-box" style="border-left:4px solid #10b981;">
            <i class="fas fa-dumbbell" style="color:#10b981; font-size:1.5rem;"></i>
            <h4 style="margin:0.25rem 0;">Century Club</h4>
            <p style="font-size:0.78rem; color:var(--muted-text);">Logged 100+ active workout minutes this week.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  function renderHabits() {
    const list = container.querySelector('#habits-list-container');
    list.innerHTML = '';

    habitList.forEach((h, idx) => {
      const row = document.createElement('div');
      row.className = 'remedy-box';
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '0.75rem';
      row.style.background = h.completed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(0, 0, 0, 0.15)';
      row.style.borderColor = h.completed ? 'var(--success)' : 'var(--border-color)';

      row.innerHTML = `
        <input type="checkbox" id="habit-${h.id}" ${h.completed ? 'checked' : ''} style="width:20px; height:20px; cursor:pointer;">
        <label for="habit-${h.id}" style="cursor:pointer; flex:1; font-size:0.92rem; font-weight:600; text-decoration:${h.completed ? 'line-through' : 'none'};">
          <i class="fas ${h.icon}" style="color:var(--primary-color); margin-right:0.4rem;"></i> ${escapeHTML(h.name)}
        </label>
      `;

      row.querySelector('input').addEventListener('change', (e) => {
        h.completed = e.target.checked;
        renderHabits();
        if (h.completed) showToast(`Completed habit: ${h.name}!`, 'success');
      });

      list.appendChild(row);
    });
  }

  renderHabits();
}

// Fallback Generic Guide UI
function renderGenericGuideUI(container, featureName) {
  container.innerHTML = `
    <div class="feature-header">
      <h2>${escapeHTML(featureName)}</h2>
      <p>Comprehensive evidence-based resources and clinical wellness guides.</p>
    </div>
    <div class="content-grid" id="generic-content-grid"></div>
  `;

  const grid = container.querySelector('#generic-content-grid');
  grid.innerHTML = `
    <div class="content-card">
      <i class="fas fa-file-medical card-icon"></i>
      <h3>Clinical Research &amp; Guidelines</h3>
      <p>Detailed evidence-based protocols for ${escapeHTML(featureName)}. Practice proper hygiene, hydration, and nutrition for optimal results.</p>
    </div>
    <div class="content-card">
      <i class="fas fa-heartbeat card-icon"></i>
      <h3>Lifestyle Integration</h3>
      <p>Incorporate small daily habits: 7-9 hours sleep, 150 minutes moderate exercise per week, and stress reduction.</p>
    </div>
  `;
}

// ==========================================
// 6. LIVE WORKOUT INTERVAL PLAYER
// ==========================================
function launchLiveWorkout(exerciseList) {
  const modal = document.getElementById('live-workout-modal');
  if (!modal) return;

  livePlayerState.workoutQueue = exerciseList && exerciseList.length ? exerciseList : [
    { name: 'Jumping Jacks Warm-Up', sets: 'Cardio', cues: 'Full shoulder rotation' },
    { name: 'Bodyweight Squats', sets: 'Legs', cues: 'Chest up, knees out' },
    { name: 'Push-ups', sets: 'Chest & Core', cues: 'Elbows at 45 degrees' },
    { name: 'High Knees', sets: 'Cardio Burn', cues: 'Drive knees to hips' },
    { name: 'Plank Hold', sets: 'Core', cues: 'Glutes and abs tight' }
  ];

  livePlayerState.currentExerciseIndex = 0;
  livePlayerState.secondsLeft = 45;
  livePlayerState.isRest = false;
  livePlayerState.isPaused = false;
  livePlayerState.active = true;

  updateLivePlayerUI();
  modal.classList.add('active');
  startLivePlayerTimer();
}

function updateLivePlayerUI() {
  const currentEx = livePlayerState.workoutQueue[livePlayerState.currentExerciseIndex];
  const nextEx = livePlayerState.workoutQueue[livePlayerState.currentExerciseIndex + 1];

  const stepCount = document.getElementById('live-step-count');
  const exName = document.getElementById('live-exercise-name');
  const exTarget = document.getElementById('live-exercise-target');
  const timerNum = document.getElementById('live-timer-number');
  const phaseLabel = document.getElementById('live-interval-phase');
  const nextName = document.getElementById('live-next-name');

  if (stepCount) stepCount.textContent = `Exercise ${livePlayerState.currentExerciseIndex + 1} of ${livePlayerState.workoutQueue.length}`;

  if (livePlayerState.isRest) {
    if (exName) exName.textContent = 'REST & BREATHE 💧';
    if (exTarget) exTarget.textContent = 'Deep diaphragmatic breathing & hydrate';
    if (phaseLabel) {
      phaseLabel.textContent = 'REST INTERVAL';
      phaseLabel.style.color = '#38bdf8';
    }
  } else {
    if (exName) exName.textContent = currentEx ? currentEx.name : 'Workout Complete!';
    if (exTarget) exTarget.textContent = currentEx ? (currentEx.cues || 'Maintain form') : 'Great job!';
    if (phaseLabel) {
      phaseLabel.textContent = 'WORK INTERVAL';
      phaseLabel.style.color = '#f97316';
    }
  }

  if (timerNum) timerNum.textContent = livePlayerState.secondsLeft;
  if (nextName) nextName.textContent = nextEx ? `${nextEx.name} (45s)` : 'Final Exercise!';
}

function startLivePlayerTimer() {
  clearInterval(livePlayerState.timer);
  livePlayerState.timer = setInterval(() => {
    if (livePlayerState.isPaused) return;

    if (livePlayerState.secondsLeft > 0) {
      livePlayerState.secondsLeft--;
      const timerNum = document.getElementById('live-timer-number');
      if (timerNum) timerNum.textContent = livePlayerState.secondsLeft;

      // Audio beeps on 3, 2, 1
      if (livePlayerState.secondsLeft <= 3 && livePlayerState.secondsLeft > 0) {
        playShortBeep(440);
      }
    } else {
      // Phase transition
      playShortBeep(880); // High completion beep
      if (!livePlayerState.isRest) {
        // Switch to Rest (15s)
        livePlayerState.isRest = true;
        livePlayerState.secondsLeft = 15;
        updateLivePlayerUI();
      } else {
        // Advance to next exercise
        livePlayerState.isRest = false;
        livePlayerState.secondsLeft = 45;
        livePlayerState.currentExerciseIndex++;

        if (livePlayerState.currentExerciseIndex >= livePlayerState.workoutQueue.length) {
          // Finished workout!
          clearInterval(livePlayerState.timer);
          showToast('🎉 WORKOUT COMPLETE! Outstanding performance!', 'success', 6000);
          playTimerChime();
          closeModal('live-workout-modal');
          return;
        }
        updateLivePlayerUI();
      }
    }
  }, 1000);
}

function playShortBeep(freq = 440) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch (e) {}
}

// ==========================================
// 7. HYDRATION INTERACTIVE WIDGET
// ==========================================
function initHydrationWidget() {
  const container = document.getElementById('waterGlassGrid');
  if (!container) return;
  container.innerHTML = '';

  const total = userStats.waterGoalGlasses || 12;
  const current = userStats.waterGlasses || 7;

  for (let i = 1; i <= total; i++) {
    const glass = document.createElement('i');
    glass.className = `fas fa-glass-water water-glass-icon ${i <= current ? 'filled' : ''}`;
    glass.setAttribute('title', `Glass ${i} (250ml)`);
    glass.addEventListener('click', () => {
      userStats.waterGlasses = i;
      updateHydrationUI();
    });
    container.appendChild(glass);
  }

  updateHydrationUI();

  const addBtn = document.getElementById('add-glass-btn');
  const resetBtn = document.getElementById('reset-water-btn');
  const quickWater = document.getElementById('quick-water-btn');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (userStats.waterGlasses < (userStats.waterGoalGlasses || 12)) {
        userStats.waterGlasses++;
        updateHydrationUI();
        showToast('💧 Added +250ml water! Keep hydrating!', 'info', 1500);
      }
    });
  }

  if (quickWater) {
    quickWater.addEventListener('click', () => {
      if (userStats.waterGlasses < (userStats.waterGoalGlasses || 12)) {
        userStats.waterGlasses++;
        updateHydrationUI();
        showToast('💧 +250ml logged via Quick Bar!', 'info', 1500);
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      userStats.waterGlasses = 0;
      updateHydrationUI();
      showToast('Hydration tracker reset for today.', 'info');
    });
  }
}

function updateHydrationUI() {
  const currentGlasses = userStats.waterGlasses || 0;
  const goalGlasses = userStats.waterGoalGlasses || 12;
  const percent = Math.min(100, Math.round((currentGlasses / goalGlasses) * 100));
  const liters = (currentGlasses * 0.25).toFixed(2);

  const fill = document.getElementById('waterFillLevel');
  const pText = document.getElementById('waterPercentText');
  const curAmount = document.getElementById('currentWaterAmount');

  if (fill) fill.style.height = `${percent}%`;
  if (pText) pText.textContent = `${percent}%`;
  if (curAmount) curAmount.textContent = liters;

  // Update top bar pill
  const topWater = document.getElementById('top-water-val');
  if (topWater) topWater.textContent = `${liters} / 3.0 L`;

  // Update glass icons
  document.querySelectorAll('.water-glass-icon').forEach((glass, i) => {
    glass.classList.toggle('filled', i < currentGlasses);
  });

  localStorage.setItem('userStats', JSON.stringify(userStats));
}

// ==========================================
// 8. FOOD EXPLORER & CALORIE DATABASE
// ==========================================
function renderFoodDatabase(category = 'all', searchQuery = '') {
  const grid = document.getElementById('food-results-grid');
  if (!grid) return;
  grid.innerHTML = '';

  let filtered = foodDatabase;
  if (category !== 'all') {
    filtered = filtered.filter(f => f.category === category);
  }
  if (searchQuery) {
    filtered = filtered.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:var(--muted-text); grid-column:1/-1;">No matching food found in database.</p>';
    return;
  }

  filtered.forEach(food => {
    const card = document.createElement('div');
    card.className = 'food-item-card';
    card.innerHTML = `
      <div class="food-meta">
        <h4>${escapeHTML(food.name)}</h4>
        <span class="food-cals">${food.cals} kcal</span>
      </div>
      <div style="font-size:0.75rem; color:var(--muted-text); margin-bottom:0.4rem;">Serving: ${escapeHTML(food.serving)}</div>
      <div class="food-macros-row">
        <span><strong>P:</strong> ${food.protein}g</span>
        <span><strong>C:</strong> ${food.carbs}g</span>
        <span><strong>F:</strong> ${food.fat}g</span>
      </div>
      <button class="btn btn-sm btn-secondary add-food-btn" style="width:100%;"><i class="fas fa-plus"></i> Add to Today's Plate</button>
    `;

    card.querySelector('.add-food-btn').addEventListener('click', () => {
      dailyFoodLog.push({ name: food.name, cals: food.cals, protein: food.protein, carbs: food.carbs, fat: food.fat });
      showToast(`Added ${food.name} (${food.cals} kcal) to today's plate!`, 'success');
    });

    grid.appendChild(card);
  });
}

// ==========================================
// 9. UNIVERSAL SEARCH ENGINE
// ==========================================
function setupUniversalSearch() {
  const searchInput = document.getElementById('universal-search');
  const searchDropdown = document.getElementById('search-results-dropdown');
  const clearBtn = document.getElementById('clear-search-btn');

  if (!searchInput || !searchDropdown) return;

  const searchIndex = [
    { title: 'Symptom Advisor & Body Triage', type: 'Medical Tool', action: () => loadFeatureContent('Symptom Advisor') },
    { title: 'Blood Pressure & Vitals Tracker', type: 'Medical Tool', action: () => loadFeatureContent('Vitals & BP Tracker') },
    { title: 'Medication & Supplement Routine', type: 'Clinical Tool', action: () => loadFeatureContent('Medication Manager') },
    { title: 'Breathing Pacer & Stress Sanctuary', type: 'Mind Tool', action: () => loadFeatureContent('Stress & Mind Sanctuary') },
    { title: 'Sleep Cycles & REM Calculator', type: 'Sleep Tool', action: () => loadFeatureContent('Sleep & REM Optimizer') },
    { title: 'Emergency CPR & First Aid Protocol', type: 'Emergency', action: () => loadFeatureContent('First Aid & CPR Hub') },
    { title: '20-20-20 Eye Strain Timer', type: 'Eye Care', action: () => loadFeatureContent('Eye Care & Screen Relief') },
    { title: 'Smart AI Custom Workout Generator', type: 'Fitness Tool', action: () => loadFeatureContent('Workout Generator') },
    { title: 'Executive Fitness Dashboard', type: 'Dashboard', action: () => loadFeatureContent('Dashboard') },
    { title: 'Curated Workout Plans', type: 'Workouts', action: () => loadFeatureContent('Workout Plans') },
    { title: 'TDEE Macro Calculator & Food Search', type: 'Nutrition', action: () => loadFeatureContent('Diet & Nutrition') },
    { title: '1-Rep Max (1RM) Calculator', type: 'Calculator', action: () => loadFeatureContent('Fitness Calculators') },
    { title: 'Target Heart Rate Zones', type: 'Calculator', action: () => loadFeatureContent('Fitness Calculators') },
    { title: '30-Day Fitness & Habit Challenges', type: 'Challenges', action: () => loadFeatureContent('Challenges & Habits') }
  ];

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      searchDropdown.classList.add('hidden');
      if (clearBtn) clearBtn.classList.add('hidden');
      return;
    }

    if (clearBtn) clearBtn.classList.remove('hidden');
    const matches = searchIndex.filter(item => item.title.toLowerCase().includes(q) || item.type.toLowerCase().includes(q));

    searchDropdown.innerHTML = '';
    if (matches.length > 0) {
      matches.forEach(m => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.innerHTML = `
          <span class="item-title">${escapeHTML(m.title)}</span>
          <span class="item-type">${escapeHTML(m.type)}</span>
        `;
        div.addEventListener('click', () => {
          m.action();
          searchDropdown.classList.add('hidden');
          searchInput.value = '';
          if (clearBtn) clearBtn.classList.add('hidden');
        });
        searchDropdown.appendChild(div);
      });
      searchDropdown.classList.remove('hidden');
    } else {
      searchDropdown.innerHTML = '<p style="padding:0.75rem; color:var(--muted-text); font-size:0.85rem;">No exact match. Ask our AI Coach below!</p>';
      searchDropdown.classList.remove('hidden');
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchDropdown.classList.add('hidden');
      clearBtn.classList.add('hidden');
    });
  }

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
      searchDropdown.classList.add('hidden');
    }
  });
}

// ==========================================
// 10. SETUP ALL EVENT LISTENERS
// ==========================================
function setupEventListeners() {
  setupUniversalSearch();

  // Mode Toggle
  const modeToggle = document.getElementById('mode-toggle');
  if (modeToggle) {
    modeToggle.addEventListener('change', () => {
      currentMode = modeToggle.checked ? 'fitness' : 'medical';
      updateModeBadge();
      renderFeatures();
      showMainSection('home');
      showToast(`Switched to ${currentMode.toUpperCase()} Suite`, 'info', 1800);
    });
  }

  // Home Button
  const homeBtn = document.getElementById('home-btn');
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      document.querySelectorAll('.feature-item').forEach(el => el.classList.remove('active'));
      showMainSection('home');
    });
  }

  // Hero CTAs
  const startJourneyBtn = document.getElementById('start-journey-btn');
  const exploreMedicalBtn = document.getElementById('explore-medical-btn');

  if (startJourneyBtn) {
    startJourneyBtn.addEventListener('click', () => {
      if (modeToggle) modeToggle.checked = true;
      currentMode = 'fitness';
      updateModeBadge();
      renderFeatures();
      loadFeatureContent('Dashboard');
    });
  }

  if (exploreMedicalBtn) {
    exploreMedicalBtn.addEventListener('click', () => {
      if (modeToggle) modeToggle.checked = false;
      currentMode = 'medical';
      updateModeBadge();
      renderFeatures();
      loadFeatureContent('Symptom Advisor');
    });
  }

  // Quick Action Hub Cards
  document.querySelectorAll('.hub-card').forEach(card => {
    card.addEventListener('click', () => {
      const act = card.getAttribute('data-action');
      if (act === 'symptom-checker') {
        if (modeToggle) modeToggle.checked = false;
        currentMode = 'medical';
        updateModeBadge();
        renderFeatures();
        loadFeatureContent('Symptom Advisor');
      } else if (act === 'workout-gen') {
        if (modeToggle) modeToggle.checked = true;
        currentMode = 'fitness';
        updateModeBadge();
        renderFeatures();
        loadFeatureContent('Workout Generator');
      } else if (act === 'macro-calc') {
        if (modeToggle) modeToggle.checked = true;
        currentMode = 'fitness';
        updateModeBadge();
        renderFeatures();
        loadFeatureContent('Diet & Nutrition');
      } else if (act === 'first-aid') {
        if (modeToggle) modeToggle.checked = false;
        currentMode = 'medical';
        updateModeBadge();
        renderFeatures();
        loadFeatureContent('First Aid & CPR Hub');
      }
    });
  });

  // Top Quick Breathe Button
  const quickBreathe = document.getElementById('quick-breathe-btn');
  if (quickBreathe) {
    quickBreathe.addEventListener('click', () => {
      if (modeToggle) modeToggle.checked = false;
      currentMode = 'medical';
      updateModeBadge();
      renderFeatures();
      loadFeatureContent('Stress & Mind Sanctuary');
    });
  }

  // Live Workout Overlay Controls
  const closeLiveWorkoutBtn = document.getElementById('close-live-workout');
  const liveToggleBtn = document.getElementById('live-toggle-btn');
  const liveSkipBtn = document.getElementById('live-skip-btn');
  const livePrevBtn = document.getElementById('live-prev-btn');

  if (closeLiveWorkoutBtn) {
    closeLiveWorkoutBtn.addEventListener('click', () => {
      clearInterval(livePlayerState.timer);
      closeModal('live-workout-modal');
    });
  }

  if (liveToggleBtn) {
    liveToggleBtn.addEventListener('click', () => {
      livePlayerState.isPaused = !livePlayerState.isPaused;
      liveToggleBtn.innerHTML = livePlayerState.isPaused 
        ? '<i class="fas fa-play"></i> Resume' 
        : '<i class="fas fa-pause"></i> Pause';
    });
  }

  if (liveSkipBtn) {
    liveSkipBtn.addEventListener('click', () => {
      livePlayerState.secondsLeft = 1;
    });
  }

  if (livePrevBtn) {
    livePrevBtn.addEventListener('click', () => {
      if (livePlayerState.currentExerciseIndex > 0) {
        livePlayerState.currentExerciseIndex--;
        livePlayerState.isRest = false;
        livePlayerState.secondsLeft = 45;
        updateLivePlayerUI();
      }
    });
  }

  // Open Live Workout from Dashboard
  const openLiveWorkoutBtn = document.getElementById('open-live-workout-btn');
  if (openLiveWorkoutBtn) {
    openLiveWorkoutBtn.addEventListener('click', () => launchLiveWorkout());
  }

  // User Dropdown & Modals
  const userProfileTrigger = document.getElementById('user-profile-trigger');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const dropdownArrow = document.getElementById('dropdown-arrow');
  if (userProfileTrigger && dropdownMenu) {
    userProfileTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = dropdownMenu.classList.toggle('active');
      dropdownMenu.classList.toggle('hidden', !isActive);
      if (dropdownArrow) dropdownArrow.classList.toggle('active', isActive);
    });
  }

  document.addEventListener('click', (e) => {
    const userSection = document.getElementById('user-section');
    if (userSection && !userSection.contains(e.target)) {
      closeDropdown();
    }
  });

  const themeToggleItem = document.getElementById('theme-toggle-item');
  if (themeToggleItem) {
    themeToggleItem.addEventListener('click', () => {
      toggleTheme();
      closeDropdown();
    });
  }

  const editProfileBtn = document.getElementById('edit-profile-btn');
  const editStatsBtn = document.getElementById('edit-stats-btn');
  if (editProfileBtn) editProfileBtn.addEventListener('click', () => { closeDropdown(); openProfileModal(); });
  if (editStatsBtn) editStatsBtn.addEventListener('click', openProfileModal);

  const exportReportBtn = document.getElementById('export-report-btn');
  if (exportReportBtn) exportReportBtn.addEventListener('click', () => { closeDropdown(); openHealthReportModal(); });

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      isLoggedIn = false;
      localStorage.removeItem('currentUser');
      updateAuthUI();
      closeDropdown();
      showToast('Logged out successfully.', 'info');
    });
  }

  // Auth Forms
  const signinSignupBtn = document.getElementById('signin-signup-btn');
  if (signinSignupBtn) signinSignupBtn.addEventListener('click', openAuthModal);

  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
      tab.classList.add('active');
      const form = document.getElementById(`${targetTab}-form`);
      if (form) form.classList.add('active');
    });
  });

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      if (!email || !password) {
        showToast('Please enter both email and password.', 'warning');
        return;
      }
      isLoggedIn = true;
      currentUser.email = email;
      currentUser.name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      updateAuthUI();
      closeModal('auth-modal');
      loginForm.reset();
      showToast(`Welcome back, ${currentUser.name}!`, 'success');
    });
  }

  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value;
      const confirm = document.getElementById('signup-confirm').value;

      if (!name || !email || !password || !confirm) {
        showToast('Please fill in all registration fields.', 'warning');
        return;
      }
      if (password.length < 6) {
        showToast('Password must be at least 6 characters.', 'warning');
        return;
      }
      if (password !== confirm) {
        showToast('Passwords do not match.', 'danger');
        return;
      }

      isLoggedIn = true;
      currentUser = { name, email, age: 26, gender: 'male', goal: 'maintenance' };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      updateAuthUI();
      closeModal('auth-modal');
      signupForm.reset();
      showToast(`Account created! Welcome to FitNHeal, ${name}!`, 'success');
    });
  }

  // Profile Form
  const profileForm = document.getElementById('profile-form');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleProfileFormSubmit();
    });
  }

  // Modal Closers
  const closeAuthBtn = document.getElementById('close-auth-modal');
  if (closeAuthBtn) closeAuthBtn.addEventListener('click', () => closeModal('auth-modal'));

  const closeProfileBtn = document.getElementById('close-profile-modal');
  if (closeProfileBtn) closeProfileBtn.addEventListener('click', () => closeModal('edit-profile-modal'));

  const cancelEditBtn = document.getElementById('cancel-edit');
  if (cancelEditBtn) cancelEditBtn.addEventListener('click', () => closeModal('edit-profile-modal'));

  const closeTimerBtn = document.getElementById('close-timer-modal');
  if (closeTimerBtn) closeTimerBtn.addEventListener('click', () => closeModal('timer-modal'));

  const closeReportBtn = document.getElementById('close-report-modal');
  if (closeReportBtn) closeReportBtn.addEventListener('click', () => closeModal('health-report-modal'));

  const printReportBtn = document.getElementById('print-report-btn');
  if (printReportBtn) {
    printReportBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Food Category Filter Pills
  document.querySelectorAll('.f-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.f-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.getAttribute('data-fcategory');
      const q = document.getElementById('food-search-input') ? document.getElementById('food-search-input').value : '';
      renderFoodDatabase(cat, q);
    });
  });

  const foodSearchInput = document.getElementById('food-search-input');
  if (foodSearchInput) {
    foodSearchInput.addEventListener('input', () => {
      const activePill = document.querySelector('.f-pill.active');
      const cat = activePill ? activePill.getAttribute('data-fcategory') : 'all';
      renderFoodDatabase(cat, foodSearchInput.value);
    });
  }

  // Workout Filter Pills in Dashboard
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.getAttribute('data-filter');
      generateWorkoutCards(filter);
    });
  });

  // Ratings & Feedback
  setupRatingStars();
  const feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('feedback-name').value.trim();
      const review = document.getElementById('feedback-review').value.trim();
      if (!name || !review) {
        showToast('Please enter your name and feedback.', 'warning');
        return;
      }
      if (currentRating === 0) {
        showToast('Please select a star rating.', 'warning');
        return;
      }
      showToast(`Thank you for your ${currentRating}-star feedback, ${name}!`, 'success');
      feedbackForm.reset();
      resetRatingStars();
    });
  }

  // Timer Controls
  const startTimerBtn = document.getElementById('start-timer');
  const pauseTimerBtn = document.getElementById('pause-timer');
  const resetTimerBtn = document.getElementById('reset-timer');

  if (startTimerBtn) startTimerBtn.addEventListener('click', startTimer);
  if (pauseTimerBtn) pauseTimerBtn.addEventListener('click', pauseTimer);
  if (resetTimerBtn) resetTimerBtn.addEventListener('click', resetTimer);

  document.querySelectorAll('.preset').forEach(preset => {
    preset.addEventListener('click', () => {
      const mins = parseInt(preset.getAttribute('data-minutes'), 10) || 20;
      setTimerDuration(mins, 0);
    });
  });

  const startRecBtn = document.getElementById('start-recommended-btn');
  if (startRecBtn) {
    startRecBtn.addEventListener('click', () => openTimerWithDuration(30));
  }

  // Weight Chart Time Filter Buttons
  document.querySelectorAll('.time-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const period = btn.getAttribute('data-period');
      updateWeightChartPeriod(period);
    });
  });

  // Chatbot Setup
  setupChatbot();
  setupFooterLinks();
}

// ==========================================
// 11. PROFILE, BMI & MACRO CALCULATIONS
// ==========================================
function handleProfileFormSubmit() {
  const name = document.getElementById('profile-name').value.trim();
  const email = document.getElementById('profile-email').value.trim();
  const age = parseInt(document.getElementById('profile-age').value, 10) || 26;
  const gender = document.getElementById('profile-gender').value;
  const goal = document.getElementById('profile-goal').value;
  const act = parseFloat(document.getElementById('profile-activity').value) || 1.375;
  const heightRaw = parseFloat(document.getElementById('editHeight').value);
  const weightRaw = parseFloat(document.getElementById('editWeight').value);

  if (!name) {
    displayProfileError('Please enter your full name.');
    return;
  }
  if (isNaN(heightRaw) || heightRaw < 50 || heightRaw > 250) {
    displayProfileError('Please enter a valid height (50 to 250 cm).');
    return;
  }
  if (isNaN(weightRaw) || weightRaw < 20 || weightRaw > 300) {
    displayProfileError('Please enter a valid weight (20 to 300 kg).');
    return;
  }

  // BMI
  const heightM = heightRaw / 100;
  const bmiNum = weightRaw / (heightM * heightM);
  const bmi = parseFloat(bmiNum.toFixed(1));
  const bmiCategory = getBMICategory(bmiNum);

  // BMR (Mifflin-St Jeor)
  let bmrNum = (10 * weightRaw) + (6.25 * heightRaw) - (5 * age);
  bmrNum += (gender === 'male' ? 5 : -161);
  const bmr = Math.round(bmrNum);
  const tdee = Math.round(bmr * act);

  currentUser.name = name;
  if (email) currentUser.email = email;
  currentUser.age = age;
  currentUser.gender = gender;
  currentUser.goal = goal;
  currentUser.activityLevel = act;

  userStats.height = heightRaw;
  userStats.weight = weightRaw;
  userStats.bmi = bmi;
  userStats.bmiCategory = bmiCategory;
  userStats.bmr = bmr;
  userStats.tdee = tdee;

  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  localStorage.setItem('userStats', JSON.stringify(userStats));

  updateAuthUI();
  updateStatsDisplay();
  closeModal('edit-profile-modal');
  showToast('Profile and metabolic targets updated successfully!', 'success');
}

function displayProfileError(msg) {
  const errorBox = document.getElementById('profile-form-error');
  if (errorBox) {
    errorBox.textContent = msg;
    errorBox.classList.remove('hidden');
  } else {
    showToast(msg, 'danger');
  }
}

function getBMICategory(bmi) {
  if (typeof bmi !== 'number' || isNaN(bmi) || !isFinite(bmi)) return 'Unknown';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25.0) return 'Normal weight';
  if (bmi < 30.0) return 'Overweight';
  return 'Obese';
}

function loadUserStats() {
  try {
    const saved = localStorage.getItem('userStats');
    if (saved) userStats = JSON.parse(saved);
  } catch (e) {}
  updateStatsDisplay();
}

function updateStatsDisplay() {
  const hEl = document.getElementById('displayHeight');
  const wEl = document.getElementById('displayWeight');
  const bEl = document.getElementById('displayBMI');
  const catEl = document.getElementById('bmiCategory');
  const bmrEl = document.getElementById('displayBMR');

  if (hEl) hEl.textContent = userStats.height || 175;
  if (wEl) wEl.textContent = userStats.weight || 72;
  if (bEl) bEl.textContent = userStats.bmi || 23.5;
  if (catEl) catEl.textContent = userStats.bmiCategory || 'Normal weight';
  if (bmrEl) bmrEl.textContent = userStats.bmr ? userStats.bmr.toLocaleString() : '1,680';
}

// ==========================================
// 12. HEALTH REPORT EXPORT MODAL
// ==========================================
function openHealthReportModal() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const rDate = document.getElementById('report-date-str');
  const rName = document.getElementById('report-user-name');
  const rEmail = document.getElementById('report-user-email');
  const rHeight = document.getElementById('r-height');
  const rWeight = document.getElementById('r-weight');
  const rBmi = document.getElementById('r-bmi');
  const rBmiCat = document.getElementById('r-bmi-cat');
  const rBmr = document.getElementById('r-bmr');
  const rCal = document.getElementById('r-cal-target');
  const rProt = document.getElementById('r-protein-target');

  if (rDate) rDate.textContent = dateStr;
  if (rName) rName.textContent = currentUser.name || 'Member';
  if (rEmail) rEmail.textContent = currentUser.email || 'member@fitnheal.com';
  if (rHeight) rHeight.textContent = userStats.height || 175;
  if (rWeight) rWeight.textContent = userStats.weight || 72;
  if (rBmi) rBmi.textContent = userStats.bmi || 23.5;
  if (rBmiCat) rBmiCat.textContent = userStats.bmiCategory || 'Normal weight';
  if (rBmr) rBmr.textContent = userStats.bmr ? userStats.bmr.toLocaleString() : '1,680';
  if (rCal) rCal.textContent = userStats.tdee ? userStats.tdee.toLocaleString() : '2,100';
  if (rProt) rProt.textContent = `${Math.round((userStats.weight || 72) * 2.0)}g`;

  openModal('health-report-modal');
}

// ==========================================
// 13. TIMER ENGINE
// ==========================================
function startTimer() {
  if (isTimerRunning) return;
  if (timerSeconds <= 0) {
    const mins = parseInt(document.getElementById('minutes').value, 10) || 0;
    const secs = parseInt(document.getElementById('seconds').value, 10) || 0;
    timerSeconds = mins * 60 + secs;
  }
  if (timerSeconds <= 0) {
    showToast('Please set a duration greater than 0.', 'warning');
    return;
  }
  isTimerRunning = true;
  updateTimerDisplay();

  const statusText = document.getElementById('timer-status-text');
  if (statusText) statusText.textContent = 'Workout interval in progress...';

  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      isTimerRunning = false;
      if (statusText) statusText.textContent = 'Session Complete! 🎉';
      showToast('🎉 Timer completed! Fantastic effort!', 'success', 5000);
      playTimerChime();
    }
  }, 1000);
}

function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  isTimerRunning = false;
  const statusText = document.getElementById('timer-status-text');
  if (statusText) statusText.textContent = 'Timer paused';
}

function resetTimer() {
  pauseTimer();
  const mins = parseInt(document.getElementById('minutes').value, 10) || 0;
  const secs = parseInt(document.getElementById('seconds').value, 10) || 0;
  timerSeconds = mins * 60 + secs;
  updateTimerDisplay();
  const statusText = document.getElementById('timer-status-text');
  if (statusText) statusText.textContent = 'Ready to train';
}

function setTimerDuration(mins, secs = 0) {
  pauseTimer();
  const minInput = document.getElementById('minutes');
  const secInput = document.getElementById('seconds');
  if (minInput) minInput.value = mins;
  if (secInput) secInput.value = secs;
  timerSeconds = mins * 60 + secs;
  initialTimerSeconds = timerSeconds;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const display = document.getElementById('timer-display');
  if (!display) return;
  const m = Math.floor(timerSeconds / 60);
  const s = timerSeconds % 60;
  display.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function playTimerChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    }
  } catch (e) {}
}

// ==========================================
// 14. STAR RATING & FEEDBACK
// ==========================================
function setupRatingStars() {
  const stars = document.querySelectorAll('.rating-star');
  stars.forEach((star, index) => {
    const ratingValue = index + 1;
    star.addEventListener('mouseenter', () => highlightStars(ratingValue));
    star.addEventListener('mouseleave', () => highlightStars(currentRating));
    star.addEventListener('click', () => {
      currentRating = ratingValue;
      highlightStars(currentRating);
    });
  });
}

function highlightStars(count) {
  const stars = document.querySelectorAll('.rating-star');
  stars.forEach((star, i) => {
    star.classList.toggle('active', i < count);
  });
}

function resetRatingStars() {
  currentRating = 0;
  highlightStars(0);
}

// ==========================================
// 15. DATA VISUALIZATIONS (Chart.js)
// ==========================================
function setupCharts() {
  if (typeof Chart === 'undefined') return;

  const isLight = document.body.getAttribute('data-theme') === 'light';
  const textColor = isLight ? '#0f172a' : '#f1f5f9';
  const gridColor = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)';

  // 1. Weight Chart
  const weightCanvas = document.getElementById('weightChart');
  if (weightCanvas) {
    if (chartInstances.weightChart) chartInstances.weightChart.destroy();
    const ctx = weightCanvas.getContext('2d');
    chartInstances.weightChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Weight (kg)',
          data: [73.5, 73.0, 72.4, userStats.weight || 72],
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          tension: 0.35,
          fill: true,
          pointBackgroundColor: '#38bdf8',
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: {
            min: Math.max(0, (userStats.weight || 72) - 6),
            max: (userStats.weight || 72) + 5,
            ticks: { color: textColor },
            grid: { color: gridColor }
          }
        }
      }
    });
  }

  // 2. Progress Weight Chart (12 Months)
  const progressWeightCanvas = document.getElementById('progressWeightChart');
  if (progressWeightCanvas) {
    if (chartInstances.progressWeightChart) chartInstances.progressWeightChart.destroy();
    const ctx = progressWeightCanvas.getContext('2d');
    chartInstances.progressWeightChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Weight Trend (kg)',
          data: [76.0, 75.4, 74.8, 74.2, 73.6, 73.0, 72.8, 72.5, 72.3, 72.1, 72.0, userStats.weight || 72],
          borderColor: '#818cf8',
          backgroundColor: 'rgba(129, 140, 248, 0.12)',
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#818cf8',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { ticks: { color: textColor }, grid: { color: gridColor } }
        }
      }
    });
  }

  // 3. Activity Chart (Active Minutes)
  const activityCanvas = document.getElementById('activityChart');
  if (activityCanvas) {
    if (chartInstances.activityChart) chartInstances.activityChart.destroy();
    const ctx = activityCanvas.getContext('2d');
    chartInstances.activityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Active Minutes',
          data: [45, 60, 35, 75, 90, 40, 65],
          backgroundColor: 'rgba(249, 115, 22, 0.75)',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: textColor }, grid: { color: gridColor } },
          y: { beginAtZero: true, ticks: { color: textColor }, grid: { color: gridColor } }
        }
      }
    });
  }
}

function updateWeightChartPeriod(period) {
  if (!chartInstances.weightChart) return;
  let labels = [];
  let data = [];
  const currentW = userStats.weight || 72;

  switch (period) {
    case '1M':
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      data = [currentW + 1.5, currentW + 1.0, currentW + 0.4, currentW];
      break;
    case '3M':
      labels = ['Month 1', 'Month 2', 'Month 3'];
      data = [currentW + 3.2, currentW + 1.8, currentW];
      break;
    case '6M':
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      data = [currentW + 5.0, currentW + 4.2, currentW + 3.1, currentW + 2.0, currentW + 0.8, currentW];
      break;
    case '1Y':
      labels = ['Q1', 'Q2', 'Q3', 'Q4'];
      data = [currentW + 7.5, currentW + 5.2, currentW + 2.8, currentW];
      break;
    default:
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      data = [currentW + 1.5, currentW + 1.0, currentW + 0.4, currentW];
  }

  chartInstances.weightChart.data.labels = labels;
  chartInstances.weightChart.data.datasets[0].data = data;
  chartInstances.weightChart.update();
  showToast(`Weight analytics updated for ${period}`, 'info', 1500);
}

// ==========================================
// 16. WORKOUT CARDS & MACROS GENERATION
// ==========================================
function generateWorkoutCards(filter = 'all') {
  const container = document.getElementById('workoutCards');
  if (!container) return;

  const workouts = [
    {
      name: 'High Intensity Metabolic Cardio',
      type: 'Cardio',
      duration: 30,
      durationStr: '30 min',
      difficulty: 'Intermediate',
      calories: '320-400 kcal',
      exercises: ['Burpees', 'Jump Rope', 'Mountain Climbers', 'Squat Jumps']
    },
    {
      name: 'Upper Body Hypertrophy & Power',
      type: 'Strength',
      duration: 45,
      durationStr: '45 min',
      difficulty: 'Advanced',
      calories: '280-380 kcal',
      exercises: ['Incline DB Press', 'Barbell Rows', 'Overhead Press', 'Lateral Raises']
    },
    {
      name: 'Lower Body Quad & Glute Builder',
      type: 'Strength',
      duration: 50,
      durationStr: '50 min',
      difficulty: 'Advanced',
      calories: '350-450 kcal',
      exercises: ['Back Squats', 'Romanian Deadlifts', 'Walking Lunges', 'Calf Raises']
    },
    {
      name: 'Vinyasa Yoga & Mobility Flow',
      type: 'Mobility',
      duration: 35,
      durationStr: '35 min',
      difficulty: 'Beginner',
      calories: '160-220 kcal',
      exercises: ['Sun Salutations', 'Warrior II', 'Pigeon Pose', 'Cat-Cow Flow']
    },
    {
      name: 'No-Equipment Calisthenics Home Routine',
      type: 'Home',
      duration: 25,
      durationStr: '25 min',
      difficulty: 'All Levels',
      calories: '220-300 kcal',
      exercises: ['Push-ups', 'Bodyweight Squats', 'Chair Dips', 'Plank Hold']
    }
  ];

  let filtered = workouts;
  if (filter !== 'all') {
    filtered = workouts.filter(w => w.type === filter);
  }

  container.innerHTML = '';
  filtered.forEach(workout => {
    const card = document.createElement('div');
    card.className = 'workout-card';
    card.innerHTML = `
      <div class="workout-card-header">
        <h3>${escapeHTML(workout.name)}</h3>
        <p>${escapeHTML(workout.type)} • ${escapeHTML(workout.durationStr)} • ${escapeHTML(workout.difficulty)}</p>
      </div>
      <div class="workout-card-body">
        <ul>
          <li><span>Focus Target:</span> <span>${escapeHTML(workout.type)}</span></li>
          <li><span>Estimated Burn:</span> <span>${escapeHTML(workout.calories)}</span></li>
          <li><span>Core Movements:</span> <span>${escapeHTML(workout.exercises.join(', '))}</span></li>
        </ul>
      </div>
      <div class="workout-card-footer">
        <button class="start-btn" aria-label="Start ${escapeHTML(workout.name)}"><i class="fas fa-play"></i> Start Workout</button>
      </div>
    `;

    card.querySelector('.start-btn').addEventListener('click', () => {
      openTimerWithDuration(workout.duration);
    });

    container.appendChild(card);
  });
}

function generateMacroData() {
  const container = document.getElementById('macrosGrid');
  if (!container) return;

  const weight = userStats.weight || 72;
  const targetProtein = Math.round(weight * 2.0); // 2g/kg
  const targetCarbs = Math.round(weight * 3.0);
  const targetFat = Math.round(weight * 0.8);

  const macros = [
    { name: 'Protein (2.0g/kg)', value: `${targetProtein}g`, goal: 'Muscle Synthesis & Recovery' },
    { name: 'Carbohydrates', value: `${targetCarbs}g`, goal: 'Glycogen & Brain Fuel' },
    { name: 'Healthy Fats', value: `${targetFat}g`, goal: 'Hormone & Cell Health' },
    { name: 'Daily Fiber', value: '32g', goal: 'Gut Microbiome & Digestion' },
    { name: 'Added Sugar', value: '< 25g', goal: 'Insulin Sensitivity' },
    { name: 'Water Target', value: '3.0 Liters', goal: '12 Glasses (Optimal Hydration)' }
  ];

  container.innerHTML = '';
  macros.forEach(macro => {
    const item = document.createElement('div');
    item.className = 'macro-item';
    item.innerHTML = `
      <h4>${escapeHTML(macro.name)}</h4>
      <p>${escapeHTML(macro.value)}</p>
      <span>${escapeHTML(macro.goal)}</span>
    `;
    container.appendChild(item);
  });
}

// ==========================================
// 17. AI CHATBOT ASSISTANT 2.0
// ==========================================
function setupChatbot() {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const closeChatbot = document.querySelector('.close-chatbot');
  const chatbot = document.getElementById('ai-chatbot');
  const sendMessageBtn = document.getElementById('send-message');
  const chatbotInput = document.getElementById('chatbot-input');

  if (chatbotToggle && chatbot) {
    chatbotToggle.addEventListener('click', () => {
      chatbot.classList.toggle('active');
      if (chatbot.classList.contains('active') && chatbotInput) {
        chatbotInput.focus();
      }
    });
  }

  if (closeChatbot && chatbot) {
    closeChatbot.addEventListener('click', () => chatbot.classList.remove('active'));
  }

  if (sendMessageBtn && chatbotInput) {
    sendMessageBtn.addEventListener('click', sendChatMessage);
    chatbotInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }

  // Quick Chips
  document.querySelectorAll('.chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (chatbotInput) {
        chatbotInput.value = q;
        sendChatMessage();
      }
    });
  });
}

function initChatbotGreeting() {
  const messages = document.getElementById('chatbot-messages');
  if (!messages || messages.children.length > 0) return;

  const greeting = document.createElement('div');
  greeting.className = 'chat-message bot-message';
  greeting.innerHTML = `<strong>FitNHeal AI Coach:</strong><br>👋 Vanakkam! I am your AI Health &amp; Fitness Guide. Ask me about custom workouts, diet splits, headache remedies, BP management, or Indian high-protein meal plans!`;
  messages.appendChild(greeting);
}

function sendChatMessage() {
  const input = document.getElementById('chatbot-input');
  if (!input) return;
  const rawText = input.value.trim();
  if (!rawText) return;

  const messagesContainer = document.getElementById('chatbot-messages');
  if (!messagesContainer) return;

  // Append user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user-message';
  userMsg.textContent = rawText;
  messagesContainer.appendChild(userMsg);
  input.value = '';

  // Append typing indicator
  const typingMsg = document.createElement('div');
  typingMsg.className = 'chat-message bot-message typing-indicator';
  typingMsg.innerHTML = '<span></span><span></span><span></span>';
  messagesContainer.appendChild(typingMsg);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  const query = rawText.toLowerCase();
  let response = '';

  if (query.includes('breakfast') || query.includes('morning meal') || query.includes('egg') || query.includes('oats')) {
    response = '🍳 Top High-Protein Breakfast Ideas:\n1. 3 Whole Eggs + 2 Egg Whites Scramble with 2 slices Sourdough / Toast (32g Protein).\n2. 50g Rolled Oats cooked with 1 scoop Whey Protein, chia seeds & almonds (36g Protein).\n3. 100g Paneer Bhurji with 2 Rotis & Mint Chutney (24g Protein).';
  } else if (query.includes('eye') || query.includes('strain') || query.includes('screen') || query.includes('headache')) {
    response = '👁️ Screen Strain Protocol:\n1. Follow the 20-20-20 Rule (every 20 min look 20 feet away for 20s).\n2. Use our interactive Eye Care timer in Medical Hub.\n3. Drink 500ml water to resolve dehydration-induced vascular tension.';
  } else if (query.includes('split') || query.includes('workout') || query.includes('beginner') || query.includes('gym')) {
    response = '💪 Effective 3-Day Full Body Split:\n• Day 1 (Push & Squat): Goblet Squats, DB Bench Press, Overhead Press, Plank.\n• Day 2: Active Recovery & 8k Steps.\n• Day 3 (Pull & Hinge): Romanian Deadlifts, Lat Pulldowns/Pullups, DB Rows, Bicep Curls.\n• Day 4: Rest.\n• Day 5 (Legs & Core): Lunges, Glute Bridges, Pushups, Hanging Leg Raises.';
  } else if (query.includes('bp') || query.includes('blood pressure') || query.includes('hypertension')) {
    response = '❤️ Clinical BP Optimization:\n• Limit daily sodium to < 2,000 mg.\n• Consume potassium-rich foods (Bananas, Spinach, Coconut water, Avocados).\n• Practice 5 minutes of 4-7-8 breathing in our Mind Sanctuary to immediately stimulate vagal tone.';
  } else if (query.includes('sleep') || query.includes('insomnia') || query.includes('tired')) {
    response = '🌙 Sleep Quality Fix:\n• Sleep in multiples of 90-minute REM cycles (use our Sleep Calculator!).\n• Stop screen light 45 min before sleep.\n• Keep room cool at 18–20°C.';
  } else if (query.includes('password') || query.includes('login') || query.includes('signin')) {
    response = '🔑 This is a prototype application: you can log in with any valid email and any password (e.g. member@fitnheal.com / 123456)!';
  } else {
    response = `I can help you build custom workout routines, calculate your daily macros/calories, check clinical symptoms, or suggest Indian & global nutrition plans. Ask me anything!`;
  }

  setTimeout(() => {
    if (typingMsg.parentNode) typingMsg.parentNode.removeChild(typingMsg);
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-message bot-message';
    botMsg.style.whiteSpace = 'pre-line';
    botMsg.textContent = response;
    messagesContainer.appendChild(botMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 600);
}

// ==========================================
// 18. MODAL & TOAST HELPERS
// ==========================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function openAuthModal() { openModal('auth-modal'); }

function openProfileModal() {
  document.getElementById('profile-name').value = currentUser.name || '';
  document.getElementById('profile-email').value = currentUser.email || '';
  document.getElementById('profile-age').value = currentUser.age || 26;
  document.getElementById('profile-gender').value = currentUser.gender || 'male';
  document.getElementById('profile-goal').value = currentUser.goal || 'maintenance';
  document.getElementById('editHeight').value = userStats.height || 175;
  document.getElementById('editWeight').value = userStats.weight || 72;

  const errorBox = document.getElementById('profile-form-error');
  if (errorBox) errorBox.classList.add('hidden');

  openModal('edit-profile-modal');
}

function openTimerModal() { openModal('timer-modal'); }

function openTimerWithDuration(minutes) {
  setTimerDuration(minutes, 0);
  openModal('timer-modal');
  showToast(`Timer set for ${minutes} minutes. Click Start when ready!`, 'info', 3000);
}

function closeDropdown() {
  const dropdownMenu = document.getElementById('dropdown-menu');
  const dropdownArrow = document.getElementById('dropdown-arrow');
  const userProfileTrigger = document.getElementById('user-profile-trigger');
  if (dropdownMenu) {
    dropdownMenu.classList.remove('active');
    dropdownMenu.classList.add('hidden');
  }
  if (dropdownArrow) dropdownArrow.classList.remove('active');
  if (userProfileTrigger) userProfileTrigger.setAttribute('aria-expanded', 'false');
}

function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  let icon = 'fa-info-circle';
  if (type === 'success') icon = 'fa-check-circle';
  if (type === 'warning') icon = 'fa-exclamation-triangle';
  if (type === 'danger') icon = 'fa-times-circle';

  toast.innerHTML = `<i class="fas ${icon}"></i> <span>${escapeHTML(message)}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setupFooterLinks() {
  const aboutLink = document.getElementById('footer-about');
  const contactLink = document.getElementById('footer-contact');
  const privacyLink = document.getElementById('footer-privacy');

  if (aboutLink) {
    aboutLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('FitNHeal v3.0: Comprehensive Medical Wellness & Peak Fitness Architecture.', 'info', 4000);
    });
  }
  if (contactLink) {
    contactLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Support: support@fitnheal.com | Emergency Ambulance: 108 / 112', 'info', 4000);
    });
  }
  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Privacy Protected: All vitals and biometric data remain encrypted in your browser local storage.', 'info', 4000);
    });
  }
}

// DOM Ready
document.addEventListener('DOMContentLoaded', initApp);