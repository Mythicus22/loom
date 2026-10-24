# QuestPath — AI-Powered Gamified Learning Roadmap Platform

**QuestPath** is an AI-powered, gamified learning roadmap platform built with **React**, **Node.js (Express)**, **MongoDB (Mongoose)**, and **Tailwind CSS**. It transforms any learning ambition into a personalized, interactive RPG quest skill tree inspired by roadmap.sh and role-playing games.

---

## 🌟 Architectural Philosophy: Reusable Master Roadmaps

The core architectural principle of QuestPath is:

> **Generate reusable master roadmaps, not completely new roadmaps for every user.**

- **Matching & Reuse**: When a learner inputs a goal, QuestPath normalizes the query, classifies its domain, and evaluates token & alias similarity against the shared database. If a sufficiently good match exists, it retrieves and reuses the master roadmap.
- **Personalization Layer**: Personalizes the schedule, milestone dates, starting node (e.g. testing out of basics if Intermediate or Advanced), resource formats, and optional branches for that individual learner.
- **Novel Goal Generation & Validation**: If no suitable master roadmap exists in the database, the server generates a brand-new roadmap following strict schema requirements, validates all nodes, stages, and links, and persists it to the shared MongoDB database for future learners.

---

## 🎨 Visual Design & RPG Aesthetics

- **Background**: Near-black (`#08090D`) with subtle radial gradients and an authentic RPG grid pattern.
- **Cards & Panels**: Charcoal (`#11131A` / `#161923`) with glassmorphism and thin borders (`#232736`).
- **Primary Accent**: Electric Violet (`#8B5CF6`) with soft neon glows.
- **Secondary Accent**: Cyan (`#22D3EE`) for links, telemetry, and active elements.
- **Node States in Skill Tree**:
  - **Completed (Cleared)**: Green/cyan checkmark with subdued emerald glow.
  - **Current Quest (Active)**: Prominent violet/cyan animated ripple pulse (`active-quest-pulse`) and level badge.
  - **Available (Unlocked)**: Accessible with hover glow.
  - **Locked**: Muted charcoal appearance with lock icon and prerequisite requirements.
  - **Optional Branch**: Visually distinguished with dashed lines and purple badges.

---

## 🚀 Key Features

### 1. AI Chatbot-Style Homepage
- Opens directly into a clean, futuristic AI conversation interface.
- Large glowing prompt with suggested goal chips.
- Adaptive 5-step conversational questionnaire asked **one at a time**:
  1. Current knowledge & experience (`Beginner` / `Intermediate` / `Advanced`)
  2. Weekly time availability (`5h`, `10h`, `20h`, `35h+`)
  3. Target deadline / timeline (`4w`, `8w`, `12w`, `16w+`)
  4. Preferred format (`Mixed`, `Hands-on`, `Videos`, `Reading`)
  5. Desired outcome (`Practical Projects`, `Interviews`, `Job-Ready`, `Conceptual`)
- Editable Learner Blueprint summary before launching.
- Multi-step animated generation progress indicator.

### 2. Interactive RPG Quest Map (Skill Tree)
- Rendered with smooth cubic Bezier connector paths.
- Interactive pan, zoom in/out, fit to screen, and stage filtering tabs.
- Switchable between **RPG Graph View** and **Vertical Quest Stream** (optimized for mobile).

### 3. Quest Detail Drawer
- Side panel with quest level, XP bounty, and estimated time.
- "Why This Quest Matters" and "Target Abilities & Outcomes".
- Curated learning resources with title, source badge, format badge, duration, verified links, and bookmarking.
- Practical Quest Challenge with instructions, acceptance criteria, and starter code with copy-to-clipboard.

### 4. Interactive Assessment Engine
- Lightweight quizzes with instant feedback, scoring, and technical explanations.
- Practical coding / GitHub project submission field.
- Confetti celebration (`canvas-confetti`) on passing!
- Actionable feedback and retry path on fail.

### 5. Context-Aware AI Learning Mentor
- Embedded floating assistant with full context of current quest, active goal, and completed nodes.
- **3-Tier User-Controlled Help Progression**:
  - 💡 **Hint**: Conceptual clue without spoiling the answer.
  - 🔍 **Example**: Code pattern illustration.
  - 🛠️ **Guided Solution**: Complete step-by-step walkthrough.
- Quick prompts: "Explain simpler", "Why is this needed?", "Practice question".

### 6. Gamification & Forgiving Streak System
- **Leveling Curve**: Novice Explorer (Lvl 1) → Apprentice Quester (Lvl 2) → Adept Architect (Lvl 3) → Specialist Vanguard (Lvl 4) → Master Developer (Lvl 5) → Grandmaster Sage (Lvl 6).
- **Streak & Shield**: Daily learning streak with **Streak Freeze Protection** (missed days do not break streak if shield is armed).
- **Daily Quests**: Rotating daily tasks awarding bonus XP.
- **Trophies & Badges**: Unlocked for milestones like "First Quest Cleared", "Quiz Virtuoso", "Momentum Builder", and "Legendary Finisher".

### 7. Explore & My Journey Pages
- **Explore Roadmaps**: Searchable, filterable library of shared master roadmaps with category tabs and preview modal.
- **My Journey**: Active and saved roadmaps with schedule adjustment modal (recalculates milestone dates without losing progress).
- **Progress Analytics**: Skill mastery radar, quiz scores history table, and trophy showcase.

---

## 🗄️ Database & Models (MongoDB + Mongoose)

1. `MasterRoadmap`: Canonical goal, aliases, domain, difficulty, stages, nodes, edges, tags, and version.
2. `UserPlan`: User ID, master roadmap reference, personalized schedule, milestone dates, customizations (skipped/priority/optional nodes), status.
3. `UserProgress`: Completed nodes, verified mastery nodes, bookmarked resources, assessment attempts, XP, level, streak, daily quests, and achievements.

---

## 💻 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, Mongoose, MongoDB Memory Server (embedded zero-dependency fallback) / external MongoDB Atlas support via `MONGODB_URI`.
- **Environment**: Linux (Ubuntu 24.04).

---

## 📦 Running Locally

1. **Install dependencies**:
   ```bash
   npm --prefix server install
   npm --prefix client install
   ```

2. **Start Backend Server**:
   ```bash
   node server/src/index.js
   # Runs on http://localhost:5000 (API & production static serving)
   ```

3. **Start Frontend Dev Server (Optional for hot reload)**:
   ```bash
   npm --prefix client run dev
   # Runs on http://localhost:3000 (proxies /api to port 5000)
   ```
