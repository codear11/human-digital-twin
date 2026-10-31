# Human Digital Twin — AI-Powered Multi-Dimensional Replica

An intelligent, multi-dimensional digital representation and personal analytics platform. The system models, quantifies, evaluates, and predicts personal wellness, cognitive endurance, and behavioral progress across all dimensions of a human being.

![Human Digital Twin](https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Architecture & Highlights

- **Decoupled Architecture:** Clean separation of concerns between client (`client/`) and server (`server/`).
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Recharts, Lucide Icons, React Hook Form, and Zod.
- **Backend:** Node.js, Express, TypeScript, REST API, Zod request validation, JWT authentication, and centralized error handling.
- **Database & ORM:** Prisma ORM with 17 normalized relational models. Configured with SQLite for instant zero-configuration local development (`file:./dev.db`) and 100% compatible with PostgreSQL for production.
- **Transparent Mathematical Scoring Engine:** Mathematically sound 0–100 scores for every dimension with full calculation transparency, data sufficiency validation, and no arbitrary numbers.
- **Dual-Mode AI Engine:** OpenAI GPT integration for holistic reports and predictive forecasts, with a local deterministic heuristic fallback when no API key is provided.
- **Automated Testing Suite:** 100% test pass rate with Vitest and Supertest across unit, scoring, and integration tests.

---

## 📐 The 11 Core Digital Twin Dimensions

| Dimension | Measured Biometrics & Parameters | Transparent Scoring Formula |
|---|---|---|
| **1. Physical Health** | Heart rate, Resting HR, Blood Pressure (Sys/Dia), SpO2, Blood Sugar, Cholesterol, BMI | Weighted combination of vitals relative to clinical baselines |
| **2. Fitness & Lifestyle** | Daily steps, walking distance (km), active calories, hydration (L), sedentary time | 10k step benchmark (40%), active burn (25%), hydration (20%), inactivity penalty (15%) |
| **3. Sleep Tracking** | Duration, bedtime, wake-up time, sleep quality %, deep sleep ratio | Optimal duration curve (7–9h) (50%), quality % (35%), deep sleep % (15%) |
| **4. Nutrition & Diet** | Meal records, caloric balance, protein, carbohydrates, fats, variety score | Caloric target adherence (40%), protein target (35%), dietary variety (25%) |
| **5. Mental Health** | Perceived stress, anxiety self-assessment, burnout level, mindfulness | Inverted stress (30%), inverted anxiety (25%), burnout resilience (25%), mindfulness (20%) |
| **6. Emotional Health** | Happiness, confidence, motivation, excitement, sadness, anger, fear, dominant mood | Positivity index (avg positive 70%) balanced against distress penalty (30%) |
| **7. Personality Profile** | Extroversion/Introversion type, openness, stability, communication, leadership, teamwork | Arithmetic average across self-reported behavioral indices (non-diagnostic) |
| **8. Social Relationships** | Family bond strength, friendship score, social engagement, interaction frequency | Composite average of social cohesion and interaction consistency |
| **9. Education & Skills** | Learning progress %, skill development %, daily study hours, technical & coding skills | Weighted progress: learning progress (40%), skill growth (35%), study time (25%) |
| **10. Career Readiness** | Resume strengths, project portfolio count, certifications, target role | Milestone assessment based on portfolio depth, certifications, and self-readiness |
| **11. Financial Health** | Monthly income, expenses, savings rate, budget compliance, investments | Savings rate (>=20% = 100) (60%) and budget compliance ratio (40%) |
| **Daily Habit System** | Custom habits, daily completion, continuous streaks, longest streaks | Daily completion rate (80%) + streak consistency bonus (20%) |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### 1. Installation
Clone or open the repository, then install all dependencies:
```bash
npm run install:all
```
*(Or install inside `server` and `client` individually: `cd server && npm install`, `cd client && npm install`)*

### 2. Database Initialization
From the `server/` directory:
```bash
cd server
npx prisma generate
npx prisma db push
```

### 3. Load Rich Demo Profile (Optional but Recommended)
Populate the database with a pre-configured digital twin replica (Ada Lovelace, 7-day vitals, fitness history, sleep metrics, habits, and goals):
```bash
npm run seed
```
**Demo Credentials:**
- **Email:** `demo@digitaltwin.ai`
- **Password:** `DigitalTwin2026!`

### 4. Run Development Servers
From the root directory:
```bash
npm run dev
```
This concurrently starts:
- Backend REST API: `http://localhost:5000`
- Frontend Vite Application: `http://localhost:5173`

Or run them in separate terminals:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

---

## 🧪 Testing & Verification

Run automated tests:
```bash
# Backend unit and integration tests (Vitest + Supertest)
cd server
npm test

# Client smoke tests
cd client
npm test
```

Build production bundles:
```bash
# Backend build
cd server
npm run build

# Frontend build
cd client
npm run build
```

---

## 📁 Repository Structure
```
Human-Digital-Twin/
├── client/                     # Frontend Application (React 18 + Vite + TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI cards, gauges, stat widgets, modals, alerts
│   │   ├── context/            # AuthContext (JWT session management)
│   │   ├── layouts/            # DashboardLayout (protected) & AuthLayout
│   │   ├── pages/              # Dashboard, Analytics, Habits, Goals, AIReports, Profile, ModuleDetail
│   │   ├── services/           # REST API client with auto-injected Bearer tokens
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Route definitions
│   │   ├── main.tsx            # React DOM mounting
│   │   └── index.css           # Tailwind design tokens & glassmorphism
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── server/                     # Backend API (Node.js + Express + TypeScript + Prisma)
│   ├── src/
│   │   ├── config/             # Prisma client singleton, environment variables
│   │   ├── controllers/        # Auth, Profile, 11 Dimensions, Habits, Goals, Dashboard, AI
│   │   ├── middleware/         # JWT Auth, Zod Validation, Centralized Error Handling
│   │   ├── routes/             # REST route endpoints
│   │   ├── services/           # Transparent Scoring Engine & Dual-Mode AI Service
│   │   ├── validators/         # Zod schemas for all request payloads
│   │   ├── seed.ts             # Demo data generator
│   │   └── app.ts              # Express initialization
│   ├── prisma/
│   │   └── schema.prisma       # 17 normalized relational models
│   └── package.json
│
├── docs/                       # Technical Documentation
│   ├── ARCHITECTURE.md         # Full architecture and flow diagrams
│   ├── API_DOCUMENTATION.md    # REST API endpoint specifications
│   └── DATABASE_DESIGN.md      # Relational schema and data dictionary
├── legacy_backup/              # Safe non-destructive backup of original prototype
├── .env.example
├── .gitignore
├── DEVELOPMENT_PROGRESS.md
├── README.md
└── package.json                # Monorepo concurrent runner
```

---

## 🔒 Security & Privacy Notes

- Passwords are encrypted using `bcryptjs` with 10 salt rounds.
- All protected API routes enforce strict user isolation: `userId` is extracted strictly from verified JWT tokens, preventing unauthorized cross-user queries.
- Transparent mathematical scoring guarantees that missing values remain incomplete rather than fabricated.
- AI insights include non-medical disclaimers and do not substitute for professional medical or financial advice.
