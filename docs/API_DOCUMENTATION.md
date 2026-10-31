# Human Digital Twin REST API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require the HTTP Header:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "Jane Doe"
}
```
- **Response (201 Created):**
```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": "uuid-v4",
    "email": "user@example.com",
    "name": "Jane Doe"
  }
}
```

### Login
- **POST** `/auth/login`
- **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```
- **Response (200 OK):**
```json
{
  "token": "eyJhbGciOi...",
  "user": { ... }
}
```

### Current User
- **GET** `/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):** User object with profile.

---

## 2. Profile Endpoints

### Get Profile
- **GET** `/profile`
- **Response (200 OK):** User profile attributes including age, gender, height, weight, bloodGroup, dob, occupation, education, emergencyContact.

### Update Profile
- **PUT** `/profile`
- **Request Body:**
```json
{
  "age": 25,
  "gender": "Female",
  "height": 168,
  "weight": 62,
  "bloodGroup": "O+",
  "dob": "1999-05-14",
  "occupation": "Software Engineer",
  "education": "B.Tech Computer Science",
  "emergencyContact": "+1 555-019-2834",
  "bio": "Building my digital twin"
}
```

---

## 3. Core Personal Dimension Modules (CRUD & Time-Series)

Each of the 11 modules provides:
- `GET /<module>`: Retrieves latest record and historical time-series logs.
- `POST /<module>`: Records a new timestamped log with automatic dimension score calculation.

| Module | Endpoints | Key Fields |
|---|---|---|
| Physical Health | `GET/POST /health` | heartRate, restingHeartRate, bloodPressureSys, bloodPressureDia, oxygenLevel, bloodSugar, cholesterol, bmi, muscleMass |
| Fitness | `GET/POST /fitness` | steps, walkingDistance, activeCalories, inactiveTime, waterIntake |
| Nutrition | `GET/POST /nutrition` | mealType, mealDescription, calories, protein, carbs, fat |
| Mental Health | `GET/POST /mental` | stressLevel, anxietyLevel, burnoutLevel, depressionScreeningScore, relaxationLevel, mindfulnessLevel |
| Emotional Health | `GET/POST /emotional` | happiness, sadness, anger, fear, confidence, motivation, excitement, dominantMood |
| Personality | `GET/POST /personality` | personalityType, openness, emotionalStability, communication, leadership, teamwork, adaptability |
| Social | `GET/POST /social` | familyBond, friendshipScore, socialEngagement, interactionsCount |
| Education | `GET/POST /education` | learningProgress, skillDevelopment, studyTimeHours, technicalSkills, softSkills, codingSkills |
| Career | `GET/POST /career` | resumeStrengths, projectExperience, certificationsCount, targetRole, industry |
| Financial | `GET/POST /financial` | monthlyIncome, monthlyExpenses, monthlySavings, monthlyBudget, investments |
| Sleep | `GET/POST /sleep` | sleepDurationHours, bedtime, wakeTime, sleepQuality, deepSleepPercent, remSleepPercent |

---

## 4. Habits & Goals Endpoints

### Habits
- `GET /habits` – List all habits for the authenticated user with current streaks and today's status.
- `POST /habits` – Create a new habit (`name`, `category`, `targetFrequency`, `targetTime`).
- `POST /habits/:id/toggle` – Toggle completion for a specific date (calculates streaks automatically).
- `DELETE /habits/:id` – Deactivate/remove habit.

### Goals
- `GET /goals` – List goals with progress calculations.
- `POST /goals` – Create a goal (`category`, `title`, `targetValue`, `unit`, `deadline`, `priority`).
- `PUT /goals/:id/progress` – Update current value (`currentValue`).
- `PATCH /goals/:id/status` – Update goal status (`IN_PROGRESS`, `COMPLETED`, `ABANDONED`).

---

## 5. Unified Dashboard & Analytics Endpoints

### Unified Twin Overview
- **GET** `/dashboard/overview`
- **Response:**
  - `twinScore`: Overall composite replica health score (0–100).
  - `completeness`: Percentage of dimensions with active data.
  - `scores`: Individual scores for all 11 dimensions with calculation basis and data status (`available` or `incomplete`).
  - `recentActivity`: Aggregated stream of latest logs.
  - `quickStats`: Highlight cards (e.g. resting HR, daily steps, sleep quality, savings rate).
  - `alerts`: Actionable wellness notices (e.g. high stress detected, sleep deficit, hydration target reached).

### Historical Analytics
- **GET** `/analytics/trends?range=7d|30d|90d`
- **Response:** Multi-dimensional aligned time-series for Recharts line charts and radar charts.

---

## 6. AI Reports & Predictive Insights

### Generate Report
- **POST** `/ai/generate`
- **Request Body:**
```json
{
  "reportType": "HOLISTIC_TWIN" // or "WEEKLY_SUMMARY", "MONTHLY_SUMMARY", "PREDICTIVE_INSIGHT"
}
```
- **Response:**
  - `summary`: High-level holistic synthesis of the human twin.
  - `observations`: Identified patterns across dimensions.
  - `recommendations`: Actionable steps for wellness and balance.
  - `predictions`: Data-backed trend forecasts.
  - `source`: `"OPENAI_GPT"` or `"LOCAL_HEURISTIC"`.

### Get Saved Reports
- **GET** `/ai/reports` – List past reports with timestamps and snapshot scores.
