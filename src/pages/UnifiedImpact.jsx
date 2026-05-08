import React from 'react';
import { SCHOOLS, SENSOR_READINGS } from '@/lib/schpData';
import { Users, MapPin, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

const MOCK_VERIFIED_STUDENTS = 1245;
const MOCK_PENDING_STUDENTS = 387;

export default function UnifiedImpact() {
  const readingMap = Object.fromEntries(SENSOR_READINGS.map(r => [r.school_id, r]));
  
  // Count schools in high-risk zones
  const highRiskSchools = SCHOOLS.filter(s => {
    const r = readingMap[s.id];
    return r && (r.pm25 > 100 || r.heat_index > 38);
  }).length;

  const criticalSchools = SCHOOLS.filter(s => {
    const r = readingMap[s.id];
    return r && (r.pm25 > 150 || r.heat_index > 42);
  }).length;

  const verifiedCount = SCHOOLS.filter(s => s.has_sensor).length;

  const studentsInHighRisk = SCHOOLS
    .filter(s => {
      const r = readingMap[s.id];
      return r && (r.pm25 > 100 || r.heat_index > 38);
    })
    .reduce((sum, s) => sum + s.student_population, 0);

  const studentsInCritical = SCHOOLS
    .filter(s => {
      const r = readingMap[s.id];
      return r && (r.pm25 > 150 || r.heat_index > 42);
    })
    .reduce((sum, s) => sum + s.student_population, 0);

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-xl p-5 text-white border border-zinc-700">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6 text-emerald-400" />
          <h2 className="text-[18px] font-bold">Unified Impact Report</h2>
        </div>
        <p className="text-zinc-300 text-[13px]">
          Unified Sentinel Infrastructure · Identity Verification + Climate-Health Protocol aggregation
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Verified Students */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-[11px] text-zinc-600 font-semibold uppercase tracking-wide">Verified Students</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{MOCK_VERIFIED_STUDENTS.toLocaleString()}</p>
          <p className="text-[10px] text-zinc-500 mt-1">Identity confirmed & biometric enrolled</p>
        </div>

        {/* Pending Verification */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span className="text-[11px] text-zinc-600 font-semibold uppercase tracking-wide">Pending Verification</span>
          </div>
          <p className="text-2xl font-bold text-yellow-700">{MOCK_PENDING_STUDENTS.toLocaleString()}</p>
          <p className="text-[10px] text-zinc-500 mt-1">Awaiting biometric enrollment</p>
        </div>

        {/* Schools in High-Risk Zones */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-orange-600" />
            <span className="text-[11px] text-zinc-600 font-semibold uppercase tracking-wide">High-Risk Schools</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">{highRiskSchools}</p>
          <p className="text-[10px] text-zinc-500 mt-1">PM2.5 &gt; 100 or Heat &gt; 38°C</p>
        </div>

        {/* Critical Risk Schools */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-[11px] text-zinc-600 font-semibold uppercase tracking-wide">Critical Risk Schools</span>
          </div>
          <p className="text-2xl font-bold text-red-700">{criticalSchools}</p>
          <p className="text-[10px] text-zinc-500 mt-1">PM2.5 &gt; 150 or Heat &gt; 42°C</p>
        </div>
      </div>

      {/* Unified Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Identity Sector */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-emerald-700" />
            <h3 className="text-[14px] font-bold text-emerald-900">Identity Verification Sector</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-emerald-800">Verified Students</span>
              <span className="text-[13px] font-bold text-emerald-700">{MOCK_VERIFIED_STUDENTS}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-emerald-800">Enrollment Rate</span>
              <span className="text-[13px] font-bold text-emerald-700">
                {Math.round((MOCK_VERIFIED_STUDENTS / (MOCK_VERIFIED_STUDENTS + MOCK_PENDING_STUDENTS)) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{
                  width: `${Math.round((MOCK_VERIFIED_STUDENTS / (MOCK_VERIFIED_STUDENTS + MOCK_PENDING_STUDENTS)) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Climate-Health Sector */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-orange-700" />
            <h3 className="text-[14px] font-bold text-orange-900">Climate-Health Sector</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-orange-800">Students in High-Risk Zones</span>
              <span className="text-[13px] font-bold text-orange-700">{studentsInHighRisk.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-orange-800">Students in Critical Zones</span>
              <span className="text-[13px] font-bold text-red-700">{studentsInCritical.toLocaleString()}</span>
            </div>
            <div className="flex gap-1 mt-3">
              <div className="flex-1 h-2 bg-orange-500 rounded-full" />
              <div className="flex-1 h-2 bg-red-600 rounded-full" />
              <div className="flex-1 h-2 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Sentinel Coverage Analysis */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-[14px] font-bold text-zinc-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Sentinel Coverage Analysis
        </h3>
        <p className="text-[12px] text-zinc-700 leading-relaxed mb-3">
          <strong>{studentsInCritical.toLocaleString()} students</strong> in critical climate zones are located across {criticalSchools} monitored schools. Of these, <strong>{Math.round((verifiedCount / SCHOOLS.length) * studentsInCritical).toLocaleString()} students</strong> are currently covered by Identity-Verified Sentinel Nodes—schools with active, calibrated sensors and verified dispatch coordinates.
        </p>
        <div className="flex gap-3 text-[11px]">
          <div className="flex-1 bg-white border border-amber-200 rounded-lg p-2.5">
            <p className="font-semibold text-amber-900">Priority Action:</p>
            <p className="text-amber-700 mt-0.5">Accelerate Sentinel Node Authentication for remaining schools to ensure 100% verified geospatial coverage in high-risk corridors.</p>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-blue-700">
          <strong>Unified Sentinel Impact:</strong> This report combines identity verification metrics with climate-health environmental data to enable coordinated interventions. Schools with both high-risk climate conditions and verified student enrollment receive priority dispatch.
        </p>
      </div>
    </div>
  );
}