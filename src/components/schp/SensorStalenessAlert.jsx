import React, { useState } from 'react';
import { WifiOff, Clock, AlertTriangle, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { SCHOOLS, SENSOR_READINGS } from '@/lib/schpData';

const STALE_THRESHOLD_HOURS = 24;

function getHoursAgo(timestamp) {
  const now = new Date();
  const then = new Date(timestamp);
  return (now - then) / (1000 * 60 * 60);
}

export default function SensorStalenessAlert() {
  const [expanded, setExpanded] = useState(true);

  const readingMap = Object.fromEntries(SENSOR_READINGS.map(r => [r.school_id, r]));

  // Schools with sensors but stale/missing data
  const staleSchools = SCHOOLS
    .filter(s => s.has_sensor)
    .map(s => {
      const reading = readingMap[s.id];
      if (!reading) return { school: s, hoursAgo: null, missing: true };
      const hoursAgo = getHoursAgo(reading.timestamp);
      if (hoursAgo > STALE_THRESHOLD_HOURS) return { school: s, hoursAgo, missing: false };
      return null;
    })
    .filter(Boolean);

  // Schools with sensors and fresh data
  const freshCount = SCHOOLS.filter(s => {
    if (!s.has_sensor) return false;
    const reading = readingMap[s.id];
    return reading && getHoursAgo(reading.timestamp) <= STALE_THRESHOLD_HOURS;
  }).length;

  if (staleSchools.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
        <p className="text-[12px] text-green-700 font-medium">
          All {freshCount} sensor-equipped schools are sending live data within the last 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-300 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-red-100/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500 text-white flex-shrink-0">
            <WifiOff className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <p className="text-[13px] font-bold text-red-800">
              {staleSchools.length} Sensor{staleSchools.length !== 1 ? 's' : ''} Not Reporting
            </p>
            <p className="text-[11px] text-red-600">
              No data received in over {STALE_THRESHOLD_HOURS} hours — readings may be unreliable
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
            {staleSchools.length} STALE
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-red-500" /> : <ChevronDown className="w-4 h-4 text-red-500" />}
        </div>
      </button>

      {/* Stale school list */}
      {expanded && (
        <div className="border-t border-red-200 divide-y divide-red-100">
          {staleSchools.map(({ school, hoursAgo, missing }) => (
            <div key={school.id} className="px-4 py-3 flex items-center justify-between gap-3 bg-white/60">
              <div className="flex items-center gap-3 min-w-0">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-zinc-800 truncate">{school.name}</p>
                  <p className="text-[11px] text-zinc-500">{school.district} District · {school.student_population.toLocaleString()} students</p>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                {missing ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-zinc-200 text-zinc-700">
                    <WifiOff className="w-3 h-3" /> No data
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                    <Clock className="w-3 h-3" /> {Math.round(hoursAgo)}h ago
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Footer guidance */}
          <div className="px-4 py-3 bg-red-50 text-[11px] text-red-700">
            <strong>Action required:</strong> Check sensor power supply, network connectivity, or schedule a field inspection for stale nodes. Unreliable readings may suppress or delay dispatch triggers.
          </div>
        </div>
      )}
    </div>
  );
}