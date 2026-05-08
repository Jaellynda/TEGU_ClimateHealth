import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, AlertCircle, CheckSquare, Square, Zap, Radio } from 'lucide-react';

const MOCK_SCHOOLS = [
  { id: 's1', school_name: 'Kampala Parents School', h3_id: '8922c3d8d99ffff', students: 450, staff: 12, sensor_status: 'Online', verification_status: 'Pending', calibrated: false },
  { id: 's2', school_name: 'Jinja Central Primary', h3_id: '8922c3d8d99eeee', students: 380, staff: 10, sensor_status: 'Online', verification_status: 'Confirmed', calibrated: true },
  { id: 's3', school_name: 'Victoria Nile Primary', h3_id: '8922c3d8d99dddd', students: 310, staff: 8, sensor_status: 'Offline', verification_status: 'Flagged', calibrated: false },
  { id: 's4', school_name: 'Entebbe International', h3_id: '8922c3d8d99cccc', students: 220, staff: 7, sensor_status: 'Online', verification_status: 'Pending', calibrated: false },
  { id: 's5', school_name: 'Mukono District Academy', h3_id: '8922c3d8d99bbbb', students: 290, staff: 9, sensor_status: 'Online', verification_status: 'Confirmed', calibrated: true },
];

const STATUS_ICON = {
  Pending: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  Confirmed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  Flagged: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
};

function SensorStatusBadge({ status, calibrated }) {
  if (status === 'Offline') {
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">Offline</span>;
  }
  if (!calibrated) {
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">Uncalibrated</span>;
  }
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">Calibrated</span>;
}

function SchoolRow({ school, selected, onToggle, onApprove, onFlag }) {
  const cfg = STATUS_ICON[school.verification_status];
  const Icon = cfg.icon;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b border-zinc-200 hover:bg-zinc-50 ${cfg.bg}`}>
      <button
        onClick={() => onToggle(school.id)}
        className="text-zinc-400 hover:text-zinc-700 transition-colors"
      >
        {selected ? (
          <CheckSquare className="w-5 h-5 text-zinc-900" />
        ) : (
          <Square className="w-5 h-5" />
        )}
      </button>

      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.color.replace('text-', 'border-')}`}>
        <Icon className={`w-4 h-4 ${cfg.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-zinc-900">{school.school_name}</p>
        <p className="text-[10px] text-zinc-500 font-mono">Sentinel ID: {school.h3_id}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-center">
          <p className="text-[12px] font-bold text-zinc-900">{school.students}</p>
          <p className="text-[9px] text-zinc-600">students</p>
        </div>
        <div className="text-center border-l border-zinc-300 pl-2">
          <p className="text-[12px] font-bold text-zinc-900">{school.staff}</p>
          <p className="text-[9px] text-zinc-600">staff</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <SensorStatusBadge status={school.sensor_status} calibrated={school.calibrated} />
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {school.verification_status === 'Pending' && (
          <>
            <button
              onClick={() => onApprove(school.id)}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[11px] font-semibold rounded-lg transition-colors"
            >
              Verify
            </button>
            <button
              onClick={() => onFlag(school.id)}
              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[11px] font-semibold rounded-lg transition-colors"
            >
              Flag
            </button>
          </>
        )}
        {school.verification_status === 'Confirmed' && (
          <span className="text-[11px] font-semibold text-green-600">✓ Verified</span>
        )}
        {school.verification_status === 'Flagged' && (
          <span className="text-[11px] font-semibold text-red-600">⚠ Review</span>
        )}
      </div>
    </div>
  );
}

export default function IdentityDashboard() {
  const [selected, setSelected] = useState(new Set());
  const [schools] = useState(MOCK_SCHOOLS);
  const [updating, setUpdating] = useState(false);

  const handleToggleSelect = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleSelectAll = () => {
    if (selected.size === schools.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(schools.map(s => s.id)));
    }
  };

  const handleBulkVerify = async () => {
    setUpdating(true);
    await new Promise(r => setTimeout(r, 800));
    setSelected(new Set());
    setUpdating(false);
  };

  const handleApprove = async (id) => {
    console.log('Verified sentinel:', id);
  };

  const handleFlag = async (id) => {
    console.log('Flagged sentinel:', id);
  };

  const pendingCount = schools.filter(s => s.verification_status === 'Pending').length;
  const verifiedCount = schools.filter(s => s.verification_status === 'Confirmed').length;
  const totalCapacity = schools.reduce((sum, s) => sum + s.students + s.staff, 0);

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-xl p-5 text-white border border-emerald-700">
        <div className="flex items-center gap-3 mb-2">
          <Radio className="w-6 h-6 text-emerald-300" />
          <h2 className="text-[18px] font-bold">Sentinel School Verification</h2>
        </div>
        <p className="text-emerald-200 text-[13px]">
          Verify AirQo sensor calibration and population thresholds for H3-indexed sentinel schools
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Sentinel Schools', value: schools.length, color: 'text-zinc-700' },
          { label: 'Verified', value: verifiedCount, color: 'text-green-700' },
          { label: 'Pending', value: pendingCount, color: 'text-yellow-700' },
          { label: 'Total Population', value: totalCapacity, color: 'text-blue-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
            <p className="text-[11px] text-zinc-600 uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{typeof value === 'number' && value > 100 ? value.toLocaleString() : value}</p>
          </div>
        ))}
      </div>

      {/* Bulk Actions Bar */}
      {selected.size > 0 && (
        <div className="bg-emerald-600 text-white rounded-xl p-4 flex items-center gap-4 shadow-lg">
          <div className="flex-1">
            <p className="text-[14px] font-bold">{selected.size} school{selected.size !== 1 ? 's' : ''} selected</p>
            <p className="text-[12px] text-emerald-100 mt-0.5">Ready to calibrate and verify sensors</p>
          </div>
          <button
            disabled={updating}
            onClick={handleBulkVerify}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-emerald-700 font-semibold text-[13px] hover:bg-emerald-50 transition-colors disabled:opacity-60"
          >
            <Zap className="w-4 h-4" />
            {updating ? 'Calibrating...' : 'Verify Selected'}
          </button>
        </div>
      )}

      {/* School List */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* List Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 border-b border-zinc-200">
          <button
            onClick={handleSelectAll}
            className="text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            {selected.size === schools.length && schools.length > 0 ? (
              <CheckSquare className="w-5 h-5 text-zinc-900" />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1 text-[11px] font-semibold text-zinc-600 uppercase tracking-wide">
            School / H3 ID
          </div>
          <div className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wide">Capacity</div>
          <div className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wide">Sensor</div>
        </div>

        {/* School Rows */}
        <div className="divide-y divide-zinc-200">
          {schools.map(school => (
            <SchoolRow
              key={school.id}
              school={school}
              selected={selected.has(school.id)}
              onToggle={handleToggleSelect}
              onApprove={handleApprove}
              onFlag={handleFlag}
            />
          ))}
        </div>
      </div>
    </div>
  );
}