import React from 'react';
import { MORBIDITY_FORECAST, SENSOR_READINGS, SCHOOLS } from '@/lib/schpData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ReferenceLine } from 'recharts';
import { TrendingUp, Activity, Users, AlertTriangle, Info } from 'lucide-react';

const SEVERITY_COLORS = { Critical: '#C0392B', High: '#E67E22', Moderate: '#D4AC0D', Low: '#1E8449' };

const TREND_DATA = [
  { day: 'Day -3', asthma: 10, dehydration: 15, heatstroke: 4 },
  { day: 'Day -2', asthma: 11, dehydration: 16, heatstroke: 4 },
  { day: 'Day -1', asthma: 12, dehydration: 17, heatstroke: 5 },
  { day: 'Today', asthma: 14, dehydration: 19, heatstroke: 6 },
  { day: '+24h (F)', asthma: 16, dehydration: 21, heatstroke: 7 },
  { day: '+48h (F)', asthma: 18, dehydration: 24, heatstroke: 9 },
];

const DISTRICT_DATA = [
  { district: 'Kampala', risk: 78, students: 2110 },
  { district: 'Jinja', risk: 65, students: 1400 },
  { district: 'Mukono', risk: 55, students: 980 },
  { district: 'Wakiso', risk: 41, students: 640 },
  { district: 'Entebbe', risk: 32, students: 720 },
];

export default function MorbidityForecasts() {
  const totalStudentsAtRisk = SCHOOLS.reduce((sum, s) => sum + s.student_population, 0);

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#154360] to-[#1B4F72] rounded-xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6 text-[#E67E22]" />
          <h2 className="text-[18px] font-bold">Predictive Morbidity Forecasts</h2>
        </div>
        <p className="text-blue-200 text-[13px]">
          Climate-sensitive disease projection based on environmental sensor data · 48-hour forecast window · {totalStudentsAtRisk.toLocaleString()} students monitored
        </p>
      </div>

      {/* Forecast Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-[14px] font-semibold text-[#1B4F72]">48-Hour Disease Burden Forecast</h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">Predicted case increases based on current air quality & heat anomalies</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {['Condition', 'Baseline Cases/Day', 'Forecast Cases/Day', '48h Change', 'Severity'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wide px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MORBIDITY_FORECAST.map((row) => (
                <tr key={row.condition} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-foreground">{row.condition}</p>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground">{row.baseline}</td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-bold" style={{ color: SEVERITY_COLORS[row.severity] }}>{row.forecast}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[12px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{row.change}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{
                      backgroundColor: SEVERITY_COLORS[row.severity] + '20',
                      color: SEVERITY_COLORS[row.severity]
                    }}>
                      {row.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trend Line */}
        <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
          <h3 className="text-[13px] font-semibold text-[#1B4F72] mb-1">Case Trajectory · 6-Day Window</h3>
          <p className="text-[11px] text-muted-foreground mb-3">Observed + Forecasted (F) daily cases</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={TREND_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine x="Today" stroke="#E67E22" strokeDasharray="4 4" />
              <Line type="monotone" dataKey="asthma" stroke="#C0392B" strokeWidth={2} dot={{ r: 3 }} name="Asthma" />
              <Line type="monotone" dataKey="dehydration" stroke="#E67E22" strokeWidth={2} dot={{ r: 3 }} name="Dehydration" />
              <Line type="monotone" dataKey="heatstroke" stroke="#1B4F72" strokeWidth={2} dot={{ r: 3 }} name="Heatstroke" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* District Risk */}
        <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
          <h3 className="text-[13px] font-semibold text-[#1B4F72] mb-1">District Vulnerability Index</h3>
          <p className="text-[11px] text-muted-foreground mb-3">Composite risk score by district (0–100)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DISTRICT_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis dataKey="district" type="category" tick={{ fontSize: 10 }} width={60} />
              <Tooltip contentStyle={{ fontSize: 12 }} formatter={(v) => [`${v}/100`, 'Risk Score']} />
              <Bar dataKey="risk" fill="#1B4F72" radius={[0, 4, 4, 0]}
                label={{ position: 'right', fontSize: 10, fill: '#666' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Methodology Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info className="w-4 h-4 text-[#1B4F72] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-[#1B4F72]">Forecast Methodology</p>
          <p className="text-[12px] text-blue-700 mt-0.5 leading-relaxed">
            Forecasts are generated by the Sentinel Rule-Based XAI Engine using current PM2.5 and Heat Index sensor readings from AirQo nodes. Baselines are derived from Uganda Ministry of Health district-level morbidity data. In production, forecasts will be enhanced with historical DHIS2 data and a trained ML model. All data is open-source and DHIS2-exportable.
          </p>
        </div>
      </div>
    </div>
  );
}