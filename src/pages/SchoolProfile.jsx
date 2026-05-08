import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  SCHOOLS, SENSOR_READINGS, DISPATCH_LOGS, getPM25Level, getVulnerabilityColor
} from '@/lib/schpData';
import {
  ArrowLeft, Radio, Wind, Thermometer, Droplets, Users, Shield,
  Package, CheckCircle, Clock, Truck, AlertTriangle, Activity,
  MapPin, TrendingUp, BarChart2
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

// Generate history for a school over a given number of days (deterministic)
function generateHistory(schoolId, currentReading, days = 14) {
  const seed = schoolId.charCodeAt(1);
  const data = [];
  // For year view, aggregate into weekly points
  const points = days > 90 ? Math.round(days / 7) : days;
  const step = days > 90 ? 7 : 1;
  for (let i = points - 1; i >= 0; i--) {
    const date = new Date('2026-05-08');
    date.setDate(date.getDate() - i * step);
    const label = days > 90
      ? date.toLocaleDateString('en-UG', { day: 'numeric', month: 'short' })
      : days > 14
        ? date.toLocaleDateString('en-UG', { day: 'numeric', month: 'short' })
        : date.toLocaleDateString('en-UG', { weekday: 'short', day: 'numeric' });
    const noise = Math.sin(i * seed) * 20 + Math.cos(i * 1.3) * 10;
    const base = currentReading ? currentReading.pm25 : 80;
    const heatBase = currentReading ? currentReading.heat_index : 35;
    const dayFactor = (points - 1 - i) / (points - 1);
    const pm25 = Math.max(15, Math.round(base * 0.5 + dayFactor * base * 0.6 + noise));
    const heatIndex = parseFloat((heatBase * 0.75 + dayFactor * heatBase * 0.3 + Math.sin(i * 0.5) * 1.5).toFixed(1));
    data.push({ date: label, pm25, heatIndex });
  }
  return data;
}

const RANGE_OPTIONS = [
  { id: 'week',  label: '7 Days',  days: 7 },
  { id: 'month', label: '30 Days', days: 30 },
  { id: 'year',  label: '1 Year',  days: 365 },
];

const STATUS_CONFIG = {
  Pending:    { color: 'text-yellow-700', bg: 'bg-yellow-100', icon: Clock },
  Dispatched: { color: 'text-blue-700',   bg: 'bg-blue-100',   icon: Truck },
  Delivered:  { color: 'text-green-700',  bg: 'bg-green-100',  icon: CheckCircle },
  Acknowledged: { color: 'text-purple-700', bg: 'bg-purple-100', icon: CheckCircle },
};

function SensorGauge({ label, value, unit, icon: Icon, color, max, thresholds }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-3xl font-bold mb-1" style={{ color }}>{value}<span className="text-[14px] ml-1 font-normal text-muted-foreground">{unit}</span></p>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
        <span>0</span>
        {thresholds.map(t => <span key={t.label} style={{ color: t.color }}>{t.label}</span>)}
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default function SchoolProfile() {
  const { schoolId } = useParams();
  const [historyMetric, setHistoryMetric] = useState('pm25');
  const [historyRange, setHistoryRange] = useState('week');

  const school = SCHOOLS.find(s => s.id === schoolId);
  const reading = SENSOR_READINGS.find(r => r.school_id === schoolId);
  const dispatches = DISPATCH_LOGS.filter(d => d.school_id === schoolId);
  const rangeDays = RANGE_OPTIONS.find(r => r.id === historyRange)?.days || 7;
  const history = generateHistory(schoolId, reading, rangeDays);

  if (!school) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">School not found.</p>
        <Link to="/" className="text-[#1B4F72] font-semibold mt-2 inline-block">← Back to Map</Link>
      </div>
    );
  }

  const pm25Level = reading ? getPM25Level(reading.pm25) : null;
  const vulnColor = getVulnerabilityColor(school.vulnerability_score);
  const isAlert = reading?.status === 'Red Alert' || reading?.status === 'Warning';

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Back + header */}
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-[#1B4F72] mb-3 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Map
        </Link>
        <div className={`rounded-xl p-5 text-white ${isAlert ? 'bg-gradient-to-r from-red-700 to-[#C0392B]' : 'bg-gradient-to-r from-[#154360] to-[#1B4F72]'}`}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-orange-300" />
                <h2 className="text-[20px] font-bold">{school.name}</h2>
              </div>
              <p className="text-blue-200 text-[13px]">{school.district} District · Node {school.id.toUpperCase()}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-white/20 rounded-lg px-3 py-1 text-[12px]">
                  <Users className="w-3 h-3 inline mr-1" />{school.student_population.toLocaleString()} students
                </span>
                <span className="bg-white/20 rounded-lg px-3 py-1 text-[12px]">
                  Vulnerability: <strong>{school.vulnerability_score}/100</strong>
                </span>
                <span className="bg-white/20 rounded-lg px-3 py-1 text-[12px]">
                  Risk: <strong>{school.risk_level}</strong>
                </span>
                <span className={`rounded-lg px-3 py-1 text-[12px] font-bold ${school.has_sensor ? 'bg-green-500/30 text-green-200' : 'bg-gray-500/30 text-gray-300'}`}>
                  <Radio className="w-3 h-3 inline mr-1" />{school.has_sensor ? 'Sensor Active' : 'No Sensor'}
                </span>
              </div>
            </div>
            {reading && (
              <div className={`px-4 py-3 rounded-xl text-center border-2 ${
                reading.status === 'Red Alert' ? 'bg-red-900/40 border-red-400' :
                reading.status === 'Warning' ? 'bg-orange-900/40 border-orange-400' :
                'bg-white/10 border-white/20'
              }`}>
                <p className="text-[11px] uppercase tracking-wide opacity-80 mb-0.5">Current Status</p>
                <p className="text-[18px] font-bold">{reading.status}</p>
                {reading.status === 'Red Alert' && <AlertTriangle className="w-5 h-5 text-red-300 mx-auto mt-1 animate-pulse" />}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live sensor readings */}
      {reading ? (
        <div>
          <h3 className="text-[14px] font-semibold text-[#1B4F72] mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Live Sensor Readings
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <SensorGauge
              label="PM2.5" value={reading.pm25} unit=" μg/m³"
              icon={Wind} color={pm25Level?.color || '#1B4F72'} max={250}
              thresholds={[{ label: '55', color: '#D4AC0D' }, { label: '150', color: '#C0392B' }]}
            />
            <SensorGauge
              label="Heat Index" value={reading.heat_index} unit="°C"
              icon={Thermometer} color={reading.heat_index > 42 ? '#C0392B' : reading.heat_index > 38 ? '#E67E22' : '#D4AC0D'}
              max={50} thresholds={[{ label: '34', color: '#D4AC0D' }, { label: '42', color: '#C0392B' }]}
            />
            <SensorGauge
              label="Temperature" value={reading.temperature} unit="°C"
              icon={Thermometer} color="#2E86C1" max={45}
              thresholds={[{ label: '30', color: '#E67E22' }]}
            />
            <SensorGauge
              label="Humidity" value={reading.humidity} unit="%"
              icon={Droplets} color="#1B4F72" max={100}
              thresholds={[{ label: '70', color: '#E67E22' }, { label: '85', color: '#C0392B' }]}
            />
          </div>
        </div>
      ) : (
        <div className="bg-muted/40 rounded-xl p-6 text-center text-muted-foreground text-[13px] border border-border">
          No sensor installed at this school · Planned deployment Q3 2026
        </div>
      )}

      {/* 14-day climate history chart */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="text-[14px] font-semibold text-[#1B4F72] flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Climate History
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-1">
              {RANGE_OPTIONS.map(r => (
                <button key={r.id} onClick={() => setHistoryRange(r.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    historyRange === r.id ? 'bg-[#E67E22] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/70'
                  }`}>
                  {r.label}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              {[{ id: 'pm25', label: 'PM2.5' }, { id: 'heatIndex', label: 'Heat Index' }].map(m => (
                <button key={m.id} onClick={() => setHistoryMetric(m.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    historyMetric === m.id ? 'bg-[#1B4F72] text-white' : 'bg-muted text-muted-foreground hover:bg-muted/70'
                  }`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={history}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={historyMetric === 'pm25' ? '#1B4F72' : '#E67E22'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={historyMetric === 'pm25' ? '#1B4F72' : '#E67E22'} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v, i) => {
              const step = historyRange === 'year' ? 4 : historyRange === 'month' ? 5 : 1;
              return i % step === 0 ? v : '';
            }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            {historyMetric === 'pm25' && (
              <ReferenceLine y={150} stroke="#C0392B" strokeDasharray="4 3"
                label={{ value: 'Alert', fontSize: 9, fill: '#C0392B', position: 'right' }} />
            )}
            {historyMetric === 'heatIndex' && (
              <ReferenceLine y={40} stroke="#C0392B" strokeDasharray="4 3"
                label={{ value: '40°C Alert', fontSize: 9, fill: '#C0392B', position: 'right' }} />
            )}
            <Area
              type="monotone"
              dataKey={historyMetric}
              name={historyMetric === 'pm25' ? 'PM2.5 μg/m³' : 'Heat Index °C'}
              stroke={historyMetric === 'pm25' ? '#1B4F72' : '#E67E22'}
              strokeWidth={2}
              fill="url(#areaGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Dispatch history */}
      <div>
        <h3 className="text-[14px] font-semibold text-[#1B4F72] mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" /> Dispatch History
          <span className="text-[11px] bg-[#1B4F72]/10 text-[#1B4F72] px-2 py-0.5 rounded-full font-normal">{dispatches.length} orders</span>
        </h3>
        {dispatches.length === 0 ? (
          <div className="bg-muted/30 rounded-xl p-5 text-center text-[13px] text-muted-foreground border border-border">
            No dispatches recorded for this school yet.
          </div>
        ) : (
          <div className="space-y-3">
            {dispatches.map(d => {
              const sc = STATUS_CONFIG[d.status] || STATUS_CONFIG.Pending;
              const StatusIcon = sc.icon;
              return (
                <div key={d.id} className="bg-white rounded-xl border border-border shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[13px] font-bold text-[#1B4F72]">{d.trigger_type}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          d.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                          d.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>{d.priority}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mb-2">{d.trigger_value}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {d.supplies?.map((s, i) => (
                          <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded-full border border-border text-muted-foreground">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${sc.bg} self-start`}>
                      <StatusIcon className={`w-3.5 h-3.5 ${sc.color}`} />
                      <span className={`text-[11px] font-semibold ${sc.color}`}>{d.status}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border text-[11px] text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                    <span>By: {d.dispatched_by}</span>
                    {d.created_date && <span>{new Date(d.created_date).toLocaleString('en-UG', { timeZone: 'Africa/Kampala' })} EAT</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* School metadata */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-4">
        <h3 className="text-[13px] font-semibold text-[#1B4F72] mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4" /> School Profile
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[12px]">
          {[
            { label: 'District', value: school.district },
            { label: 'Students', value: school.student_population.toLocaleString() },
            { label: 'Risk Level', value: school.risk_level },
            { label: 'Vulnerability Score', value: `${school.vulnerability_score}/100` },
            { label: 'Sensor Status', value: school.has_sensor ? 'Active (AirQo)' : 'Not Installed' },
            { label: 'Coordinates', value: `${school.lat.toFixed(4)}, ${school.lng.toFixed(4)}` },
            { label: 'Total Dispatches', value: dispatches.length },
            { label: 'Node ID', value: school.id.toUpperCase() },
          ].map(({ label, value }) => (
            <div key={label} className="bg-muted/30 rounded-lg p-2.5 border border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
              <p className="font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}