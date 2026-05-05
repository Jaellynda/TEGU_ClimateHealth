// Mock data for SCHP prototype — simulates AirQo Uganda API + DHIS2

export const SCHOOLS = [
  { id: "s1", name: "Kampala Parents School", district: "Kampala", lat: 0.3163, lng: 32.5822, student_population: 1350, vulnerability_score: 78, risk_level: "Critical", has_sensor: true },
  { id: "s2", name: "Jinja Central Primary School", district: "Jinja", lat: 0.4244, lng: 33.2041, student_population: 890, vulnerability_score: 65, risk_level: "High", has_sensor: true },
  { id: "s3", name: "Nakasero Primary School", district: "Kampala", lat: 0.3290, lng: 32.5751, student_population: 980, vulnerability_score: 55, risk_level: "Moderate", has_sensor: true },
  { id: "s4", name: "Hormisdallen Day School", district: "Kampala", lat: 0.3355, lng: 32.5690, student_population: 720, vulnerability_score: 45, risk_level: "Moderate", has_sensor: true },
  { id: "s5", name: "Little Stars Tenderness Primary", district: "Kampala", lat: 0.3480, lng: 32.6010, student_population: 640, vulnerability_score: 41, risk_level: "Low", has_sensor: false },
  { id: "s6", name: "Victoria Nile Primary School", district: "Jinja", lat: 0.4389, lng: 33.1987, student_population: 760, vulnerability_score: 60, risk_level: "High", has_sensor: true },
  { id: "s7", name: "Ptarmigan Nursery & Primary", district: "Jinja", lat: 0.4301, lng: 33.2125, student_population: 430, vulnerability_score: 70, risk_level: "High", has_sensor: true },
  { id: "s8", name: "Ebenezer Standard Primary", district: "Jinja", lat: 0.4198, lng: 33.1965, student_population: 510, vulnerability_score: 50, risk_level: "Moderate", has_sensor: true },
];

export const SENSOR_READINGS = [
  { id: "r1", school_id: "s1", school_name: "Kampala Parents School", pm25: 187, temperature: 34.2, humidity: 78, heat_index: 42.1, status: "Red Alert", timestamp: "2026-04-15T08:30:00Z" },
  { id: "r2", school_id: "s2", school_name: "Jinja Central Primary School", pm25: 142, temperature: 36.8, humidity: 82, heat_index: 44.5, status: "Red Alert", timestamp: "2026-04-15T08:28:00Z" },
  { id: "r3", school_id: "s3", school_name: "Nakasero Primary School", pm25: 89, temperature: 31.0, humidity: 70, heat_index: 36.2, status: "Warning", timestamp: "2026-04-15T08:25:00Z" },
  { id: "r4", school_id: "s4", school_name: "Hormisdallen Day School", pm25: 58, temperature: 30.5, humidity: 68, heat_index: 33.8, status: "Caution", timestamp: "2026-04-15T08:20:00Z" },
  { id: "r6", school_id: "s6", school_name: "Victoria Nile Primary School", pm25: 168, temperature: 35.5, humidity: 80, heat_index: 43.0, status: "Red Alert", timestamp: "2026-04-15T08:32:00Z" },
  { id: "r7", school_id: "s7", school_name: "Ptarmigan Nursery & Primary", pm25: 128, temperature: 35.1, humidity: 79, heat_index: 41.6, status: "Warning", timestamp: "2026-04-15T08:26:00Z" },
  { id: "r8", school_id: "s8", school_name: "Ebenezer Standard Primary", pm25: 95, temperature: 32.4, humidity: 74, heat_index: 37.5, status: "Warning", timestamp: "2026-04-15T08:24:00Z" },
];

