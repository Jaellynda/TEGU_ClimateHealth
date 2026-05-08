import React from 'react';
import { Link } from 'react-router-dom';
import { SCHOOLS, SENSOR_READINGS } from '@/lib/schpData';
import { Wind, Thermometer, AlertTriangle, ArrowRight } from 'lucide-react';

function buildAlerts(schools, readings) {
  const readingMap = Object.fromEntries(readings.map(r => [r.school_id, r]));
  const alerts = [];

  schools.forEach(school => {
    const r = readingMap[school.id];
    if (!r) return;

    if (r.pm25 > 150) {
      alerts.push({
        schoolId: school.id,
        schoolName: school.name,
        district: school.district,
        type: 'air',
        label: 'Poor Air Quality',
        detail: `PM2.5 at ${r.pm25} μg/m³ — exceeds safe limit (150)`,
        severity: 'critical',
        icon: Wind,
      });
    } else if (r.pm25 > 100) {
      alerts.push({
        schoolId: school.id,
        schoolName: school.name,
        district: school.district,
        type: 'air',
        label: 'Elevated PM2.5',
        detail: `PM2.5 at ${r.pm25} μg/m³ — approaching danger threshold`,
        severity: 'warning',
        icon: Wind,
      });
    }

    if (r.heat_index > 42) {
      alerts.push({
        schoolId: school.id,
        schoolName: school.name,
        district: school.district,
        type: 'heat',
        label: 'Extreme Heat Index',
        detail: `Heat index at ${r.heat_index}°C — heatstroke risk for children`,
        severity: 'critical',
        icon: Thermometer,
      });
    } else if (r.heat_index > 38) {
      alerts.push({
        schoolId: school.id,
        schoolName: school.name,
        district: school.district,
        type: 'heat',
        label: 'High Heat Index',
        detail: `Heat index at ${r.heat_index}°C — dehydration risk elevated`,
        severity: 'warning',
        icon: Thermometer,
      });
    }
  });

  // Sort: critical first
  return alerts.sort((a, b) => (a.severity === 'critical' ? -1 : 1));
}

const SEVERITY = {
  critical: {
    bar: 'bg-red-500',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700 border-red-200',
    icon: 'text-red-500',
    label: 'CRITICAL',
  },
  warning: {
    bar: 'bg-orange-400',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: 'text-orange-500',
    label: 'WARNING',
  },
};

export default function ActiveAlertsFeed() {
  const alerts = buildAlerts(SCHOOLS, SENSOR_READINGS);

  if (alerts.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <p className="text-[13px] font-semibold text-green-700">All schools within safe thresholds — no active alerts.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-red-600">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-white" />
          <span className="text-[13px] font-bold text-white">Active Safety Alerts</span>
          <span className="bg-white/25 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            {alerts.length} breach{alerts.length !== 1 ? 'es' : ''}
          </span>
        </div>
        <span className="text-[10px] text-red-200 font-medium">Live · Auto-refreshing</span>
      </div>

      {/* Alert rows */}
      <div className="divide-y divide-border">
        {alerts.map((alert, i) => {
          const cfg = SEVERITY[alert.severity];
          const Icon = alert.icon;
          return (
            <div key={i} className={`flex items-center gap-0 ${cfg.bg}`}>
              {/* Severity bar */}
              <div className={`w-1 self-stretch flex-shrink-0 ${cfg.bar}`} />
              <div className="flex items-center gap-3 px-4 py-3 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-white border ${cfg.border}`}>
                  <Icon className={`w-4 h-4 ${cfg.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-[12px] font-bold text-foreground">{alert.schoolName}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                      {alert.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{alert.detail}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">{alert.district} District</p>
                </div>
                <Link
                  to={`/school/${alert.schoolId}`}
                  className="flex items-center gap-1 text-[11px] text-[#1B4F72] font-semibold hover:underline flex-shrink-0"
                >
                  View <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}