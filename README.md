# FitNHeal — Medical Wellness & Fitness Hub

> **Live demo:** https://fitnheal.vercel.app  
> **Source code:** https://github.com/DeepakNandhakumar/FitNHeal

FitNHeal is a browser-based wellness and fitness dashboard that brings everyday health tracking, fitness planning, nutrition exploration, and self-care tools into one interface. It is built with HTML, CSS, and vanilla JavaScript, with a responsive dashboard and dark/light theme support.

## Contents

- [Live Demo](#live-demo)
- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [How It Works](#how-it-works)
- [Run Locally](#run-locally)
- [Deployment](#deployment)
- [Current Scope and Limitations](#current-scope-and-limitations)
- [Privacy and Health Disclaimer](#privacy-and-health-disclaimer)
- [Future Improvements](#future-improvements)

## Live Demo

**Try FitNHeal:** https://fitnheal.vercel.app

The deployed site is a front-end prototype. Some features use browser-side state and sample content; the project does not currently provide a production backend or verified medical decision-making.

## Project Overview

FitNHeal combines two main areas:

- **Medical wellness:** symptom information, personal vitals and medication tracking, first-aid guidance, sleep and eye-care tools, and stress-relief exercises.
- **Fitness and nutrition:** biometric calculations, hydration tracking, workout planning and timers, food/macronutrient exploration, activity habits, and a printable personal report.

The aim is to make common wellness and fitness utilities accessible from a single dashboard rather than separate tools.

## Features

### Medical and wellness tools

- Symptom guidance for selected common concerns, with self-care suggestions and warning-sign information.
- Browser-based logging interfaces for blood pressure, blood glucose, pulse, oxygen saturation, and medication schedules.
- Breathing and relaxation experiences, including visual breathing pacing and generated audio where supported by the browser.
- Sleep-cycle planning helpers.
- First-aid information and a CPR metronome-style guide.
- A 20-20-20 screen-break timer and eye-care routine.

### Fitness and nutrition tools

- Fitness dashboard with height, weight, BMI and BMR calculations.
- Hydration tracker with daily goal progress.
- Workout generator with target areas, equipment choices, and fitness-level options.
- Interval workout interface with work/rest phases.
- Food search and nutrition information for calories and macronutrients.
- Calorie, macronutrient, one-repetition-maximum (1RM), and target-heart-rate calculators.
- Habit and challenge tracking interfaces.
- Printable health and fitness summary.

### Dashboard and usability

- Medical/Fitness mode switch.
- Dark and light themes.
- Search across available wellness, exercise, food, and first-aid content.
- Sign-in/sign-up interface for prototype demonstration.
- Profile and goal editing.
- Feedback form and FitNHeal wellness/fitness chat interface.
- Responsive layout for desktop and smaller screens.

> Feature availability and data persistence depend on the current browser-side implementation. Treat health and nutrition values as informational estimates, not diagnoses or personalized medical prescriptions.

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and accessible interface elements |
| CSS3 | Layout, responsive styling, themes, and visual effects |
| Vanilla JavaScript | UI interactions, calculations, timers, and browser-side state |
| Chart.js | Dashboard charts (loaded from a CDN) |
| Font Awesome | Interface icons (loaded from a CDN) |
| Google Fonts | Typography (loaded from Google Fonts) |
| Vercel | Static website hosting and deployment |

This repository is currently a **static front-end project**. It does not use a Node package manifest as its application runtime and does not currently include a connected API server or database.

## How It Works

1. The browser loads `index.html`.
2. `style.css` provides the layout, responsive styles, and theme presentation.
3. `script.js` handles dashboard interactions, calculations, navigation, timers, and other client-side behavior.
4. Browser storage may be used for selected preferences or prototype data, depending on the feature.

## Run Locally

### Option 1: Open the page

Open `index.html` in a modern browser. Some browser features and external CDN assets may work best when the page is served locally.

### Option 2: Use a local static server

If Node.js is installed, run these commands from the project directory:

```bash
npx serve .
```

Open the local URL printed by the server.

## Deployment

The project is deployed on Vercel and connected to this GitHub repository.

- **Production site:** https://fitnheal.vercel.app
- **GitHub repository:** https://github.com/DeepakNandhakumar/FitNHeal
- **Vercel project dashboard:** https://vercel.com/deepakdeepak01452-3139s-projects/fitnheal

Updates pushed to the configured production branch can trigger a Vercel deployment.

## Current Scope and Limitations

- **Prototype authentication:** the sign-in/sign-up interface is for demonstration and is not a secure account system. Do not use real passwords or sensitive personal information.
- **No production backend/database:** data is not currently backed by a server-side account system or shared database.
- **Browser-local data:** clearing browser storage, using another browser, or switching devices may remove or separate locally stored information.
- **Chat interface:** do not assume the assistant is connected to a live AI model or that its responses are medically validated.
- **Informational calculations:** BMI, BMR, calorie, macro, and training-zone values are estimates and may not fit every individual.
- **External assets:** Google Fonts, Font Awesome, and Chart.js are loaded from third-party CDNs and may require an internet connection.
- **Testing status:** automated and end-to-end test results should be considered unverified unless they are run and documented for the current commit.

## Privacy and Health Disclaimer

FitNHeal is an educational wellness and fitness project, not a medical device or a substitute for professional care. It does not diagnose conditions or replace a qualified clinician. For emergencies, contact local emergency services. Consult a qualified healthcare professional before making treatment, medication, or major exercise changes.

Until secure server-side authentication, access control, and data protection are implemented and reviewed, **do not enter real medical records, sensitive health information, or real account credentials**.

## Future Improvements

- Add a secure backend API, database, and real authentication with password hashing and session/token controls.
- Replace demo-only sign-in and chatbot behavior with clearly defined, tested services.
- Add automated functional tests and browser-based end-to-end testing.
- Improve accessibility, input validation, error handling, and mobile testing.
- Add clear provenance and review dates for medical content, plus stronger safety guidance for urgent symptoms.
- Document deployment environment variables and release checks if a backend is introduced.

---

Made as a wellness and fitness web application prototype.