export const DISPATCH_LOGS = [
  {
    id: "d1", school_id: "s1", school_name: "Kampala Parents School", district: "Kampala",
    trigger_type: "PM2.5 Spike", trigger_value: "PM2.5: 187 μg/m³ (Threshold: 150)",
    supplies: ["Pediatric N95 Masks (500 units)", "Salbutamol Inhalers (50 units)", "Oral Rehydration Salts (200 sachets)"],
    status: "Dispatched", priority: "Critical",
    xai_reason: "Anticipatory Action triggered: PM2.5 reading of 187 μg/m³ at Kampala Parents School exceeds WHO child-safe threshold by 124%. Combined with heat index of 42.1°C, respiratory distress risk for asthmatic children is elevated. Sentinel Engine activated Protocol ALPHA-3.",
    morbidity_forecast: "Forecast: 23% increase in asthma-related emergency visits over next 48 hours. 1,350 students at elevated exposure risk.",
    dispatched_by: "TEGU Dispatch Engine v1.0", created_date: "2026-04-15T08:31:00Z"
  },
  {
    id: "d2", school_id: "s2", school_name: "Jinja Central Primary School", district: "Jinja",
    trigger_type: "Heat Index Alert", trigger_value: "Heat Index: 44.5°C (Threshold: 40°C)",
    supplies: ["Cooling Packs (100 units)", "Oral Rehydration Salts (300 sachets)", "Electrolyte Sachets (200 units)"],
    status: "Pending", priority: "Critical",
    xai_reason: "Anticipatory Action triggered: Heat index of 44.5°C at Jinja Central Primary School exceeds child-safe threshold by 4.5°C. Forecast suggests 15% increase in dehydration-related morbidity over next 48 hours. 890 students identified as vulnerable to heatstroke.",
    morbidity_forecast: "Forecast: 15% increase in dehydration & heatstroke cases. Peak risk window: 10:00–14:00 EAT.",
    dispatched_by: "TEGU Dispatch Engine v1.0", created_date: "2026-04-15T08:29:00Z"
  },
  {
    id: "d3", school_id: "s6", school_name: "Victoria Nile Primary School", district: "Jinja",
    trigger_type: "Combined Alert", trigger_value: "PM2.5: 168 μg/m³ + Heat Index: 43.0°C",
    supplies: ["Pediatric N95 Masks (300 units)", "Antihistamines (100 units)", "Eye Wash Stations (5 units)"],
    status: "Delivered", priority: "High",
    xai_reason: "Combined environmental anomaly detected: PM2.5 (168 μg/m³) and elevated heat index (43.0°C) at Victoria Nile Primary creating compounded health risk. Particulate matter at this concentration causes bronchospasm in children under 12. Combined thermal stress amplifies risk by estimated 2.3x.",
    morbidity_forecast: "Forecast: 18% increase in combined respiratory & heat-related morbidity. 760 students at risk.",
    dispatched_by: "TEGU Dispatch Engine v1.0", created_date: "2026-04-15T07:45:00Z"
  },
];

export const DISTRICT_STATS = [
  { district: "Kampala", schools: 4, alerts: 1, students_at_risk: 2330, dhis2_sync: "Active" },
  { district: "Jinja", schools: 4, alerts: 2, students_at_risk: 2590, dhis2_sync: "Active" },
];

export const MORBIDITY_FORECAST = [
  { condition: "Acute Asthma Exacerbation", baseline: 12, forecast: 15, change: "+23%", severity: "Critical" },
  { condition: "Heatstroke / Hyperthermia", baseline: 5, forecast: 8, change: "+60%", severity: "Critical" },
  { condition: "Allergic Rhinitis", baseline: 28, forecast: 34, change: "+21%", severity: "High" },
  { condition: "Dehydration", baseline: 18, forecast: 22, change: "+22%", severity: "High" },
  { condition: "Eye Irritation (PM exposure)", baseline: 40, forecast: 49, change: "+23%", severity: "Moderate" },
];

export const getRiskColor = (status) => {
  switch (status) {
    case "Red Alert": return "#C0392B";
    case "Warning": return "#E67E22";
    case "Caution": return "#D4AC0D";
    case "Normal": return "#1E8449";
    default: return "#2E86C1";
  }
};

export const getVulnerabilityColor = (score) => {
  if (score >= 70) return "#C0392B";
  if (score >= 50) return "#E67E22";
  if (score >= 30) return "#D4AC0D";
  return "#1E8449";
};

export const getPM25Level = (pm25) => {
  if (pm25 > 150) return { label: "Red Alert", color: "#C0392B" };
  if (pm25 > 100) return { label: "Warning", color: "#E67E22" };
  if (pm25 > 55) return { label: "Caution", color: "#D4AC0D" };
  return { label: "Good", color: "#1E8449" };
};