# FitNHeal - Unified Medical Wellness & Peak Fitness Hub

FitNHeal is a modern, full-featured web application that bridges clinical preventative health with athletic performance and nutrition tracking. Built with high-performance Vanilla JavaScript, CSS Glassmorphism design tokens, and Web Audio API synthesizers.

---

## 🌟 Key Features & Ecosystem

### 🏥 1. Medical & Wellness Hub
- **Interactive Symptom Advisor & Body Triage**: Interactive body-part symptom picker (Headache, Digestion/GERD, Lumbar Strain, Eye Strain, Chronic Fatigue, Joint Pain) with immediate clinical action protocols, herbal remedies, and red-flag alerts.
- **Clinical Vitals & BP Logger**: Track Blood Pressure (Systolic/Diastolic with AHA classification), Blood Glucose (Fasting & Postprandial), Pulse (BPM), and SpO2 (%) with color-coded history logs.
- **Medication & Daily Supplement Manager**: Add prescription medicines or vitamins (dosage, morning/lunch/night schedule), check off daily doses, and track streaks.
- **Mind Sanctuary & De-Stress Studio**:
  - **Visual Breathing Pacer**: Box Breathing (4-4-4-4) & Relaxing (4-7-8) with an animated glowing orb and phase guides.
  - **Procedural Audio Synthesizers**: 100% Web Audio API procedural sound generators for Gentle Rain (Pink Noise), Ocean Waves, and a 432 Hz Zen Singing Bowl tone.
- **Circadian Sleep & REM Optimizer**: Calculates 90-minute REM sleep cycles to determine optimal bedtime and wake-up times without sleep inertia.
- **Emergency First Aid & CPR Metronome**: Interactive 110 BPM CPR compression metronome with visual pulsing heart, Heimlich maneuver guide, burn care, and one-tap emergency numbers (112 / 108 / 911).
- **Eye Care 20-20-20 Timer**: Active screen break timer with audio chime to prevent digital eye strain, paired with a 3-minute ocular yoga routine.

---

### 💪 2. Fitness & Athletic Hub
- **Executive Biometric Dashboard**: Real-time BMI, BMR (Mifflin-St Jeor), Daily Calorie and Protein target gauges, 12-month weight trends, and active workout minute charts.
- **Interactive Hydration Tracker**: Log water intake with clickable glass cups (250ml per tap), visual water bottle fill animation, and daily 3.0L goal.
- **Smart Custom Workout Generator**: Filter by target muscle (Full Body, Chest/Triceps, Back/Biceps, Legs, Abs, HIIT), equipment (Bodyweight, Dumbbells, Commercial Gym), and level -> Generates complete set/rep schemes with form cues.
- **Live Interval Workout Trainer**: Full-screen interactive interval trainer with 45s Work / 15s Rest cycles, audio countdown beeps (3, 2, 1, GO!), next-up exercise previews, and completion celebration.
- **Food Calorie & Nutrition Explorer**: Searchable database of 50+ verified foods (proteins, carbs, fats, Indian staples) with calorie and macro breakdowns and a 1-click "Add to Today's Plate" button.
- **Exercise Video Encyclopedia**: Master key compound lifts (Squat, Deadlift, Bench Press, Mobility) with video tutorials and form cues.
- **All-in-One Fitness Calculators**: 1-Rep Max (1RM) Brzycki calculator and Target Heart Rate training zones (Fat Burn, Aerobic, Anaerobic, VO2 Max).
- **30-Day Challenges & Habit Tracker**: Interactive daily habit checklist with streak counters and achievement milestone badges.

---

### 🤖 3. AI Health Coach & Executive Tools
- **FitNHeal AI Assistant 2.0**: Evidence-based workout coach and nutrition guide with quick prompt chips.
- **Comprehensive Printable Health Report**: One-click printable medical summary card for personal records and doctor consultations.
- **Universal Search Engine**: Search across exercises, recipes, symptom guides, and emergency tools with real-time dropdown filtering.
- **Dark & Light Mode**: Seamless theme switcher with persistent local storage.

---

## 🚀 Running the Project

Open `index.html` directly in any modern web browser or serve locally:
```bash
# Optional: run with local server
npx serve .
```

### Running Validation Tests
```bash
node test_suite.js
node dom_test.js
```
Both test suites validate 100% of DOM IDs, state transitions, security sanitization, and mathematical logic.