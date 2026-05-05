import React, { useState } from 'react';
import { SCHOOLS } from '@/lib/schpData';
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart
} from 'recharts';
import { TrendingUp, Wind, Thermometer, Calendar, Info, Download } from 'lucide-react';

// Generate 30 days of mock historical data per school
function generateHistoricalData(schoolId) {
  const seed = schoolId.charCodeAt(1); // deterministic variance per school
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date('2026-04-15');
    date.setDate(date.getDate() - i);
    const label = date.toLocaleDateString('en-UG', { day: 'numeric', month: 'short' });
    // Simulate a realistic upward trend over the month with variance
    const dayFactor = (29 - i) / 29; // 0 → 1 over 30 days
    const noise = Math.sin(i * seed) * 18 + Math.cos(i * 1.3) * 12;
    const pm25 = Math.max(15, Math.round(45 + dayFactor * 110 + noise + seed * 2));
    const heatIndex = Math.max(26, parseFloat((29 + dayFactor * 14 + Math.sin(i * 0.5) * 2.5 + seed * 0.3).toFixed(1)));
    const humidity = Math.max(50, Math.min(95, Math.round(65 + Math.sin(i * 0.8) * 12)));
    data.push({ date: label, pm25, heatIndex, humidity });
  }
  return data;
}

// Aggregate daily average across all schools
function generateAggregateData() {
  const allData = SCHOOLS.filter(s => s.has_sensor).map(s => generateHistoricalData(s.id));
  return allData[0].map((_, dayIdx) => {
    const pm25Avg = Math.round(allData.reduce((sum, sd) => sum + sd[dayIdx].pm25, 0) / allData.length);
    const heatAvg = parseFloat((allData.reduce((sum, sd) => sum + sd[dayIdx].heatIndex, 0) / allData.length).toFixed(1));
    const humAvg = Math.round(allData.reduce((sum, sd) => sum + sd[dayIdx].humidity, 0) / allData.length);
    return { date: allData[0][dayIdx].date, pm25: pm25Avg, heatIndex: heatAvg, humidity: humAvg };
  });
}

const SCHOOL_COLORS = ['#1B4F72', '#E67E22', '#C0392B', '#1E8449', '#8E44AD', '#2E86C1', '#D4AC0D'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-lg shadow-lg p-3 text-[12px]">
      <p className="font-semibold text-foreground mb-1.5">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold" style={{ color: entry.color }}>{entry.value}{entry.name.includes('PM') ? ' μg/m³' : entry.name.includes('Heat') ? '°C' : '%'}</span>
        </div>
      ))}
    </div>
  );
};

