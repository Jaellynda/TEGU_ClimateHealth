# 🌍 Sentinel Climate Health
### TEGU Systems Climate-Health Protocol (TSCHP)

> **An open-source anticipatory climate-health monitoring platform protecting children in Uganda from climate-driven health risks.**


---

##  What Is This?

Sentinel Climate Health is a real-time climate-health monitoring dashboard built by **TEGU Systems**, a technology startup registered in Uganda. It simulates and visualises environmental sensor data — PM2.5 air quality, temperature, humidity, and heat index — across primary schools in Uganda, and generates anticipatory health alerts when conditions exceed WHO child-safety thresholds.

The platform is designed to help school administrators, community health workers, and local government officers **act before children get sick**, not after.

> **Why children?** Over 14 million children in Uganda are exposed to worsening air pollution and extreme heat. Climate-sensitive health risks — respiratory illness, heat stress, dehydration — disproportionately affect children under 12 in low-resource school settings. Sentinel Climate Health exists to give those schools an early warning system.

---

##  Key Features

| Feature | Description |
|---|---|
| **Real-time Sensor Simulation** | Generates realistic PM2.5, temperature, humidity, and heat index readings every 30 minutes for monitored schools |
| **WHO Threshold Alerts** | Flags when PM2.5 exceeds 150 μg/m³ or heat index exceeds 39°C — thresholds based on WHO child-safe guidelines |
| **Anticipatory Dispatch Modelling** | Models pre-emptive dispatch of medical supplies (masks, ORS, inhalers) to at-risk schools before health incidents occur |
| **Child Morbidity Forecasting** | Projects expected respiratory and dehydration cases based on current climate indicators |
| **School Dashboard** | Live view of all monitored schools with status indicators, location data, and historical trends |
| **Pilot Feedback Collection** | Built-in forms for capturing structured feedback from teachers, parents, and community health workers |
| **Stakeholder Validation** | Tracks stakeholder demo feedback for iterative product improvement |

---

## Architecture

### Current Architecture (Prototype Phase)

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                   │
│  Vite + React + TailwindCSS + shadcn/ui components  │
│  Hosted via Base44 managed hosting                   │
└────────────────────────┬────────────────────────────┘
                         │ Base44 JavaScript SDK
┌────────────────────────▼────────────────────────────┐
│              BACKEND (Base44 BaaS — Prototype)       │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │   Entities   │  │  Functions   │  │   Auth    │  │
│  │  (Database)  │  │ (Serverless) │  │ (Session) │  │
│  └──────────────┘  └──────────────┘  └───────────┘  │
│                                                      │
│  Data Tables:                                        │
│  • SensorReading   • PilotFeedback                  │
│  • StakeholderFeedback                              │
└─────────────────────────────────────────────────────┘
```

### Target Architecture (Open-Source Migration — Month 4 of Investment Period)

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                   │
│  Vite + React + TailwindCSS — unchanged              │
│  Self-hosted or Vercel/Netlify deployment            │
└────────────────────────┬────────────────────────────┘
                         │ Supabase JavaScript SDK
┌────────────────────────▼────────────────────────────┐
│           BACKEND (Supabase — MIT Licensed)          │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │  PostgreSQL  │  │  Edge Fns    │  │  Auth     │  │
│  │  (Database)  │  │  (Deno)      │  │  (JWT)    │  │
│  └──────────────┘  └──────────────┘  └───────────┘  │
│                                                      │
│  Fully self-hostable, zero proprietary dependencies  │
└─────────────────────────────────────────────────────┘
```

