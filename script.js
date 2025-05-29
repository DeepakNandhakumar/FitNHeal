// DOM Elements
const modeToggle = document.getElementById('mode-toggle');
const featureList = document.getElementById('feature-list');
const homeSection = document.getElementById('home-section');
const dynamicContent = document.getElementById('dynamic-content');
const fitnessDashboard = document.getElementById('fitness-dashboard');

const userSection = document.getElementById('user-section');
const guestView = document.getElementById('guest-view');
const memberView = document.getElementById('member-view');
const dropdownArrow = document.getElementById('dropdown-arrow');
const dropdownMenu = document.getElementById('dropdown-menu');
const themeToggleItem = document.getElementById('theme-toggle-item');

const signinBtn = document.getElementById('signin-btn');
const signupBtn = document.getElementById('signup-btn');
const homeBtn = document.getElementById('home-btn');
const startJourneyBtn = document.getElementById('start-journey-btn');
const editProfileBtn = document.getElementById('edit-profile-btn');
const logoutBtn = document.getElementById('logout-btn');
const signinSignupBtn = document.getElementById('signin-signup-btn'); // Unified button
const authModal = document.getElementById('auth-modal'); // Modal for sign in / sign up

const editProfileModal = document.getElementById('edit-profile-modal');
const closeModalBtn = document.getElementById('close-modal');
const cancelEditBtn = document.getElementById('cancel-edit');
const profileForm = document.getElementById('profile-form');

const feedbackForm = document.getElementById('feedback-form');
const ratingStars = document.querySelectorAll('.rating-star');

const editStatsBtn = document.getElementById('edit-stats-btn');

// AI Chatbot Elements
const chatbotToggle = document.querySelector('.chatbot-toggle');
const closeChatbot = document.querySelector('.close-chatbot');
const chatbot = document.querySelector('.ai-chatbot');
const sendMessageBtn = document.getElementById('send-message');

// Timer Elements
const timerModal = document.getElementById('timer-modal');
const closeTimerModal = document.getElementById('close-timer-modal');
const startTimerBtn = document.getElementById('start-timer');
const pauseTimerBtn = document.getElementById('pause-timer');
const resetTimerBtn = document.getElementById('reset-timer');
const presetTimers = document.querySelectorAll('.preset');
const timerDisplay = document.getElementById('timer-display');

let timerInterval;
let timerSeconds = 0;
let isTimerRunning = false;

let currentMode = 'medical'; // 'medical' or 'fitness'
let isLoggedIn = false;
let currentRating = 0;
let username = 'Basic Member'; // Default name, can be modified during signup

// Feature Data
const features = {
  medical: [
    { name: 'Eye Care', icon: 'fa-eye' },
    { name: 'Stress Relief', icon: 'fa-brain' },
    { name: 'Sleep Guide', icon: 'fa-moon' },
    { name: 'Hairfall Solutions', icon: 'fa-cut' },
    { name: 'Skin Care', icon: 'fa-spa' },
    { name: 'BP Monitoring', icon: 'fa-heartbeat' },
    { name: 'Sugar Levels', icon: 'fa-flask' }
  ],
  fitness: [
    { name: 'Dashboard', icon: 'fa-tachometer-alt' },
    { name: 'Workout Plans', icon: 'fa-dumbbell' },
    { name: 'Diet Guide', icon: 'fa-utensils' },
    { name: 'Exercise Library', icon: 'fa-running' },
    { name: 'Progress Tracker', icon: 'fa-chart-line' },
    { name: 'Meal Recipes', icon: 'fa-book-open' },
    { name: 'Motivational Quotes', icon: 'fa-quote-right' },
    { name: 'Workout Timer', icon: 'fa-stopwatch' }
  ]
};

