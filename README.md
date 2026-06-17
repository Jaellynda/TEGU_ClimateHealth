# Sentinel Climate Health
### TEGU Systems Climate-Health Protocol (TSCHP)

> **An open-source anticipatory climate-health monitoring platform protecting children in Uganda from climate-driven health risks.**

 **Live Demo:** [https://climate-app.tegusystems.com )]
 **License:** MIT
 **Status:** Active prototype — open source, fully self-hostable

---

## What Is SCHP?

Sentinel Climate Health is a real-time climate-health monitoring dashboard built by **TEGU Systems**, a technology startup registered in Uganda. It simulates and visualises environmental sensor data — PM2.5 air quality, temperature, humidity, and heat index — across primary schools in Uganda, and generates anticipatory health alerts when conditions exceed WHO child-safety thresholds.

The platform is designed to help school administrators, community health workers, and local government officers **act before children get sick**, not after.

> **Why children?** Over 14 million children in Uganda are exposed to worsening air pollution and extreme heat. Climate-sensitive health risks — respiratory illness, heat stress, dehydration — disproportionately affect children under 12 in low-resource school settings. Sentinel Climate Health exists to give those schools an early warning system.

---

## Key Features

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

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                   │
│  Vite + React + TailwindCSS + shadcn/ui              │
│  Deployed on Netlify (free tier)                     │
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
│  Fully self-hostable · Zero proprietary dependencies │
└─────────────────────────────────────────────────────┘
```

**Full open-source stack — frontend to backend. No proprietary dependencies.**

---

## Tech Stack

| Layer | Technology | License |
|---|---|---|
| Frontend Framework | React 18 | MIT |
| Build Tool | Vite | MIT |
| Styling | TailwindCSS | MIT |
| UI Components | shadcn/ui | MIT |
| Backend | Supabase (PostgreSQL) | MIT / Apache 2.0 |
| Sensor Simulation | Custom JavaScript | MIT (this repo) |
| Deployment | Netlify / self-hostable | — |

---

## Data Schema

All tables are defined in Supabase PostgreSQL with Row Level Security enabled and public read access for sensor data.

### sensor_readings
Stores climate sensor readings per school, generated every 30 minutes.

| Field | Type | Description |
|---|---|---|
| `school_id` | text | Unique school identifier |
| `school_name` | text | Human-readable school name |
| `pm25` | float | PM2.5 concentration in μg/m³ |
| `temperature` | float | Ambient temperature in °C |
| `humidity` | float | Relative humidity (%) |
| `heat_index` | float | Calculated heat index in °C |
| `status` | text | `Normal` or `Alert` (WHO thresholds) |
| `timestamp` | timestamptz | ISO 8601 timestamp of reading |
| `created_at` | timestamptz | Auto-generated record timestamp |

**WHO Child-Safe Thresholds:**
- PM2.5 Alert: **> 150 μg/m³**
- Heat Index Alert: **> 39°C**

### dispatch_logs
Records anticipatory medical supply dispatches triggered by sensor alerts.

| Field | Type | Description |
|---|---|---|
| `school_id` | text | Target school |
| `trigger_type` | text | Alert type (pm25 / heat_index) |
| `trigger_value` | float | Sensor reading that triggered dispatch |
| `supplies` | text[] | Array of supplies dispatched |
| `status` | text | Dispatch status |
| `xai_reason` | text | Explainable AI reasoning |
| `priority` | text | Dispatch priority level |

### inventory
Tracks medical supply inventory levels across dispatch hubs.

| Field | Type | Description |
|---|---|---|
| `item_name` | text | Supply item name |
| `category` | text | Supply category |
| `unit` | text | Unit of measurement |
| `stock` | float | Current stock level |
| `min_stock` | float | Minimum threshold |
| `unit_cost` | float | Cost per unit |

---

## Running Locally

### Prerequisites
- Node.js 18+
- npm
- Supabase account (free tier)

### Setup

```bash
git clone https://github.com/Jaellynda/TEGU_ClimateHealth.git
cd TEGU_ClimateHealth
npm install
```

Create `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

```bash
npm run dev
# App runs at http://localhost:5173
```

### Supabase Tables
Run the SQL in `/supabase/schema.sql` in your Supabase SQL editor to create all required tables with RLS policies.

---

## Project Structure

```
TEGU_ClimateHealth/
├── src/
│   ├── api/           # Supabase client bindings
│   ├── components/    # Reusable React UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Supabase client, utility functions, WHO threshold logic
│   ├── pages/         # App page views (Dashboard, Schools, Alerts, Feedback)
│   └── App.jsx        # Root app component with routing
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── LICENSE            # MIT License
```

---

## Roadmap

| Milestone | Timeline | Status |
|---|---|---|
| Frontend source code open-sourced on GitHub | May 2026 | ✅ Complete |
| MIT License applied | May 2026 | ✅ Complete |
| Data schemas publicly documented | May 2026 | ✅ Complete |
| Backend migration: Base44 → Supabase (full open source) | May 2026 | ✅ Complete |
| Live public deployment on Netlify | May 2026 | ✅ Complete |
| Pilot feedback | May–June 2026 | 🔄 In Progress |
| Real IoT sensor integration (low-cost PM2.5 sensors) | Month 6–9 | Planned |
| Expansion to 30+ schools across Uganda | Month 6–12 |  Planned |
| Public API for third-party health data consumers | Month 9–12 |  Planned |
| Edge deployment for low-connectivity environments | Month 9–12 |  Planned |

---

## Open Source Commitment

Sentinel Climate Health is committed to becoming a **Digital Public Good** as defined by the [Digital Public Goods Alliance](https://digitalpublicgoods.net/).

- **Software license:** MIT
- **Data schemas:** CC-BY 4.0
- **Design assets:** CC-BY 4.0
- **Backend:** Supabase (MIT/Apache 2.0) — fully self-hostable, zero vendor lock-in
- **Publicly accessible real-time data:** sensor readings are publicly readable via Supabase RLS policies

Anyone can clone this repository, point it at their own Supabase instance, and run a fully independent deployment with no dependency on TEGU Systems infrastructure.

---

## Monitored Schools (Prototype)

Live sensor coverage across 5 districts in Uganda:

| District | Context |
|---|---|
| **Kampala** | Urban — high traffic pollution exposure |
| **Jinja** | Eastern — industrial zone proximity |
| **Mukono** | Peri-urban — mixed agricultural/urban burning |
| **Entebbe** | Lakeside — elevated humidity and mould risk |
| **Wakiso** | Suburban — dust and biomass burning exposure |

---

## About TEGU Systems

**TEGU Systems** is a technology startup registered in Uganda, building geospatial data infrastructure and climate-health intelligence for East & Central Africa.

**Founded by:** Jael Tegulwa — M.Sc. Data Analytics Engineering, BBA Finance

**Products:**
- **Sentinel Climate Health** — Climate-health monitoring for schools
- **Verify Sentinel** — Geospatial KYC and digital identity verification for East & Central Africa

📧 info@tegusystems.com
🌐 [www.tegusystems.com](https://www.tegusystems.com)
📍 Kampala, Uganda

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

Copyright (c) 2026 TEGU Systems / Jael Nantamu Tegulwa

---

*Built with purpose. Open for impact.*