> **Note on current backend:** The prototype uses [Base44](https://base44.com) as a managed backend-as-a-service for rapid development and validation. The frontend React code is fully portable. During the UNICEF investment period, we will migrate the backend to **Supabase** (MIT licensed, fully open-source, self-hostable PostgreSQL) by Month 4, making the entire stack end-to-end open source with zero proprietary dependencies.

---

##  Data Schema

All entities are defined as JSON schemas. Every record includes auto-generated `id`, `created_date`, `updated_date`, and `created_by` fields.

### SensorReading
Stores climate sensor readings per school, generated every 30 minutes.

| Field | Type | Description |
|---|---|---|
| `school_id` | string | Unique school identifier |
| `school_name` | string | Human-readable school name |
| `pm25` | number | PM2.5 concentration in μg/m³ |
| `temperature` | number | Ambient temperature in °C |
| `humidity` | number | Relative humidity (%) |
| `heat_index` | number | Calculated heat index in °C |
| `status` | enum | `Normal` or `Alert` (WHO thresholds) |
| `timestamp` | string | ISO 8601 timestamp of reading |

**WHO Child-Safe Thresholds:**
- PM2.5 Alert: **> 150 μg/m³**
- Heat Index Alert: **> 39°C**

### PilotFeedback
Structured feedback from stakeholders during app demonstrations.

| Field | Type | Description |
|---|---|---|
| `name` | string | Respondent full name |
| `role` | enum | Teacher / Parent / School Administrator / Health Worker / Community Member / Government Officer / Other |
| `organization` | string | School or community group |
| `location` | string | District or community |
| `understood_app` | enum | Yes / Mostly / No |
| `would_be_useful` | enum | Very useful / Somewhat useful / Not sure / Not useful |
| `most_useful_feature` | string | Most valuable feature (free text) |
| `what_to_improve` | string | Suggestions (free text) |
| `quote` | string | 1–2 sentence testimonial |
| `consent_to_reference` | boolean | Permission to cite in publications |
| `contact_email` | string | Optional contact |

### StakeholderFeedback
Extended schema for formal stakeholder demonstrations.

| Field | Type | Description |
|---|---|---|
| `name` | string | Full name |
| `role` | string | Title / role |
| `organization` | string | Institution |
| `location` | string | District |
| `understood_app` | boolean | Understood the platform? |
| `would_be_useful` | boolean | Would deploy at their school/org? |
| `usefulness_reason` | string | Reasoning |
| `what_to_improve` | string | Suggestions |
| `quote` | string | Testimonial |
| `consent_to_reference` | boolean | Consent for public reference |
| `contact_email` | string | Optional |
| `contact_phone` | string | Optional |
| `demo_date` | string | YYYY-MM-DD |

---

##  Tech Stack

| Layer | Technology | License |
|---|---|---|
| Frontend Framework | React 18 | MIT |
| Build Tool | Vite | MIT |
| Styling | TailwindCSS | MIT |
| UI Components | shadcn/ui | MIT |
| Backend (prototype) | Base44 BaaS | Proprietary (managed, prototype only) |
| Backend (target) | Supabase | MIT / Apache 2.0 |
| Sensor Simulation | Custom JavaScript | MIT (this repo) |
| Deployment (prototype) | Base44 Hosting | — |
| Deployment (target) | Vercel / Netlify / self-hosted | — |

---

## Project Structure

```
TEGU_ClimateHealth/
├── src/
│   ├── api/           # Base44 SDK entity bindings (to be replaced with Supabase client)
│   ├── components/    # Reusable React UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions, WHO threshold logic
│   ├── pages/         # App page views (Dashboard, Schools, Alerts, Feedback)
│   ├── utils/         # Sensor simulation logic, heat index calculations
│   ├── App.jsx        # Root app component with routing
│   ├── index.css      # Global styles (dark terminal aesthetic)
│   └── main.jsx       # App entry point
├── base44/            # Base44 platform configuration
├── entities/          # JSON schema definitions for all data tables
│   ├── SensorReading.json
│   ├── PilotFeedback.json
│   └── StakeholderFeedback.json
├── functions/         # Serverless backend functions (sensor simulation engine)
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── LICENSE            # MIT License
```

---

## Running Locally

### Prerequisites
- Node.js 18+
- npm
- Base44 account (prototype) — or substitute Supabase credentials

### Setup

```bash
git clone https://github.com/Jaellynda/TEGU_ClimateHealth.git
cd TEGU_ClimateHealth
npm install
```

Create `.env.local`:
```env
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
```

```bash
npm run dev
# App runs at http://localhost:5173
```

---

##  Roadmap & Open-Source Migration Plan

| Milestone | Timeline | Status |
|---|---|---|
| Frontend source code open-sourced on GitHub | May 2026 | ✅ Complete |
| Data schemas publicly documented | May 2026 | ✅ Complete |
| MIT License applied | May 2026 | ✅ Complete |
| Pilot feedback from 3–5 stakeholders | May–June 2026 | 🔄 In Progress |
| Backend migration: Base44 → Supabase | Month 3–4 of investment period | 📅 Planned |
| Full end-to-end open-source stack | Month 4 of investment period | 📅 Planned |
| Real IoT sensor integration (low-cost PM2.5 sensors) | Month 6–9 | 📅 Planned |
| Expansion to 20+ schools across Uganda | Month 6–12 | 📅 Planned |
| Public API for third-party health data consumers | Month 9–12 | 📅 Planned |

---

## Open Source Commitment

Sentinel Climate Health is committed to becoming a **Digital Public Good** as defined by the [Digital Public Goods Alliance](https://digitalpublicgoods.net/).

- **Software license:** MIT
- **Data schemas:** CC-BY 4.0
- **Design assets:** CC-BY 4.0
- **Backend migration target:** Supabase (MIT/Apache 2.0) — fully self-hostable, zero vendor lock-in
- **UNICEF open-source mentorship:** We welcome guidance from the UNICEF Venture Fund open-source team on the most appropriate licensing structure during the investment period.

---

##  Monitored Schools (Prototype)

Simulated sensor coverage across 5 districts in Uganda:

| District | Context |
|---|---|
| **Kampala** | Urban — high traffic pollution exposure |
| **Jinja** | Eastern — industrial zone proximity |
| **Mukono** | Peri-urban — mixed agricultural/urban burning |
| **Entebbe** | Lakeside — elevated humidity and mould risk |
| **Wakiso** | Suburban — dust and biomass burning exposure |

---

## About TEGU Systems

**TEGU Systems** is a technology startup registered in Uganda, building AI-powered data infrastructure for East & Central Africa.

**Founded by:** Jael Tegulwa — M.Sc. Data Analytics Engineering, BBA Finance

**Products:**
- **Sentinel Climate Health** — Climate-health monitoring for schools 
- **Verify Sentinel** — Geospatial KYC and digital identity verification for East & Central Africa

📧 info@[tegusystems.com](https://tegusystems.com)
🌐 [[www.tegusystems.com](https://www.tegusystems.com)](https://www.tegusystems.com)
📍 Kampala, Uganda

---

##  License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

Copyright (c) 2026 TEGU Systems / Jael Nantamu Tegulwa

---

*Built with purpose. Open for impact.*
