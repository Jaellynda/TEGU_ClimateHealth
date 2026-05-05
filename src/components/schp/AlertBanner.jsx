import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SENSOR_READINGS, SCHOOLS, getPM25Level } from '@/lib/schpData';

function buildAlerts() {
  const alerts = [];
  for (const r of SENSOR_READINGS) {
    const school = SCHOOLS.find(s => s.id === r.school_id);
    if (!school) continue;
    if (r.pm25 > 150) {
      alerts.push({
        id: `pm25-${r.school_id}`,
        schoolId: r.school_id,
        schoolName: school.name,
        type: 'PM2.5',
        message: `PM2.5 at ${r.pm25} μg/m³ — exceeds Red Alert threshold (150 μg/m³)`,
        level: 'critical',
      });
    } else if (r.pm25 > 100) {
      alerts.push({
        id: `pm25-warn-${r.school_id}`,
        schoolId: r.school_id,
        schoolName: school.name,
        type: 'PM2.5',
        message: `PM2.5 at ${r.pm25} μg/m³ — Warning threshold exceeded (100 μg/m³)`,
        level: 'warning',
      });
    }
    if (r.heat_index > 42) {
      alerts.push({
        id: `heat-${r.school_id}`,
        schoolId: r.school_id,
        schoolName: school.name,
        type: 'Heat Index',
        message: `Heat Index at ${r.heat_index}°C — exceeds Red Alert threshold (42°C)`,
        level: 'critical',
      });
    } else if (r.heat_index > 38) {
      alerts.push({
        id: `heat-warn-${r.school_id}`,
        schoolId: r.school_id,
        schoolName: school.name,
        type: 'Heat Index',
        message: `Heat Index at ${r.heat_index}°C — Warning threshold exceeded (38°C)`,
        level: 'warning',
      });
    }
  }
  return alerts;
}

export default function AlertBanner() {
  const [dismissed, setDismissed] = useState(new Set());
  const [currentIdx, setCurrentIdx] = useState(0);

  const allAlerts = buildAlerts();
  const visible = allAlerts.filter(a => !dismissed.has(a.id));

  // Rotate through alerts every 5 seconds if multiple
  useEffect(() => {
    if (visible.length <= 1) return;
    const t = setInterval(() => setCurrentIdx(i => (i + 1) % visible.length), 5000);
    return () => clearInterval(t);
  }, [visible.length]);

  if (visible.length === 0) return null;

  const idx = currentIdx % visible.length;
  const alert = visible[idx];
  const isCritical = alert.level === 'critical';

  return (
    <div className={`mx-4 mt-3 md:mx-6 rounded-xl border shadow-md animate-fade-in overflow-hidden ${
      isCritical
        ? 'bg-red-600 border-red-700 text-white'
        : 'bg-orange-500 border-orange-600 text-white'
    }`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${isCritical ? 'animate-pulse' : ''}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-widest opacity-80">
              {isCritical ? '🚨 Red Alert' : '⚠️ Warning'} · {alert.type}
            </span>
            {visible.length > 1 && (
              <span className="text-[10px] opacity-60">{idx + 1}/{visible.length} active alerts</span>
            )}
          </div>
          <p className="text-[13px] font-semibold truncate">
            {alert.schoolName} — {alert.message}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to={`/school/${alert.schoolId}`}
            className="flex items-center gap-1 text-[11px] font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            View School <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => { setDismissed(prev => new Set([...prev, alert.id])); setCurrentIdx(0); }}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}