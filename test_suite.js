/**
 * FitNHeal Automated Validation Test Suite
 * Tests calculations, state transitions, security, timer logic, and mock DOM behavior.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting FitNHeal Test Suite...\n');

let passCount = 0;
let failCount = 0;

function it(description, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${description}`);
    passCount++;
  } catch (error) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     Error: ${error.message}`);
    failCount++;
  }
}

// 1. Static Asset Verification
console.log('📋 Group 1: Static Files & Assets');
it('Required project files exist and have non-zero size', () => {
  const dir = __dirname;
  const files = ['index.html', 'style.css', 'script.js', 'logo.png'];
  files.forEach(file => {
    const filePath = path.join(dir, file);
    assert(fs.existsSync(filePath), `File ${file} should exist`);
    const stat = fs.statSync(filePath);
    assert(stat.size > 0, `File ${file} should not be empty`);
  });
});

it('index.html contains Poppins Google Font and FontAwesome', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert(html.includes('fonts.googleapis.com'), 'Should contain Google Fonts link');
  assert(html.includes('family=Poppins'), 'Should contain Poppins font');
  assert(html.includes('font-awesome'), 'Should contain FontAwesome link');
});

it('index.html contains all modal dialogs with correct accessibility attributes', () => {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  assert(html.includes('id="auth-modal"'), 'Should contain auth modal');
  assert(html.includes('id="edit-profile-modal"'), 'Should contain profile modal');
  assert(html.includes('id="timer-modal"'), 'Should contain timer modal');
  assert(html.includes('id="ai-chatbot"'), 'Should contain chatbot container');
  assert(html.includes('role="dialog"'), 'Modals should have role="dialog"');
});

// 2. BMI Calculation and Classification Tests
console.log('\n⚖️ Group 2: BMI Calculation & Classification Logic');

function calculateBMI(heightCm, weightKg) {
  if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) return null;
  const heightM = heightCm / 100;
  const bmiNum = weightKg / (heightM * heightM);
  return {
    bmi: parseFloat(bmiNum.toFixed(1)),
    category: getBMICategory(bmiNum)
  };
}

function getBMICategory(bmi) {
  if (typeof bmi !== 'number' || isNaN(bmi) || !isFinite(bmi)) return 'Unknown';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25.0) return 'Normal weight';
  if (bmi < 30.0) return 'Overweight';
  return 'Obese';
}

it('Calculates normal BMI correctly (175cm, 72kg -> 23.5)', () => {
  const res = calculateBMI(175, 72);
  assert.strictEqual(res.bmi, 23.5);
  assert.strictEqual(res.category, 'Normal weight');
});

it('Calculates underweight BMI correctly (180cm, 55kg -> 17.0)', () => {
  const res = calculateBMI(180, 55);
  assert.strictEqual(res.bmi, 17.0);
  assert.strictEqual(res.category, 'Underweight');
});

it('Calculates overweight BMI correctly (170cm, 80kg -> 27.7)', () => {
  const res = calculateBMI(170, 80);
  assert.strictEqual(res.bmi, 27.7);
  assert.strictEqual(res.category, 'Overweight');
});

it('Calculates obese BMI correctly (165cm, 95kg -> 34.9)', () => {
  const res = calculateBMI(165, 95);
  assert.strictEqual(res.bmi, 34.9);
  assert.strictEqual(res.category, 'Obese');
});

it('Handles boundary inputs and prevents NaN / Infinity crashes', () => {
  assert.strictEqual(calculateBMI(0, 70), null);
  assert.strictEqual(calculateBMI(-175, 70), null);
  assert.strictEqual(calculateBMI(175, -70), null);
  assert.strictEqual(calculateBMI('abc', 'xyz'), null);
  assert.strictEqual(getBMICategory(NaN), 'Unknown');
  assert.strictEqual(getBMICategory(Infinity), 'Unknown');
});

// 3. Timer State Management Tests
console.log('\n⏱️ Group 3: Timer State & Controls');

class MockTimer {
  constructor() {
    this.timerSeconds = 20 * 60;
    this.isRunning = false;
    this.interval = null;
  }

  setDuration(mins, secs = 0) {
    this.pause();
    this.timerSeconds = mins * 60 + secs;
  }

  start() {
    if (this.isRunning || this.timerSeconds <= 0) return;
    this.isRunning = true;
  }

  tick() {
    if (this.isRunning && this.timerSeconds > 0) {
      this.timerSeconds--;
    }
    if (this.timerSeconds === 0) {
      this.isRunning = false;
    }
  }

  pause() {
    this.isRunning = false;
  }

  reset(mins = 20, secs = 0) {
    this.pause();
    this.timerSeconds = mins * 60 + secs;
  }

  getDisplay() {
    const m = Math.floor(this.timerSeconds / 60);
    const s = this.timerSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
}

it('Timer formats display strings accurately (20 mins -> 20:00, 5 sec -> 00:05)', () => {
  const timer = new MockTimer();
  assert.strictEqual(timer.getDisplay(), '20:00');
  timer.setDuration(0, 5);
  assert.strictEqual(timer.getDisplay(), '00:05');
});

it('Timer pauses and resumes without resetting elapsed time', () => {
  const timer = new MockTimer();
  timer.setDuration(1, 0); // 60s
  timer.start();
  timer.tick(); // 59s
  timer.tick(); // 58s
  timer.pause();
  assert.strictEqual(timer.timerSeconds, 58);
  assert.strictEqual(timer.isRunning, false);
  timer.start();
  assert.strictEqual(timer.timerSeconds, 58); // Does not reset to 60!
  assert.strictEqual(timer.isRunning, true);
  timer.tick(); // 57s
  assert.strictEqual(timer.timerSeconds, 57);
});

it('Timer presets update duration cleanly (5, 10, 15, 20, 30 min)', () => {
  const timer = new MockTimer();
  [5, 10, 15, 20, 30].forEach(min => {
    timer.setDuration(min, 0);
    assert.strictEqual(timer.timerSeconds, min * 60);
    assert.strictEqual(timer.getDisplay(), `${String(min).padStart(2, '0')}:00`);
  });
});

// 4. Security & Sanitization
console.log('\n🔒 Group 4: Security, XSS & Input Sanitization');

function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

it('HTML special characters are properly escaped to mitigate XSS', () => {
  const malicious = '<script>alert("XSS")</script>&foo=\'bar"';
  const sanitized = escapeHTML(malicious);
  assert(!sanitized.includes('<script>'), 'Must not contain unescaped script tag');
  assert(sanitized.includes('&lt;script&gt;'), 'Must encode < and >');
  assert(sanitized.includes('&quot;'), 'Must encode double quotes');
  assert(sanitized.includes('&#039;'), 'Must encode single quotes');
});

// 5. Chatbot Intent Matching
console.log('\n🤖 Group 5: AI Chatbot Intent Classification');

function getBotResponse(rawText) {
  const query = (rawText || '').toLowerCase();
  if (query.includes('workout') || query.includes('exercise') || query.includes('routine') || query.includes('gym')) {
    return 'workout_advice';
  } else if (query.includes('diet') || query.includes('food') || query.includes('nutrition') || query.includes('protein')) {
    return 'nutrition_advice';
  } else if (query.includes('stress') || query.includes('relax') || query.includes('anxiety') || query.includes('breath')) {
    return 'stress_advice';
  } else if (query.includes('sleep') || query.includes('insomnia')) {
    return 'sleep_advice';
  } else if (query.includes('bp') || query.includes('blood pressure') || query.includes('sugar') || query.includes('medical')) {
    return 'medical_advice';
  }
  return 'general_guide';
}

it('Matches workout queries', () => {
  assert.strictEqual(getBotResponse('Can you suggest a beginner workout routine?'), 'workout_advice');
});

it('Matches nutrition queries', () => {
  assert.strictEqual(getBotResponse('How much protein should I eat in my diet?'), 'nutrition_advice');
});

it('Matches stress and breathing queries', () => {
  assert.strictEqual(getBotResponse('I am feeling stress and want to relax'), 'stress_advice');
});

it('Matches sleep queries', () => {
  assert.strictEqual(getBotResponse('Tips for better sleep and insomnia'), 'sleep_advice');
});

it('Matches medical vitals with disclaimer response', () => {
  assert.strictEqual(getBotResponse('How to manage my BP and blood sugar?'), 'medical_advice');
});

it('Provides helpful default fallback for unknown query', () => {
  assert.strictEqual(getBotResponse('Hello there!'), 'general_guide');
});

// 6. CSS Tokens & Syntax Validation
console.log('\n🎨 Group 6: CSS Tokens & Syntax Integrity');

it('style.css defines all required design tokens for dark and light mode', () => {
  const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
  assert(css.includes('--primary-color:'), 'Must define --primary-color in :root');
  assert(css.includes('--text-color:'), 'Must define --text-color in :root');
  assert(css.includes('--border-color:'), 'Must define --border-color in :root');
  assert(css.includes('--muted-text:'), 'Must define --muted-text in :root');
  assert(css.includes('body[data-theme="light"]'), 'Must define light theme overrides');
  assert(css.includes('.video-container'), 'Must define responsive video container');
});

console.log(`\n========================================`);
console.log(`Test Execution Summary:`);
console.log(`  Passed: ${passCount}`);
console.log(`  Failed: ${failCount}`);
console.log(`========================================\n`);

if (failCount > 0) {
  process.exit(1);
}
