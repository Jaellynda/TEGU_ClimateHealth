import React, { useState } from 'react';
import {
  Radio, MapPin, CheckCircle, XCircle, AlertCircle,
  CheckSquare, Square, Zap, Thermometer, Wind, Activity,
  RefreshCw, ShieldCheck, Flame
} from 'lucide-react';
import { SCHOOLS, SENSOR_READINGS, getPM25Level, getVulnerabilityColor } from '@/lib/schpData';

// Reference AirQo stations (simulated)
const AIRQO_REFERENCE = {
  Kampala: { station: 'Kampala City Centre AirQo Ref', pm25: 172, heat_index: 41.0 },
  Jinja: { station: 'Jinja Town AirQo Ref', pm25: 138, heat_index: 43.2 },
  Wakiso: { station: 'Wakiso District AirQo Ref', pm25: 88, heat_index: 35.5 },
  Mukono: { station: 'Mukono Central AirQo Ref', pm25: 74, heat_index: 33.0 },
  Entebbe: { station: 'Entebbe Airport AirQo Ref', pm25: 62, heat_index: 31.5 },
};

// H3 IDs per school (deterministic mock)
const H3_IDS = {
  s1: '892261c0d6bffff', s2: '8922c3d8d99ffff', s3: '892261c0d67ffff',
  s4: '892261c0d63ffff', s5: '892261c0d6fffff', s6: '8922c3d8d93ffff',
  s7: '8922c3d8d91ffff', s8: '8922c3d8d97ffff',
};

// Sensor states per school (mock)
const SENSOR_STATES = {
  s1: 'Alerting', s2: 'Alerting', s3: 'Online', s4: 'Online',
  s5: 'Offline', s6: 'Alerting', s7: 'Calibrating', s8: 'Online',
};

// Heat resilience scores (mock)
const HEAT_RESILIENCE = {
  s1: 28, s2: 35, s3: 52, s4: 60, s5: 71, s6: 32, s7: 45, s8: 55,
};