// Content Data for each feature
const contentData = {
  'Eye Care': [
    {
      type: 'article',
      title: '20-20-20 Rule',
      desc: 'Prevent digital eye strain by looking 20 feet away for 20 seconds every 20 minutes.',
      icon: 'fa-file-alt',
      content: '<div class="content-detail"><h3>The 20-20-20 Rule Explained</h3><p>This simple rule helps reduce eye strain caused by prolonged screen time. Every 20 minutes, take a 20-second break to look at something 20 feet away. This gives your eye muscles a chance to relax.</p><img src="https://midatlanticretina.com/wp-content/uploads/2020/06/Artboard-1digital-eye-strain.jpg" alt="20-20-20 Rule"><h4>Why it works:</h4><ul><li>Reduces focusing fatigue</li><li>Encourages blinking to moisten eyes</li><li>Gives eyes a break from blue light</li></ul></div>'
    },
    {
      type: 'video',
      title: 'Eye Yoga Exercises',
      desc: '5-minute daily routine to strengthen eye muscles',
      icon: 'fa-play-circle',
      content: '<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/J7KVbo1ABcc" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><div class="video-details"><h3>Eye Yoga Routine</h3><p>This 5-minute routine helps strengthen your eye muscles and improve focus. Practice daily for best results.</p><ul><li>Palming - Rub hands together and place over closed eyes</li><li>Eye rolls - Slowly roll eyes in circular motions</li><li>Focus shifting - Alternate focus between near and far objects</li></ul></div>'
    },
    {
      type: 'tips',
      title: 'Nutrition for Eyes',
      desc: '• Carrots\n• Spinach\n• Eggs\n• Fish rich in Omega-3',
      icon: 'fa-apple-alt',
      content: '<div class="nutrition-guide"><h3>Best Foods for Eye Health</h3><div class="food-grid"><div class="food-item"><img src="https://images.unsplash.com/photo-1447175008436-054170c2e979?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Carrots"><h4>Carrots</h4><p>Rich in beta-carotene which converts to vitamin A</p></div><div class="food-item"><img src="https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Spinach"><h4>Spinach</h4><p>Contains lutein and zeaxanthin that protect against macular degeneration</p></div><div class="food-item"><img src="https://images.unsplash.com/photo-1587486913049-53fc88980cfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Eggs"><h4>Eggs</h4><p>Egg yolks contain vitamin A, lutein, and zinc</p></div><div class="food-item"><img src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Fish"><h4>Fatty Fish</h4><p>Salmon and tuna provide omega-3 fatty acids</p></div></div></div>'
    }
  ],
  'Stress Relief': [
    {
      type: 'tips',
      title: 'Quick Stress Busters',
      desc: '• Deep breathing\n• 5-minute walk\n• Stretching\n• Listen to music',
      icon: 'fa-wind',
      content: '<div class="stress-busters"><h3>Instant Stress Relief Techniques</h3><div class="technique-grid"><div class="technique"><i class="fas fa-lungs"></i><h4>Deep Breathing</h4><p>4-7-8 technique: Inhale 4 sec, hold 7 sec, exhale 8 sec</p></div><div class="technique"><i class="fas fa-walking"></i><h4>Short Walk</h4><p>5-minute walk outside can reset your mood</p></div><div class="technique"><i class="fas fa-hands"></i><h4>Stretching</h4><p>Simple neck and shoulder stretches release tension</p></div><div class="technique"><i class="fas fa-music"></i><h4>Music Therapy</h4><p>Calming music lowers cortisol levels</p></div></div></div>'
    },
    {
      type: 'video',
      title: 'Guided Meditation',
      desc: '10-minute meditation to reduce anxiety and improve focus',
      icon: 'fa-play-circle',
      content: '<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/inpok4MKVLM" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><div class="meditation-details"><h3>Mindfulness Meditation</h3><p>This guided meditation helps you focus on the present moment, reducing stress and anxiety.</p><h4>Benefits:</h4><ul><li>Reduces cortisol levels</li><li>Improves emotional regulation</li><li>Enhances focus and concentration</li><li>Promotes better sleep</li></ul></div>'
    }
  ],
  'Sleep Guide': [
    {
      type: 'tips',
      title: 'Better Sleep Tips',
      desc: '• Maintain a sleep schedule\n• Avoid caffeine late\n• Keep bedroom dark',
      icon: 'fa-bed',
      content: '<div class="sleep-tips"><h3>Sleep Hygiene Essentials</h3><div class="sleep-grid"><div class="sleep-tip"><i class="fas fa-clock"></i><h4>Consistent Schedule</h4><p>Go to bed and wake up at the same time daily, even on weekends</p></div><div class="sleep-tip"><i class="fas fa-coffee"></i><h4>Limit Stimulants</h4><p>Avoid caffeine after 2pm and limit alcohol before bed</p></div><div class="sleep-tip"><i class="fas fa-moon"></i><h4>Dark Environment</h4><p>Use blackout curtains and eliminate light sources</p></div><div class="sleep-tip"><i class="fas fa-temperature-low"></i><h4>Cool Temperature</h4><p>Keep bedroom between 60-67°F (15-19°C) for optimal sleep</p></div></div></div>'
    },
    {
      type: 'video',
      title: 'Relaxing Sounds',
      desc: 'Sleep music to help you fall asleep faster',
      icon: 'fa-music',
      content: '<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/rrVDATvUitA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><div class="sleep-sounds"><h3>Nature Sounds for Sleep</h3><p>Gentle rain and thunder sounds create a calming environment conducive to sleep.</p><h4>Other Sound Options:</h4><ul><li>White noise</li><li>Ocean waves</li><li>Forest sounds</li><li>Pink noise</li></ul></div>'
    }
  ],
  'Hairfall Solutions': [
    {
      type: 'tips',
      title: 'Hair Care Tips',
      desc: '• Use mild shampoo\n• Avoid heat styling\n• Oil regularly\n• Eat protein-rich foods',
      icon: 'fa-leaf',
      content: '<div class="hair-care"><h3>Comprehensive Hair Care Guide</h3><div class="hair-tips-grid"><div class="hair-tip"><i class="fas fa-pump-soap"></i><h4>Gentle Cleansing</h4><p>Use sulfate-free shampoos and limit washing to 2-3 times per week</p></div><div class="hair-tip"><i class="fas fa-fire"></i><h4>Heat Protection</h4><p>Always use heat protectant before styling and keep tools below 350°F</p></div><div class="hair-tip"><i class="fas fa-oil-can"></i><h4>Scalp Massage</h4><p>Weekly oil massage with coconut or almond oil improves circulation</p></div><div class="hair-tip"><i class="fas fa-egg"></i><h4>Protein Intake</h4><p>Hair is made of keratin - ensure adequate protein in your diet</p></div></div></div>'
    }
  ],
  'Skin Care': [
    {
      type: 'tips',
      title: 'Daily Skin Routine',
      desc: '• Cleanse twice\n• Use sunscreen\n• Stay hydrated\n• Moisturize daily',
      icon: 'fa-water',
      content: '<div class="skin-routine"><h3>Essential Skin Care Steps</h3><div class="routine-steps"><div class="step"><span class="step-number">1</span><h4>Cleansing</h4><p>Morning and night with pH-balanced cleanser</p></div><div class="step"><span class="step-number">2</span><h4>Protection</h4><p>Broad spectrum SPF 30+ sunscreen daily</p></div><div class="step"><span class="step-number">3</span><h4>Hydration</h4><p>Drink 8 glasses of water and use moisturizers suitable for your skin type</p></div></div></div>'
    }
  ],
  'BP Monitoring': [
    {
      type: 'tips',
      title: 'BP Control Tips',
      desc: '• Reduce salt intake\n• Exercise regularly\n• Avoid stress\n• Monitor daily',
      icon: 'fa-heartbeat',
      content: '<div class="bp-tips"><h3>Managing Blood Pressure</h3><ul><li>Limit sodium to less than 2,300 mg per day</li><li>Engage in 30 minutes of moderate exercise daily</li><li>Practice stress-reduction techniques</li><li>Monitor your BP at the same time each day</li><li>Limit alcohol and caffeine intake</li></ul></div>'
    }
  ],
  'Sugar Levels': [
    {
      type: 'tips',
      title: 'Control Blood Sugar',
      desc: '• Eat fiber-rich foods\n• Limit sugary snacks\n• Stay active\n• Check levels often',
      icon: 'fa-apple-alt',
      content: '<div class="sugar-tips"><h3>Blood Sugar Management</h3><ul><li>Choose complex carbs over simple sugars</li><li>Pair carbs with protein or healthy fats</li><li>Exercise regularly to improve insulin sensitivity</li><li>Stay hydrated with water</li><li>Get adequate sleep (7-9 hours)</li></ul></div>'
    }
  ],
  'Workout Plans': [
    
    {
      type: 'article',
      title: 'Beginner Routine',
      desc: 'Start your fitness journey with this easy plan',
      icon: 'fa-file-alt',
      content: '<div class="workout-plan"><h3>Beginner Workout Plan</h3><p>Start with 3 days per week, alternating between these two routines :cite[7]:</p><div class="plan-grid"><div class="day-plan"><h4>Day 1: Full Body</h4><ul><li>Bodyweight squats: 3 sets of 10-12</li><li>Push-ups (modified if needed): 3 sets of 8-10</li><li>Bent-over dumbbell rows: 3 sets of 10</li><li>Plank: 3 sets of 20-30 seconds</li></ul></div><div class="day-plan"><h4>Day 2: Rest or Light Cardio</h4><ul><li>Walking: 20-30 minutes</li><li>Stretching: 10 minutes</li></ul></div><div class="day-plan"><h4>Day 3: Full Body</h4><ul><li>Lunges: 3 sets of 8 per leg</li><li>Dumbbell shoulder press: 3 sets of 10</li><li>Glute bridges: 3 sets of 12</li><li>Bird dogs: 3 sets of 10 per side</li></ul></div></div></div>'
    },
    {
      type: 'video',
      title: 'Mobility & Strength',
      desc: 'Improve movement while building muscle',
      icon: 'fa-running',
      content: '<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/3p8EBPVZ2Iw" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><div class="video-details"><h3>Functional Fitness Flow</h3><p>Combines strength training with mobility work for injury prevention</p><ul><li>Dynamic warm-up included</li><li>Focus on movement patterns</li><li>Great for athletes and desk workers</li></ul></div></div>'
    },
    {
      type: 'video',
      title: 'HIIT Full Body',
      desc: 'Metabolic conditioning workout',
      icon: 'fa-bolt',
      content: '<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/M0uO8X3_tEA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><div class="video-details"><h3>20-Minute Fat Burner</h3><p>High intensity interval training that builds endurance and burns calories</p><ul><li>45 sec work / 15 sec rest</li><li>No repeat exercises</li><li>Suitable for intermediate levels</li></ul></div></div>'
    }
  ],
  'Diet Guide': [
    {
      type: 'article',
      title: 'Balanced Diet',
      desc: 'Understanding macronutrients and micronutrients',
      icon: 'fa-file-alt',
      content: '<div class="diet-guide"><h3>Components of a Balanced Diet</h3><div class="macronutrients"><h4>Macronutrients:</h4><div class="macro-grid"><div class="macro"><i class="fas fa-drumstick-bite"></i><h5>Protein</h5><p>Builds and repairs tissues (meat, fish, eggs, legumes)</p></div><div class="macro"><i class="fas fa-bread-slice"></i><h5>Carbohydrates</h5><p>Primary energy source (whole grains, fruits, vegetables)</p></div><div class="macro"><i class="fas fa-bacon"></i><h5>Fats</h5><p>Energy storage and hormone production (avocados, nuts, olive oil)</p></div></div></div><div class="micronutrients"><h4>Micronutrients:</h4><p>Essential vitamins and minerals found in colorful fruits and vegetables, nuts, seeds, and whole foods.</p></div></div>'
    }
  ],
  'Exercise Library': [
    {
      type: 'video',
      title: 'Strength Exercises',
      desc: 'Proper form for weight training',
      icon: 'fa-dumbbell',
      content: '<div class="video-container"><iframe width="560" height="315" src="https://www.youtube.com/embed/VL5Ab0T07e4" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
    }
  ],
  'Progress Tracker': [
    {
      type: 'article',
      title: 'Setting Goals',
      desc: 'How to set achievable fitness goals',
      icon: 'fa-bullseye',
      content: '<div class="goal-setting"><h3>SMART Goal Framework</h3><div class="smart-grid"><div class="smart-point"><h4>Specific</h4><p>Clearly define what you want to achieve</p></div><div class="smart-point"><h4>Measurable</h4><p>Include quantifiable metrics to track progress</p></div><div class="smart-point"><h4>Achievable</h4><p>Set realistic goals within your capabilities</p></div><div class="smart-point"><h4>Relevant</h4><p>Align goals with your values and long-term objectives</p></div><div class="smart-point"><h4>Time-bound</h4><p>Set a deadline to create urgency</p></div></div><h4>Example:</h4><p>"I will lose 5 pounds in 2 months by exercising 4 times per week and reducing sugar intake."</p></div>'
    }
  ],
  'Meal Recipes': [
    {
      type: 'article',
      title: 'Breakfast Ideas',
      desc: 'Healthy starts to your day',
      icon: 'fa-egg',
      content: `<div class="recipe-container">
        <div class="recipe-card">
          <h4>Overnight Oats</h4>
          <p>1/2 cup oats, 1/2 cup milk, 1 tbsp chia seeds, 1 tsp honey, berries</p>
        </div>
        <div class="recipe-card">
          <img src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80" alt="Avocado Toast">
          <h4>Avocado Toast</h4>
          <p>Whole grain toast, 1/2 avocado, cherry tomatoes, olive oil, salt</p>
        </div>
        <div class="recipe-card">
          <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80" alt="Greek Yogurt Parfait">
          <h4>Greek Yogurt Parfait</h4>
          <p>Greek yogurt, granola, mixed berries, drizzle of honey</p>
        </div>
      </div>`
    }
  ],
  'Motivational Quotes': [
    {
      type: 'quote',
      title: 'Inspiration',
      desc: 'Daily dose of motivation',
      icon: 'fa-quote-right',
      content: '<div class="quote-container"><blockquote>"The only bad workout is the one that didn\'t happen."</blockquote><p></p></div>'
    },
    {
      type: 'quote',
      title: 'Perseverance',
      desc: 'Keep pushing forward',
      icon: 'fa-quote-right',
      content: '<div class="quote-container"><blockquote>"It never gets easier, you just get stronger."</blockquote><p></p></div>'
    },
    {
      type: 'quote',
      title: 'Progress',
      desc: 'Small steps lead to big results',
      icon: 'fa-quote-right',
      content: '<div class="quote-container"><blockquote>"Success is the sum of small efforts repeated day in and day out."</blockquote><p>- Robert Collier</p></div>'
    },
    {
      type: 'quote',
      title: 'Mindset',
      desc: 'The power of belief',
      icon: 'fa-quote-right',
      content: '<div class="quote-container"><blockquote>"Whether you think you can or you think you can\'t, you\'re right."</blockquote><p>- Henry Ford</p></div>'
    }
  ]
};

