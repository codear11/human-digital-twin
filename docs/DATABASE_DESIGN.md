# Human Digital Twin Database Design

## 1. Relational Database Schema Overview
The Human Digital Twin database uses **Prisma ORM** with a strict relational model. It features:
- **Zero data loss & timestamped auditing:** All health, fitness, mental, emotional, educational, financial, and sleep entries are stored as historical time-series records with `recordedAt` timestamps.
- **Strict User Isolation:** Foreign key cascade relationships (`onDelete: Cascade`) bound to `User(id)`.
- **Performance Indexes:** Compound indexes on `(userId, recordedAt)` across historical tables for sub-millisecond analytical aggregations.

## 2. Entity Relationship Model
```mermaid
erDiagram
    User ||--o| Profile : "has one"
    User ||--o{ HealthRecord : "logs"
    User ||--o{ FitnessRecord : "logs"
    User ||--o{ NutritionRecord : "logs"
    User ||--o{ MentalHealthRecord : "logs"
    User ||--o{ EmotionalRecord : "logs"
    User ||--o{ PersonalityRecord : "logs"
    User ||--o{ SocialRecord : "logs"
    User ||--o{ EducationRecord : "logs"
    User ||--o{ CareerRecord : "logs"
    User ||--o{ FinancialRecord : "logs"
    User ||--o{ SleepRecord : "logs"
    User ||--o{ Habit : "defines"
    User ||--o{ HabitLog : "tracks"
    User ||--o{ Goal : "sets"
    User ||--o{ AIReport : "receives"
    Habit ||--o{ HabitLog : "records"
```

## 3. Data Dictionary

### User
| Field | Type | Attributes | Description |
|---|---|---|---|
| `id` | String (UUID) | `@id, @default(uuid())` | Primary key |
| `email` | String | `@unique` | Unique login credential |
| `passwordHash` | String | | bcrypt hashed password |
| `name` | String | | Display name of the user |
| `createdAt` | DateTime | `@default(now())` | Account creation timestamp |
| `updatedAt` | DateTime | `@updatedAt` | Account modification timestamp |

### Profile
| Field | Type | Description |
|---|---|---|
| `id` | String (UUID) | Primary key |
| `userId` | String | Foreign key to `User.id`, `@unique` |
| `age` | Int? | Chronological age |
| `gender` | String? | Male, Female, Non-Binary, Other |
| `height` | Float? | Height in cm |
| `weight` | Float? | Weight in kg |
| `bloodGroup` | String? | e.g. A+, O-, etc. |
| `dob` | DateTime? | Date of birth |
| `occupation` | String? | Current occupation |
| `education` | String? | Highest degree / program |
| `emergencyContact` | String? | Verified phone / contact string |
| `bio` | String? | Personal twin bio |

### HealthRecord
| Field | Type | Description |
|---|---|---|
| `id` | String (UUID) | Primary key |
| `userId` | String | Foreign key to User |
| `recordedAt` | DateTime | Timestamp of observation |
| `heartRate` | Int? | Current pulse in BPM |
| `restingHeartRate` | Int? | Basal resting pulse in BPM |
| `bloodPressureSys` | Int? | Systolic blood pressure (mmHg) |
| `bloodPressureDia` | Int? | Diastolic blood pressure (mmHg) |
| `oxygenLevel` | Float? | SpO2 percentage (e.g. 98.5%) |
| `bloodSugar` | Float? | Fasting blood glucose (mg/dL) |
| `cholesterol` | Float? | Total cholesterol (mg/dL) |
| `bmi` | Float? | Calculated Body Mass Index (kg/m²) |
| `muscleMass` | Float? | Skeletal muscle percentage / kg |
| `boneDensity` | Float? | DEXA T-score |
| `skinHealth` | Int? | Skin vitality indicator (0-100) |
| `healthScore` | Float? | Calculated dimension score (0-100) |

### FitnessRecord
| Field | Type | Description |
|---|---|---|
| `steps` | Int? | Step count |
| `walkingDistance` | Float? | Distance in kilometers |
| `activeCalories` | Float? | Calories burned through activity |
| `inactiveTime` | Float? | Sedentary duration in hours |
| `waterIntake` | Float? | Hydration in liters |
| `fitnessScore` | Float? | Calculated fitness dimension score |

### MentalHealthRecord & EmotionalRecord
- **Mental:** Stress level (0-100), anxiety self-assessment (0-100), burnout self-assessment (0-100), depression screening (PHQ-9 0-27 scale converted), relaxation index, mindfulness index.
- **Emotional:** Happiness, sadness, anger, fear, confidence, motivation, excitement percentages, dominant mood label.

### EducationRecord, CareerRecord, FinancialRecord, SleepRecord
- Structured records capturing skills, study hours, monthly financials (income, expenses, savings, budget, investments), and sleep architecture (total hours, bedtime, wake time, sleep quality %, deep/REM sleep percentages).

### Habits & HabitLog
- Configurable habits with target frequencies (`daily`, `weekdays`, `weekends`) and daily binary completion logs with continuous streak tracking.

### Goals
- Category-based quantifiable goals with targets, current values, units, deadlines, priorities, and completion states.

### AIReport
- Persisted historical intelligence reports with executive summary, multidimensional observations, actionable suggestions, predictive trends, and composite twin snapshot score.

---

## 4. Switching Between SQLite and PostgreSQL
The application is designed to be database-agnostic through Prisma:
- **Development (default):** SQLite embedded database (`file:./dev.db`) requires no service installation.
- **Production (PostgreSQL):** Change `provider = "postgresql"` in `prisma/schema.prisma` and provide `DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"`. Run `npx prisma db push` or `npx prisma migrate deploy`.