const SENSOR_BADGE = {
  Online:      { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500' },
  Calibrating: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-400' },
  Alerting:    { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200',     dot: 'bg-red-500 animate-pulse' },
  Offline:     { bg: 'bg-zinc-100',   text: 'text-zinc-500',   border: 'border-zinc-200',    dot: 'bg-zinc-400' },
};

const GEO_STATUS = {
  Verified:  { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50'  },
  Pending:   { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  Mismatch:  { icon: XCircle,     color: 'text-red-600',    bg: 'bg-red-50'    },
};

function SensorStatusBadge({ status }) {
  const cfg = SENSOR_BADGE[status] || SENSOR_BADGE.Offline;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function DeltaBadge({ delta }) {
  const abs = Math.abs(delta);
  const pct = abs.toFixed(0);
  if (abs <= 10) return <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">±{pct}% ✓</span>;
  if (abs <= 25) return <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">±{pct}% ⚠</span>;
  return <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">±{pct}% ✗</span>;
}

function SchoolCard({ school, reading, selected, onToggle, verified, onVerify, verifying }) {
  const sensorState = SENSOR_STATES[school.id] || 'Offline';
  const h3id = H3_IDS[school.id] || 'unknown';
  const heatResilience = HEAT_RESILIENCE[school.id] || 50;
  const vulnColor = getVulnerabilityColor(school.vulnerability_score);
  const pm25Level = reading ? getPM25Level(reading.pm25) : null;
  const ref = AIRQO_REFERENCE[school.district];

  const geoStatusKey = verified === true ? 'Verified' : verified === false ? 'Mismatch' : 'Pending';
  const GeoCfg = GEO_STATUS[geoStatusKey];
  const GeoIcon = GeoCfg.icon;

  // Delta vs reference (if verified)
  const pm25Delta = reading && ref ? ((reading.pm25 - ref.pm25) / ref.pm25) * 100 : null;

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${selected ? 'border-emerald-400 ring-1 ring-emerald-300' : 'border-zinc-200'}`}>
      {/* Card Header */}
      <div className={`px-4 py-3 flex items-start justify-between gap-2 ${GeoCfg.bg}`}>
        <div className="flex items-start gap-2 min-w-0">
          <button onClick={() => onToggle(school.id)} className="mt-0.5 text-zinc-400 hover:text-zinc-700 flex-shrink-0">
            {selected ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4" />}
          </button>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-zinc-900 truncate">{school.name}</p>
            <p className="text-[10px] text-zinc-500">{school.district} District</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <GeoIcon className={`w-4 h-4 ${GeoCfg.color}`} />
          <span className={`text-[10px] font-bold ${GeoCfg.color}`}>{geoStatusKey}</span>
        </div>
      </div>

      {/* H3 + Sensor Row */}
      <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-zinc-400" />
          <span className="font-mono text-[10px] text-zinc-500">{h3id}</span>
        </div>
        <SensorStatusBadge status={sensorState} />
      </div>

      {/* Air Quality + Heat */}
      <div className="px-4 py-3 grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Wind className="w-3 h-3 text-zinc-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wide">PM2.5</span>
          </div>
          {reading ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-[15px] font-bold" style={{ color: pm25Level?.color }}>{reading.pm25}</span>
              <span className="text-[10px] text-zinc-400">μg/m³</span>
              {verified && pm25Delta !== null && <DeltaBadge delta={pm25Delta} />}
            </div>
          ) : (
            <span className="text-[12px] text-zinc-400">No data</span>
          )}
        </div>

        <div>
          <div className="flex items-center gap-1 mb-1">
            <Thermometer className="w-3 h-3 text-zinc-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Heat Index</span>
          </div>
          {reading ? (
            <span className="text-[15px] font-bold text-orange-600">{reading.heat_index}°C</span>
          ) : (
            <span className="text-[12px] text-zinc-400">No data</span>
          )}
        </div>

        {/* Vulnerability */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <ShieldCheck className="w-3 h-3 text-zinc-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Vulnerability</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-bold" style={{ color: vulnColor }}>{school.vulnerability_score}</span>
            <span className="text-[10px] text-zinc-400">/100</span>
          </div>
        </div>

        {/* Heat Resilience */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Flame className="w-3 h-3 text-zinc-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-wide">Heat Resilience</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[15px] font-bold ${heatResilience >= 60 ? 'text-green-600' : heatResilience >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
              {heatResilience}
            </span>
            <span className="text-[10px] text-zinc-400">/100</span>
          </div>
        </div>
      </div>

      {/* Reference station (shown after verify) */}
      {verified && ref && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-100 text-[10px] text-blue-700">
          Ref: <strong>{ref.station}</strong> · PM2.5 {ref.pm25} μg/m³ · HI {ref.heat_index}°C
        </div>
      )}

      {/* Action */}
      <div className="px-4 py-3 border-t border-zinc-100">
        {school.has_sensor ? (
          <button
            onClick={() => onVerify(school.id)}
            disabled={verifying === school.id}
            className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-[11px] font-semibold rounded-lg transition-colors"
          >
            {verifying === school.id ? (
              <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Comparing with AirQo Ref...</>
            ) : verified ? (
              <><CheckCircle className="w-3.5 h-3.5" /> Re-Verify Sensor Accuracy</>
            ) : (
              <><Activity className="w-3.5 h-3.5" /> Verify Sensor Accuracy</>
            )}
          </button>
        ) : (
          <p className="text-center text-[11px] text-zinc-400 py-1">No sensor deployed · Phase 1 pending</p>
        )}
      </div>
    </div>
  );
}

export default function IdentityDashboard() {
  const [selected, setSelected] = useState(new Set());
  const [verifiedMap, setVerifiedMap] = useState({});
  const [verifying, setVerifying] = useState(null);

  const readingMap = Object.fromEntries(SENSOR_READINGS.map(r => [r.school_id, r]));

  const handleToggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleSelectAll = () => {
    if (selected.size === SCHOOLS.length) setSelected(new Set());
    else setSelected(new Set(SCHOOLS.map(s => s.id)));
  };

  const handleVerify = async (id) => {
    setVerifying(id);
    await new Promise(r => setTimeout(r, 1200));
    setVerifiedMap(prev => ({ ...prev, [id]: true }));
    setVerifying(null);
  };

  const handleBulkVerify = async () => {
    for (const id of selected) {
      await handleVerify(id);
    }
    setSelected(new Set());
  };

  const onlineCount = SCHOOLS.filter(s => SENSOR_STATES[s.id] === 'Online' || SENSOR_STATES[s.id] === 'Alerting').length;
  const verifiedCount = Object.values(verifiedMap).filter(Boolean).length;
  const alertingCount = SCHOOLS.filter(s => SENSOR_STATES[s.id] === 'Alerting').length;

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0D2B45] to-[#1B4F72] rounded-xl p-5 text-white border border-[#1B4F72]">
        <div className="flex items-center gap-3 mb-2">
          <Radio className="w-6 h-6 text-emerald-400" />
          <h2 className="text-[18px] font-bold">Sentinel Network Hub: Geospatial Verification &amp; Sensor Health</h2>
        </div>
        <p className="text-blue-200 text-[13px]">
          Verify H3-indexed school coordinates · AirQo sensor calibration · School vulnerability profiles across the Kampala–Jinja corridor
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Sentinel Nodes', value: SCHOOLS.length, color: 'text-zinc-700' },
          { label: 'Nodes Online', value: onlineCount, color: 'text-green-700' },
          { label: 'Alerting', value: alertingCount, color: 'text-red-700' },
          { label: 'Accuracy Verified', value: verifiedCount, color: 'text-emerald-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
            <p className="text-[11px] text-zinc-500 uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="bg-emerald-600 text-white rounded-xl p-4 flex items-center gap-4 shadow-lg">
          <div className="flex-1">
            <p className="text-[14px] font-bold">{selected.size} school{selected.size !== 1 ? 's' : ''} selected</p>
            <p className="text-[12px] text-emerald-100 mt-0.5">Run sensor accuracy verification against AirQo reference stations</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelected(new Set())}
              className="px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-[12px] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkVerify}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-emerald-700 font-semibold text-[13px] hover:bg-emerald-50 transition-colors"
            >
              <Zap className="w-4 h-4" />
              Verify All Selected
            </button>
          </div>
        </div>
      )}

      {/* Select all row */}
      <div className="flex items-center gap-2 px-1">
        <button onClick={handleSelectAll} className="flex items-center gap-2 text-[12px] text-zinc-600 hover:text-zinc-900 transition-colors">
          {selected.size === SCHOOLS.length && SCHOOLS.length > 0
            ? <CheckSquare className="w-4 h-4 text-emerald-700" />
            : <Square className="w-4 h-4" />}
          Select all schools
        </button>
        <span className="text-[11px] text-zinc-400 ml-auto">{SCHOOLS.length} sentinel nodes indexed</span>
      </div>

      {/* School Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {SCHOOLS.map(school => (
          <SchoolCard
            key={school.id}
            school={school}
            reading={readingMap[school.id]}
            selected={selected.has(school.id)}
            onToggle={handleToggle}
            verified={verifiedMap[school.id]}
            onVerify={handleVerify}
            verifying={verifying}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
        <p className="text-[12px] font-semibold text-zinc-700 mb-3">Sensor Health &amp; Accuracy Legend</p>
        <div className="flex flex-wrap gap-4 text-[11px] text-zinc-600">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Online — Active, within thresholds</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Calibrating — Node recalibrating sensors</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Alerting — Breach detected, dispatch eligible</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-zinc-400" /> Offline — No signal / pending deployment</div>
          <div className="flex items-center gap-1.5"><span className="font-bold text-green-600">±%</span> Accuracy delta vs nearest AirQo reference station</div>
        </div>
      </div>
    </div>
  );
}