// Initialize App
function initApp() {
  renderFeatures();
  setupEventListeners();
  setupCharts();
  generateWorkoutCards();
  generateMacroData();
  loadUserStats();
  

  // Check saved theme
  if (localStorage.getItem('theme') === 'light') {
    document.body.setAttribute('data-theme', 'light');
    themeToggleItem.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
  } else {
    // Default to dark
    document.body.setAttribute('data-theme', 'dark');
    themeToggleItem.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
  }
}

// Render Features List
function renderFeatures() {
  featureList.innerHTML = '';
  features[currentMode].forEach(feature => {
    const li = document.createElement('li');
    li.className = 'feature-item';
    li.innerHTML = `
      <i class="fas ${feature.icon}"></i>
      <span>${feature.name}</span>
    `;
    li.addEventListener('click', () => loadFeatureContent(feature.name));
    featureList.appendChild(li);
  });
}

// Load Feature Content
function loadFeatureContent(featureName) {
  // Handle Dashboard separately
  if (featureName === 'Dashboard') {
    homeSection.classList.remove('active');
    dynamicContent.classList.remove('active');
    fitnessDashboard.classList.add('active');
    return;
  }

  // For 'Workout Timer', open modal
  if (featureName === 'Workout Timer') {
    document.getElementById('timer-modal').classList.add('active');
    return;
  }

  // For other features
  homeSection.classList.remove('active');
  fitnessDashboard.classList.remove('active');
  dynamicContent.classList.add('active');
  dynamicContent.innerHTML = '';

  const featureHeader = document.createElement('div');
  featureHeader.className = 'feature-header';
  featureHeader.innerHTML = `
    <h2>${featureName}</h2>
    <p>Explore resources to improve your ${featureName.toLowerCase()}</p>
  `;
  dynamicContent.appendChild(featureHeader);

  const contentGrid = document.createElement('div');
  contentGrid.className = 'content-grid';

  if (contentData[featureName]) {
    contentData[featureName].forEach(item => {
      const card = document.createElement('div');
      card.className = `content-card ${item.type}`;
      card.innerHTML = `
        <i class="fas ${item.icon} card-icon"></i>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        ${item.type === 'video' ? '<div class="play-btn"><i class="fas fa-play"></i></div>' : ''}
      `;
      
      // Add click event to show content
      card.addEventListener('click', () => {
        showContentDetail(item);
      });
      
      contentGrid.appendChild(card);
    });
  } else {
    contentGrid.innerHTML = '<p class="empty-state">Content coming soon!</p>';
  }

  dynamicContent.appendChild(contentGrid);
}

