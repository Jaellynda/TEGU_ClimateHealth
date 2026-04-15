import React, { useState } from 'react';
import { SENSOR_READINGS, DISPATCH_LOGS, SCHOOLS } from '@/lib/schpData';
import { Brain, AlertTriangle, TrendingUp, Zap, ChevronDown, ChevronUp, CheckCircle, Clock } from 'lucide-react';

function XAICard({ dispatch, expanded: initExpanded = false }) {
  const [expanded, setExpanded] = useState(initExpanded);
  const school = SCHOOLS.find(s => s.id === dispatch.school_id);
  const reading = SENSOR_READINGS.find(r => r.school_id === dispatch.school_id);

  const priorityColors = {
    Critical: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
    High: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
    Medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  };
  const colors = priorityColors[dispatch.priority] || priorityColors.Medium;

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden shadow-sm`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1B4F72] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-[14px] font-bold text-[#1B4F72]">{dispatch.school_name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                  {dispatch.priority} PRIORITY
                </span>
              </div>
              <p className="text-[12px] text-muted-foreground mt-0.5">{dispatch.trigger_type} · {dispatch.trigger_value}</p>
            </div>
          </div>
          <button onClick={() => setExpanded(!expanded)} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* XAI Summary always visible */}
        <div className="bg-white/70 rounded-lg p-3 border border-white">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Zap className="w-3.5 h-3.5 text-[#E67E22]" />
            <span className="text-[11px] font-semibold text-[#E67E22] uppercase tracking-wide">Sentinel AI · Explainable Insight</span>
          </div>
          <p className="text-[12px] text-foreground leading-relaxed">{dispatch.xai_reason}</p>
        </div>

        {/* Morbidity forecast */}
        <div className="mt-2.5 bg-[#1B4F72]/5 rounded-lg p-3 border border-[#1B4F72]/10">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#1B4F72]" />
            <span className="text-[11px] font-semibold text-[#1B4F72] uppercase tracking-wide">Morbidity Forecast · 48h Window</span>
          </div>
          <p className="text-[12px] text-foreground">{dispatch.morbidity_forecast}</p>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-current/10 pt-3 space-y-3">
          {/* Sensor readings */}
          {reading && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Live Sensor Readings</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'PM2.5', value: `${reading.pm25} μg/m³`, threshold: '> 150 = RED ALERT' },
                  { label: 'Heat Index', value: `${reading.heat_index}°C`, threshold: '> 40°C = ALERT' },
                  { label: 'Humidity', value: `${reading.humidity}%`, threshold: '> 80% = Caution' },
                ].map(({ label, value, threshold }) => (
                  <div key={label} className="bg-white rounded-lg p-2.5 border border-white shadow-sm text-center">
                    <p className="text-[13px] font-bold text-foreground">{value}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="text-[9px] text-muted-foreground/60 mt-0.5">{threshold}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supplies triggered */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Triggered Supplies</p>
            <div className="space-y-1.5">
              {dispatch.supplies.map((supply, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px]">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  <span>{supply}</span>
                </div>
              ))}
            </div>
          </div>

          {/* School info */}
          {school && (
            <div className="text-[11px] text-muted-foreground flex flex-wrap gap-4 pt-1 border-t border-current/10">
              <span>Students: <strong className="text-foreground">{school.student_population.toLocaleString()}</strong></span>
              <span>Vulnerability Score: <strong className="text-foreground">{school.vulnerability_score}/100</strong></span>
              <span>District: <strong className="text-foreground">{school.district}</strong></span>
            </div>
          )}
        </div>
      )}

      <div className="px-4 py-2 bg-black/5 flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(dispatch.created_date).toLocaleString('en-UG', { timeZone: 'Africa/Kampala' })} EAT</span>
        <span>{dispatch.dispatched_by}</span>
      </div>
    </div>
  );
}

export default function AIPredictor() {
  const alertReadings = SENSOR_READINGS.filter(r => r.status === 'Red Alert' || r.status === 'Warning');

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B4F72] to-[#2E86C1] rounded-xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-6 h-6 text-[#E67E22]" />
          <h2 className="text-[18px] font-bold">Sentinel AI Anomaly Predictor</h2>
        </div>
        <p className="text-blue-200 text-[13px]">
          Rule-based Explainable AI (XAI) Engine · Anticipatory Action Protocol · Real-time anomaly detection across all sentinel school nodes.
        </p>
        <div className="flex flex-wrap gap-3 mt-3">
          {[
            { label: 'Active Anomalies', value: alertReadings.length, bg: 'bg-red-500/20 text-red-200' },
            { label: 'Dispatches Triggered', value: DISPATCH_LOGS.length, bg: 'bg-orange-500/20 text-orange-200' },
            { label: 'Students Protected', value: '3,570+', bg: 'bg-green-500/20 text-green-200' },
          ].map(({ label, value, bg }) => (
            <div key={label} className={`${bg} rounded-lg px-3 py-1.5`}>
              <span className="text-[11px] opacity-80">{label}: </span>
              <span className="text-[13px] font-bold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* XAI rule engine explanation */}
      <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-[#E67E22]" />
          <h3 className="text-[14px] font-semibold text-[#1B4F72]">Detection Rules — Sentinel Engine v1.0</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { rule: 'PM2.5 > 150 μg/m³', action: 'Auto-dispatch N95 Masks + Inhalers', priority: 'Critical' },
            { rule: 'Heat Index > 40°C', action: 'Auto-dispatch ORS + Cooling Packs', priority: 'Critical' },
            { rule: 'Combined PM2.5 + Heat', action: 'Full Protocol ALPHA activation', priority: 'High' },
          ].map(({ rule, action, priority }) => (
            <div key={rule} className="bg-muted/40 rounded-lg p-3 border border-border">
              <p className="text-[12px] font-bold text-foreground font-mono">{rule}</p>
              <p className="text-[11px] text-muted-foreground mt-1">→ {action}</p>
              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold mt-1.5 inline-block">{priority}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h3 className="text-[14px] font-semibold text-[#1B4F72] mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Active Anomaly Alerts ({DISPATCH_LOGS.length})
        </h3>
        <div className="space-y-4">
          {DISPATCH_LOGS.map((dispatch, i) => (
            <XAICard key={dispatch.id} dispatch={dispatch} expanded={i === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}