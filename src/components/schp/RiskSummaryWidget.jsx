import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SCHOOLS, SENSOR_READINGS, DISPATCH_LOGS } from '@/lib/schpData';
import { AlertTriangle, Wind, Thermometer, CheckCircle, ArrowRight, Download } from 'lucide-react';
import { generateMonthlyPDFReport } from '@/lib/pdfReport';

function getSchoolRisk(school, reading) {
  if (!reading) return null;
  const pmCritical = reading.pm25 > 150;
  const pmWarning = reading.pm25 > 100;
  const heatCritical = reading.heat_index > 42;
  const heatWarning = reading.heat_index > 38;
  if (pmCritical || heatCritical) return 'critical';
  if (pmWarning || heatWarning) return 'warning';
  return 'normal';
}

const RISK_CFG = {
  critical: { label: 'Red Alert', dot: 'bg-red-500 animate-pulse', text: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  warning:  { label: 'Warning',   dot: 'bg-orange-400',            text: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  normal:   { label: 'Normal',    dot: 'bg-green-500',             text: 'text-green-700', bg: 'bg-green-50 border-green-200' },
};

export default function RiskSummaryWidget() {
  const readingMap = Object.fromEntries(SENSOR_READINGS.map(r => [r.school_id, r]));
  const [downloading, setDownloading] = React.useState(false);

  const schoolRisks = SCHOOLS.map(s => ({
    school: s,
    reading: readingMap[s.id],
    risk: getSchoolRisk(s, readingMap[s.id]),
  }));

  const critical = schoolRisks.filter(x => x.risk === 'critical');
  const warning  = schoolRisks.filter(x => x.risk === 'warning');
  const normal   = schoolRisks.filter(x => x.risk === 'normal');
  const noSensor = schoolRisks.filter(x => x.risk === null);
  const urgent   = critical.length + warning.length;

  const handleDownload = async () => {
    setDownloading(true);
    await generateMonthlyPDFReport(DISPATCH_LOGS, SENSOR_READINGS, SCHOOLS);
    setDownloading(false);
  };

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-[#1B4F72]/5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#1B4F72]" />
          <h3 className="text-[13px] font-bold text-[#1B4F72]">Risk Summary — All Schools</h3>
        </div>
        <div className="flex items-center gap-2">
          {urgent > 0 && (
            <span className="text-[11px] font-bold bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full border border-red-200">
              {urgent} urgent
            </span>
          )}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 text-[11px] font-semibold bg-[#1B4F72] text-white px-3 py-1.5 rounded-lg hover:bg-[#154360] transition-colors disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            {downloading ? 'Generating...' : 'Monthly PDF Report'}
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-4 divide-x divide-border border-b border-border">
        {[
          { label: 'Red Alert', count: critical.length, color: '#C0392B', bg: 'bg-red-50' },
          { label: 'Warning',   count: warning.length,  color: '#E67E22', bg: 'bg-orange-50' },
          { label: 'Normal',    count: normal.length,   color: '#1E8449', bg: 'bg-green-50' },
          { label: 'No Sensor', count: noSensor.length, color: '#6B7280', bg: 'bg-gray-50' },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className={`${bg} py-3 text-center`}>
            <p className="text-[20px] font-bold" style={{ color }}>{count}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* School list */}
      <div className="divide-y divide-border max-h-64 overflow-y-auto">
        {[...critical, ...warning, ...normal].map(({ school, reading, risk }) => {
          const cfg = RISK_CFG[risk];
          return (
            <div key={school.id} className={`flex items-center gap-3 px-4 py-2.5 ${risk === 'critical' ? 'bg-red-50/40' : ''}`}>
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-foreground truncate">{school.name}</p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                  {reading && (
                    <>
                      <span className="flex items-center gap-1">
                        <Wind className="w-3 h-3" />
                        <span style={{ color: reading.pm25 > 150 ? '#C0392B' : reading.pm25 > 100 ? '#E67E22' : '#1E8449' }}>
                          {reading.pm25} μg/m³
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3" />
                        <span style={{ color: reading.heat_index > 42 ? '#C0392B' : reading.heat_index > 38 ? '#E67E22' : '#1E8449' }}>
                          {reading.heat_index}°C
                        </span>
                      </span>
                    </>
                  )}
                  <span className={`font-semibold ${cfg.text}`}>{cfg.label}</span>
                </div>
              </div>
              <Link
                to={`/school/${school.id}`}
                className="flex items-center gap-1 text-[10px] text-[#1B4F72] font-semibold hover:underline flex-shrink-0"
              >
                View <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}