// Show detailed content when a card is clicked
// Update this function - Add at the beginning of your code where other functions are defined
function showContentDetail(item) {
  // Store the current feature name before showing details
  const currentFeature = document.querySelector('.feature-header h2')?.textContent;
  
  dynamicContent.innerHTML = '';
  
  const backButton = document.createElement('button');
  backButton.className = 'back-button';
  backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back';
  backButton.addEventListener('click', () => {
    // Use the stored feature name to go back
    if (currentFeature) {
      loadFeatureContent(currentFeature);
    } else {
      // Fallback to home if feature name not available
      homeSection.classList.add('active');
      dynamicContent.classList.remove('active');
      fitnessDashboard.classList.remove('active');
    }
  });
  dynamicContent.appendChild(backButton);
  
  const contentContainer = document.createElement('div');
  contentContainer.className = 'content-detail-container';
  contentContainer.innerHTML = item.content;
  dynamicContent.appendChild(contentContainer);
}
// Replace the existing startJourneyBtn event listener with this:
startJourneyBtn.addEventListener('click', () => {
  if (!isLoggedIn) {
    // Show signup modal or directly log in (depending on your flow)
    isLoggedIn = true;
    guestView.classList.add('hidden');
    memberView.classList.remove('hidden');
  }
  // Show the complete profile section
  homeSection.classList.remove('active');
  dynamicContent.classList.remove('active');
  fitnessDashboard.classList.add('active');
  // Scroll to profile section if needed
  document.getElementById('user-profile-section').scrollIntoView({ behavior: 'smooth' });
});
// Setup Event Listeners
function setupEventListeners() {
  // Mode toggle
  modeToggle.addEventListener('change', () => {
    currentMode = modeToggle.checked ? 'fitness' : 'medical';
    renderFeatures();
    homeSection.classList.add('active');
    dynamicContent.classList.remove('active');
    fitnessDashboard.classList.remove('active');
  });

  // Theme toggle
  themeToggleItem.addEventListener('click', toggleTheme);

  // Dropdown menu
  dropdownArrow.addEventListener('click', () => {
    dropdownMenu.classList.toggle('active');
    dropdownArrow.classList.toggle('active');
  });

  // Home button
  homeBtn.addEventListener('click', () => {
    homeSection.classList.add('active');
    dynamicContent.classList.remove('active');
    fitnessDashboard.classList.remove('active');
  });

  signinSignupBtn.addEventListener('click', () => {
    authModal.classList.add('active'); // Open modal
  });
  // Switch between sign-in and sign-up forms
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      // Show the corresponding form
      document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
      });
      document.getElementById(`${targetTab}-form`).classList.add('active');
      // Update tab styles
      document.querySelectorAll('.auth-tab').forEach(t => {
        t.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
  // Event listener for the login form submission
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    // Simulate login (replace with actual authentication logic)
    if (email && password) {
      isLoggedIn = true;
      guestView.classList.add('hidden');
      memberView.classList.remove('hidden');
      authModal.classList.remove('active'); // Close modal
      alert('Logged in successfully!');
    } else {
      alert('Please enter valid credentials.');
    }
  });
  // Event listener for the signup form submission
  document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    // Simulate signup (replace with actual registration logic)
    if (name && email && password && confirmPassword) {
      if (password === confirmPassword) {
        isLoggedIn = true;
        guestView.classList.add('hidden');
        memberView.classList.remove('hidden');
        authModal.classList.remove('active'); // Close modal
        alert('Signed up successfully! Welcome aboard!');
      } else {
        alert('Passwords do not match.');
      }
    } else {
      alert('Please fill all fields.');
    }
  });

  // Edit profile modal
  editProfileBtn.addEventListener('click', () => {
    editProfileModal.classList.add('active');
  });
  closeModalBtn.addEventListener('click', () => {
    editProfileModal.classList.remove('active');
  });
  cancelEditBtn.addEventListener('click', () => {
    editProfileModal.classList.remove('active');
  });
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Save logic here
    alert('Profile updated successfully!');
    editProfileModal.classList.remove('active');
  });
  editStatsBtn.addEventListener('click', () => {
    editProfileModal.classList.add('active');
  });

  // Feedback form
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('feedback-name').value;
    const review = document.getElementById('feedback-review').value;
    if (!name || !review || currentRating === 0) {
      alert('Please fill all fields and provide a rating');
      return;
    }
    alert(`Thank you for your ${currentRating}-star feedback, ${name}!`);
    feedbackForm.reset();
    resetRatingStars();
  });

  // Rating stars
  ratingStars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = parseInt(star.getAttribute('data-rating'));
      setRatingStars(rating);
    });
  });

  // Outside click to close dropdown and modal
  document.addEventListener('click', (e) => {
    if (!userSection.contains(e.target)) {
      dropdownMenu.classList.remove('active');
      dropdownArrow.classList.remove('active');
    }
    if (e.target.closest('.modal') || e.target.closest('.close-modal')) {
      document.querySelectorAll('.modal').forEach(mod => mod.classList.remove('active'));
    }
  });

  // Chatbot toggle
  if (chatbotToggle && closeChatbot && sendMessageBtn && document.getElementById('chatbot-input')) {
    chatbotToggle.addEventListener('click', () => {
      chatbot.classList.toggle('active');
    });
    closeChatbot.addEventListener('click', () => {
      chatbot.classList.remove('active');
    });
    document.getElementById('chatbot-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
    sendMessageBtn.addEventListener('click', sendChatMessage);
  }

  // Timer modal controls
  document.querySelectorAll('.preset').forEach(preset => {
    preset.addEventListener('click', () => {
      const minutes = parseInt(preset.getAttribute('data-minutes'));
      document.getElementById('minutes').value = minutes;
      document.getElementById('seconds').value = 0;
      updateTimerDisplay(minutes * 60);
    });
  });
  document.getElementById('start-timer').addEventListener('click', startTimer);
  document.getElementById('pause-timer').addEventListener('click', pauseTimer);
  document.getElementById('reset-timer').addEventListener('click', resetTimer);
  document.getElementById('close-timer-modal').addEventListener('click', () => {
    document.getElementById('timer-modal').classList.remove('active');
  });

  // Footer link click handlers
  document.querySelectorAll('.footer-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const iconClass = link.querySelector('i').className;
    
    if (iconClass.includes('fa-info-circle')) {
      alert(`About FitNHeal\n\n` +
            `FitNHeal is a comprehensive health and fitness platform that helps you:\n` +
            `• Track your wellness journey\n` +
            `• Monitor medical and fitness metrics\n` +
            `• Access personalized health recommendations\n` +
            `• Connect with health professionals\n\n` +
            `Version: 2.1.0\n` +
            `Last Updated: June 2023`);
    } 
    else if (iconClass.includes('fa-envelope')) {
      alert(`Contact Us\n\n` +
            `Customer Support:\n` +
            `Email: support@fitnheal.com\n` +
            `Phone: +1 (555) 123-4567\n\n` +
            `Business Hours:\n` +
            `Monday-Friday: 9AM - 6PM EST\n` +
            `Saturday: 10AM - 2PM EST\n\n` +
            `For partnerships: partnerships@fitnheal.com\n` +
            `Press inquiries: press@fitnheal.com`);
    } 
    else if (iconClass.includes('fa-shield-alt')) {
      alert(`Privacy Policy\n\n` +
            `We value your privacy. Key points:\n\n` +
            `• Your data is encrypted and securely stored\n` +
            `• We never sell your personal information\n` +
            `• You control what data you share\n\n` +
            `Full privacy policy available at:\n` +
            `www.fitnheal.com/privacy\n\n` +
            `GDPR & CCPA compliant\n` +
            `Data Protection Officer: dpo@fitnheal.com`);
    }
  });
});

  // Social media links - open in new tab
  document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const iconClass = link.querySelector('i').className;
      let url = '#';
      
      if (iconClass.includes('fa-facebook')) {
        url = 'https://www.facebook.com/';
      } else if (iconClass.includes('fa-twitter')) {
        url = 'https://www.twitter.com/';
      } else if (iconClass.includes('fa-instagram')) {
        url = 'https://www.instagram.com/';
      }
      
      window.open(url, '_blank');
    });
  });
}