export default function TrendAnalysis() {
  const [view, setView] = useState('aggregate'); // 'aggregate' | 'perSchool'
  const [metric, setMetric] = useState('pm25'); // 'pm25' | 'heatIndex' | 'combined'
  const [selectedSchools, setSelectedSchools] = useState(['s1', 's2', 's3']);

  const aggregateData = generateAggregateData();
  const schoolsWithSensors = SCHOOLS.filter(s => s.has_sensor);

  const toggleSchool = (id) => {
    setSelectedSchools(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  // Thin out labels for x-axis readability (show every 5th)
  const tickFormatter = (val, idx) => idx % 5 === 0 ? val : '';

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#154360] to-[#1B4F72] rounded-xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6 text-[#E67E22]" />
          <h2 className="text-[18px] font-bold">30-Day Climate Trend Analysis</h2>
        </div>
        <p className="text-blue-200 text-[13px]">
          Historical PM2.5 & Heat Index patterns across Uganda sentinel schools · TEGU Systems · Last 30 days · For NGO & policy reporting
        </p>
        <div className="flex flex-wrap gap-3 mt-3">
          {[
            { label: 'Schools Tracked', value: schoolsWithSensors.length },
            { label: 'Data Points', value: `${schoolsWithSensors.length * 30}`, suffix: ' readings' },
            { label: 'Trend Direction', value: '↑ Worsening', bg: 'bg-red-500/20 text-red-200' },
          ].map(({ label, value, suffix = '', bg = 'bg-white/20 text-white' }) => (
            <div key={label} className={`${bg} rounded-lg px-3 py-1.5`}>
              <span className="text-[11px] opacity-80">{label}: </span>
              <span className="text-[13px] font-bold">{value}{suffix}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1.5">
          {[
            { id: 'aggregate', label: 'All Schools (Avg)' },
            { id: 'perSchool', label: 'Per School' },
          ].map(opt => (
            <button key={opt.id} onClick={() => setView(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${view === opt.id ? 'bg-[#1B4F72] text-white' : 'bg-white text-muted-foreground border border-border hover:border-[#1B4F72]'}`}>
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {[
            { id: 'pm25', label: 'PM2.5 Only', icon: Wind },
            { id: 'heatIndex', label: 'Heat Index Only', icon: Thermometer },
            { id: 'combined', label: 'Combined View', icon: TrendingUp },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setMetric(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${metric === id ? 'bg-[#E67E22] text-white' : 'bg-white text-muted-foreground border border-border hover:border-[#E67E22]'}`}>
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Per-school selector */}
      {view === 'perSchool' && (
        <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
          <p className="text-[12px] font-semibold text-[#1B4F72] mb-3">Select Schools to Compare</p>
          <div className="flex flex-wrap gap-2">
            {schoolsWithSensors.map((school, idx) => {
              const active = selectedSchools.includes(school.id);
              return (
                <button key={school.id} onClick={() => toggleSchool(school.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all"
                  style={{
                    backgroundColor: active ? SCHOOL_COLORS[idx % SCHOOL_COLORS.length] + '18' : 'transparent',
                    borderColor: active ? SCHOOL_COLORS[idx % SCHOOL_COLORS.length] : '#e2e8f0',
                    color: active ? SCHOOL_COLORS[idx % SCHOOL_COLORS.length] : '#94a3b8',
                  }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: SCHOOL_COLORS[idx % SCHOOL_COLORS.length] }} />
                  {school.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MAIN CHART: Combined dual-axis */}
      {metric === 'combined' && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[14px] font-semibold text-[#1B4F72]">PM2.5 & Heat Index — Dual Axis (30 Days)</h3>
          </div>
          <p className="text-[11px] text-muted-foreground mb-4">Left axis: PM2.5 μg/m³ · Right axis: Heat Index °C · {view === 'aggregate' ? 'Daily average across all sentinel schools' : 'Selected schools overlaid'}</p>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={view === 'aggregate' ? aggregateData : generateHistoricalData(selectedSchools[0] || 's1')}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={tickFormatter} />
              <YAxis yAxisId="pm25" orientation="left" tick={{ fontSize: 10 }} label={{ value: 'PM2.5 μg/m³', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#1B4F72', dy: 40 }} domain={[0, 'dataMax + 20']} />
              <YAxis yAxisId="heat" orientation="right" tick={{ fontSize: 10 }} label={{ value: 'Heat Index °C', angle: 90, position: 'insideRight', fontSize: 10, fill: '#E67E22', dy: -40 }} domain={[20, 50]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine yAxisId="pm25" y={150} stroke="#C0392B" strokeDasharray="5 3" label={{ value: 'PM2.5 Alert (150)', fontSize: 9, fill: '#C0392B', position: 'right' }} />
              <ReferenceLine yAxisId="heat" y={40} stroke="#E67E22" strokeDasharray="5 3" label={{ value: 'Heat Alert (40°C)', fontSize: 9, fill: '#E67E22', position: 'right' }} />
              <Bar yAxisId="pm25" dataKey="pm25" name="PM2.5" fill="#1B4F72" fillOpacity={0.7} radius={[2, 2, 0, 0]} />
              <Line yAxisId="heat" type="monotone" dataKey="heatIndex" name="Heat Index" stroke="#E67E22" strokeWidth={2.5} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* PM2.5 CHART */}
      {metric === 'pm25' && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-4">
          <h3 className="text-[14px] font-semibold text-[#1B4F72] mb-1">PM2.5 Air Quality — 30-Day Trend</h3>
          <p className="text-[11px] text-muted-foreground mb-4">{view === 'aggregate' ? 'Daily average across all sentinel schools' : 'Per-school comparison — select schools above'}</p>
          <ResponsiveContainer width="100%" height={300}>
            {view === 'aggregate' ? (
              <AreaChart data={aggregateData}>
                <defs>
                  <linearGradient id="pm25Grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B4F72" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1B4F72" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={tickFormatter} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 'dataMax + 20']} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={150} stroke="#C0392B" strokeDasharray="5 3" label={{ value: 'Red Alert Threshold', fontSize: 9, fill: '#C0392B', position: 'right' }} />
                <ReferenceLine y={100} stroke="#E67E22" strokeDasharray="4 3" label={{ value: 'Warning', fontSize: 9, fill: '#E67E22', position: 'right' }} />
                <Area type="monotone" dataKey="pm25" name="PM2.5" stroke="#1B4F72" strokeWidth={2} fill="url(#pm25Grad)" />
              </AreaChart>
            ) : (
              <ComposedChart data={generateHistoricalData(selectedSchools[0] || 's1')}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={tickFormatter} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 'dataMax + 20']} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine y={150} stroke="#C0392B" strokeDasharray="5 3" />
                {selectedSchools.map((sid, idx) => {
                  const school = SCHOOLS.find(s => s.id === sid);
                  return school ? (
                    <Line key={sid} type="monotone" data={generateHistoricalData(sid)}
                      dataKey="pm25" name={school.name.split(' ').slice(0, 2).join(' ')}
                      stroke={SCHOOL_COLORS[idx % SCHOOL_COLORS.length]} strokeWidth={2} dot={false} />
                  ) : null;
                })}
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* HEAT INDEX CHART */}
      {metric === 'heatIndex' && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-4">
          <h3 className="text-[14px] font-semibold text-[#1B4F72] mb-1">Heat Index — 30-Day Trend</h3>
          <p className="text-[11px] text-muted-foreground mb-4">{view === 'aggregate' ? 'Daily average heat index across all sentinel schools' : 'Per-school heat index comparison'}</p>
          <ResponsiveContainer width="100%" height={300}>
            {view === 'aggregate' ? (
              <AreaChart data={aggregateData}>
                <defs>
                  <linearGradient id="heatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E67E22" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#E67E22" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={tickFormatter} />
                <YAxis tick={{ fontSize: 10 }} domain={[24, 50]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={40} stroke="#C0392B" strokeDasharray="5 3" label={{ value: 'Alert Threshold (40°C)', fontSize: 9, fill: '#C0392B', position: 'right' }} />
                <ReferenceLine y={35} stroke="#E67E22" strokeDasharray="4 3" label={{ value: 'Caution (35°C)', fontSize: 9, fill: '#E67E22', position: 'right' }} />
                <Area type="monotone" dataKey="heatIndex" name="Heat Index" stroke="#E67E22" strokeWidth={2.5} fill="url(#heatGrad)" />
              </AreaChart>
            ) : (
              <ComposedChart data={generateHistoricalData(selectedSchools[0] || 's1')}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={tickFormatter} />
                <YAxis tick={{ fontSize: 10 }} domain={[24, 50]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine y={40} stroke="#C0392B" strokeDasharray="5 3" />
                {selectedSchools.map((sid, idx) => {
                  const school = SCHOOLS.find(s => s.id === sid);
                  return school ? (
                    <Line key={sid} type="monotone" data={generateHistoricalData(sid)}
                      dataKey="heatIndex" name={school.name.split(' ').slice(0, 2).join(' ')}
                      stroke={SCHOOL_COLORS[idx % SCHOOL_COLORS.length]} strokeWidth={2} dot={false} />
                  ) : null;
                })}
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            title: 'PM2.5 Monthly Trend',
            icon: Wind,
            color: '#1B4F72',
            value: '+143%',
            desc: 'Average PM2.5 increased from ~45 to ~110 μg/m³ over 30 days',
            badge: 'Worsening',
            badgeColor: 'bg-red-100 text-red-700',
          },
          {
            title: 'Heat Index Trend',
            icon: Thermometer,
            color: '#E67E22',
            value: '+6.2°C',
            desc: 'Average heat index rose from 30°C to 36.2°C over the period',
            badge: 'Elevated',
            badgeColor: 'bg-orange-100 text-orange-700',
          },
          {
            title: 'Alert Threshold Breaches',
            icon: TrendingUp,
            color: '#C0392B',
            value: '18 days',
            desc: 'PM2.5 exceeded 150 μg/m³ on 18 of the last 30 days',
            badge: 'Critical Pattern',
            badgeColor: 'bg-red-100 text-red-700',
          },
        ].map(({ title, icon: Icon, color, value, desc, badge, badgeColor }) => (
          <div key={title} className="bg-white rounded-xl border border-border shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4" style={{ color }} />
              <p className="text-[12px] font-semibold text-foreground">{title}</p>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ color }}>{value}</p>
            <p className="text-[11px] text-muted-foreground mb-2">{desc}</p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>{badge}</span>
          </div>
        ))}
      </div>

      {/* NGO methodology note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info className="w-4 h-4 text-[#1B4F72] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-semibold text-[#1B4F72]">NGO & Policy Use Note</p>
          <p className="text-[12px] text-blue-700 mt-0.5 leading-relaxed">
            These trend charts are designed for UNICEF field teams, Makerere University researchers, and Uganda MOH policy teams to identify seasonally-driven air quality degradation patterns. Data is exportable to DHIS2 and compatible with WHO AQI reporting standards. In production, readings will feed from live AirQo Uganda API nodes with 15-minute granularity.
          </p>
        </div>
      </div>
    </div>
  );
}