// Theme toggle
function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);

  if (newTheme === 'dark') {
    themeToggleItem.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
  } else {
    themeToggleItem.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
  }
  localStorage.setItem('theme', newTheme);
}

// Timer functions
function startTimer() {
  if (isTimerRunning) return;
  const mins = parseInt(document.getElementById('minutes').value) || 0;
  const secs = parseInt(document.getElementById('seconds').value) || 0;
  timerSeconds = mins * 60 + secs;
  if (timerSeconds <= 0) return;

  isTimerRunning = true;
  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay(timerSeconds);
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      alert('Timer completed!');
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
}

function resetTimer() {
  pauseTimer();
  const mins = parseInt(document.getElementById('minutes').value) || 0;
  const secs = parseInt(document.getElementById('seconds').value) || 0;
  timerSeconds = mins * 60 + secs;
  updateTimerDisplay(timerSeconds);
}

function updateTimerDisplay(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  document.getElementById('timer-display').textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Rating functions
function setRatingStars(rating) {
  currentRating = rating;
  ratingStars.forEach(star => {
    const starRating = parseInt(star.getAttribute('data-rating'));
    if (starRating <= rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

function resetRatingStars() {
  currentRating = 0;
  ratingStars.forEach(star => star.classList.remove('active'));
}

// Charts setup
function setupCharts() {
  // Assuming you have canvases with IDs: weightChart, progressWeightChart, activityChart
  if (typeof Chart !== 'undefined') {
    // Weight Chart
    const weightCtx = document.getElementById('weightChart')?.getContext('2d');
    if (weightCtx) {
      new Chart(weightCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Weight (kg)',
            data: [75, 73, 72, 71, 70, 69],
            borderColor: '#00b4d8',
            backgroundColor: 'rgba(0, 180, 216, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: false, min: 65, max: 80 }
          }
        }
      });
    }
    // Progress Weight Chart
    const progressWeightCtx = document.getElementById('progressWeightChart')?.getContext('2d');
    if (progressWeightCtx) {
      new Chart(progressWeightCtx, {
        type: 'line',
        data: {
          labels: Array.from({ length: 12 }, (_, i) => `${i + 1}/12`),
          datasets: [{
            label: 'Weight (kg)',
            data: [75, 74, 74, 73, 72, 72, 71, 71, 70, 70, 69, 68],
            borderColor: '#00b4d8',
            backgroundColor: 'rgba(0, 180, 216, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: false, min: 65, max: 80 }
          }
        }
      });
    }
    // Activity Chart
    const activityCtx = document.getElementById('activityChart')?.getContext('2d');
    if (activityCtx) {
      new Chart(activityCtx, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Active Minutes',
            data: [45, 60, 30, 75, 90, 40, 60],
            backgroundColor: 'rgba(0, 180, 216, 0.7)',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  }
}

// Generate Workout Cards
function generateWorkoutCards() {
  const workoutCardsContainer = document.getElementById('workoutCards');
  if (!workoutCardsContainer) return;
  const workouts = [
    {
      name: 'Cardio Blast',
      type: 'Cardio',
      duration: '30 min',
      difficulty: 'Intermediate',
      calories: '300-400 kcal',
      exercises: ['Running', 'Jump Rope', 'Burpees', 'Mountain Climbers']
    },
    {
      name: 'Strength Training',
      type: 'Weights',
      duration: '45 min',
      difficulty: 'Advanced',
      calories: '250-350 kcal',
      exercises: ['Bench Press', 'Squats', 'Deadlifts', 'Pull-ups']
    },
    {
      name: 'Yoga Flow',
      type: 'Flexibility',
      duration: '60 min',
      difficulty: 'Beginner',
      calories: '200-300 kcal',
      exercises: ['Sun Salutations', 'Warrior Poses', 'Tree Pose', 'Savasana']
    }
  ];

  workoutCardsContainer.innerHTML = '';

  workouts.forEach(workout => {
    const card = document.createElement('div');
    card.className = 'workout-card';

    card.innerHTML = `
      <div class="workout-card-header">
        <h3>${workout.name}</h3>
        <p>${workout.type} • ${workout.duration} • ${workout.difficulty}</p>
      </div>
      <div class="workout-card-body">
        <ul>
          <li><span>Type:</span> <span>${workout.type}</span></li>
          <li><span>Duration:</span> <span>${workout.duration}</span></li>
          <li><span>Calories:</span> <span>${workout.calories}</span></li>
          <li><span>Exercises:</span> <span>${workout.exercises.join(', ')}</span></li>
        </ul>
      </div>
      <div class="workout-card-footer">
        <button class="start-btn">Start Workout</button>
      </div>
    `;
    workoutCardsContainer.appendChild(card);
  });
}

// Generate Macro Data
function generateMacroData() {
  const macrosGrid = document.getElementById('macrosGrid');
  if (!macrosGrid) return;
  const macros = [
    { name: 'Protein', value: '150g', goal: '160g' },
    { name: 'Carbs', value: '200g', goal: '220g' },
    { name: 'Fats', value: '50g', goal: '60g' },
    { name: 'Fiber', value: '25g', goal: '30g' },
    { name: 'Sugar', value: '30g', goal: '25g' },
    { name: 'Water', value: '2.5L', goal: '3L' }
  ];

  macrosGrid.innerHTML = '';

  macros.forEach(macro => {
    const macroItem = document.createElement('div');
    macroItem.className = 'macro-item';

    macroItem.innerHTML = `
      <h4>${macro.name}</h4>
      <p>${macro.value}</p>
      <span>Goal: ${macro.goal}</span>
    `;
    macrosGrid.appendChild(macroItem);
  });
}
// Update the profile form submission handler
profileForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get the edited values
  const height = document.getElementById('editHeight').value;
  const weight = document.getElementById('editWeight').value;
  
  // Calculate BMI (BMI = weight(kg) / (height(m) * height(m)))
  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
  const bmiCategory = getBMICategory(bmi);
  
  // Update the display
  document.getElementById('displayHeight').textContent = height;
  document.getElementById('displayWeight').textContent = weight;
  document.getElementById('displayBMI').textContent = bmi;
  document.getElementById('bmiCategory').textContent = bmiCategory;
  
  // Save to localStorage (optional)
  localStorage.setItem('userStats', JSON.stringify({ height, weight, bmi, bmiCategory }));
  
  // Close the modal
  editProfileModal.classList.remove('active');
  
  alert('Profile updated successfully!');
});

// Helper function to determine BMI category
function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi < 25) return 'Normal';
  if (bmi >= 25 && bmi < 30) return 'Overweight';
  return 'Obese';
}

// Load saved stats when page loads
function loadUserStats() {
  const savedStats = JSON.parse(localStorage.getItem('userStats')) || {
    height: 175,
    weight: 72,
    bmi: 24,
    bmiCategory: 'Normal'
  };
  
  document.getElementById('displayHeight').textContent = savedStats.height;
  document.getElementById('displayWeight').textContent = savedStats.weight;
  document.getElementById('displayBMI').textContent = savedStats.bmi;
  document.getElementById('bmiCategory').textContent = savedStats.bmiCategory;
  
  // Also populate the edit form with current values
  document.getElementById('editHeight').value = savedStats.height;
  document.getElementById('editWeight').value = savedStats.weight;
}


// Chatbot message
async function sendChatMessage() {
  const input = document.getElementById('chatbot-input');
  const message = input.value.trim();
  if (!message) return;

  const messagesContainer = document.getElementById('chatbot-messages');

  // User message
  const userMsgDiv = document.createElement('div');
  userMsgDiv.className = 'chat-message user-message';
  userMsgDiv.textContent = message;
  messagesContainer.appendChild(userMsgDiv);
  input.value = '';

  // Bot response
  let response;
  if (message.toLowerCase().includes('workout') || message.toLowerCase().includes('exercise')) {
    response = "For workouts, I recommend starting with a 20-minute cardio session followed by strength training. Remember to warm up first!";
  } else if (message.toLowerCase().includes('diet') || message.toLowerCase().includes('food')) {
    response = "A balanced diet should include proteins, complex carbs, and healthy fats. Try to eat whole foods and stay hydrated!";
  } else if (message.toLowerCase().includes('stress') || message.toLowerCase().includes('relax')) {
    response = "Try deep breathing exercises, meditation, or a short walk in nature to reduce stress. Even 5 minutes can help!";
  } else {
    response = "I'm here to help with health and fitness advice. You can ask me about workouts, nutrition, or stress relief techniques.";
  }

  setTimeout(() => {
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'chat-message bot-message';
    botMsgDiv.textContent = response;
    messagesContainer.appendChild(botMsgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 500);
}

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', initApp);