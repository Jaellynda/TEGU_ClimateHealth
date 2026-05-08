import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, AlertCircle, CheckSquare, Square, Zap } from 'lucide-react';

const MOCK_STUDENTS = [
  { id: '1', full_name: 'Akanksha Patel', school_name: 'Kampala Parents School', verification_status: 'Pending', risk_level: 'High', biometric_captured: true },
  { id: '2', full_name: 'James Ouma', school_name: 'Jinja Central Primary', verification_status: 'Confirmed', risk_level: 'Critical', biometric_captured: true },
  { id: '3', full_name: 'Mary Ssekandi', school_name: 'Kampala Parents School', verification_status: 'Pending', risk_level: 'Moderate', biometric_captured: false },
  { id: '4', full_name: 'David Mukono', school_name: 'Victoria Nile Primary', verification_status: 'Flagged', risk_level: 'Low', biometric_captured: true },
  { id: '5', full_name: 'Grace Nalwanga', school_name: 'Jinja Central Primary', verification_status: 'Pending', risk_level: 'High', biometric_captured: true },
];

const STATUS_ICON = {
  Pending: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  Confirmed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  Flagged: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
};

function StudentRow({ student, selected, onToggle, onApprove, onFlag }) {
  const cfg = STATUS_ICON[student.verification_status];
  const Icon = cfg.icon;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b border-zinc-200 hover:bg-zinc-50 ${cfg.bg}`}>
      <button
        onClick={() => onToggle(student.id)}
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
        <p className="text-[13px] font-semibold text-zinc-900">{student.full_name}</p>
        <p className="text-[11px] text-zinc-600">{student.school_name}</p>
      </div>

      <div className="flex items-center gap-2">
        {student.biometric_captured && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
            Biometric OK
          </span>
        )}
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          student.risk_level === 'Critical' ? 'bg-red-100 text-red-700 border-red-200' :
          student.risk_level === 'High' ? 'bg-orange-100 text-orange-700 border-orange-200' :
          'bg-green-100 text-green-700 border-green-200'
        }`}>
          {student.risk_level} Risk
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {student.verification_status === 'Pending' && (
          <>
            <button
              onClick={() => onApprove(student.id)}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[11px] font-semibold rounded-lg transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onFlag(student.id)}
              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[11px] font-semibold rounded-lg transition-colors"
            >
              Flag
            </button>
          </>
        )}
        {student.verification_status === 'Confirmed' && (
          <span className="text-[11px] font-semibold text-green-600">✓ Verified</span>
        )}
        {student.verification_status === 'Flagged' && (
          <span className="text-[11px] font-semibold text-red-600">⚠ Review</span>
        )}
      </div>
    </div>
  );
}

export default function IdentityDashboard() {
  const [selected, setSelected] = useState(new Set());
  const [students] = useState(MOCK_STUDENTS);
  const [updating, setUpdating] = useState(false);

  const handleToggleSelect = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleSelectAll = () => {
    if (selected.size === students.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(students.map(s => s.id)));
    }
  };

  const handleBulkVerify = async () => {
    setUpdating(true);
    // Simulate batch update
    await new Promise(r => setTimeout(r, 800));
    setSelected(new Set());
    setUpdating(false);
  };

  const handleApprove = async (id) => {
    // Individual approval
    console.log('Approved:', id);
  };

  const handleFlag = async (id) => {
    // Individual flag
    console.log('Flagged:', id);
  };

  const pendingCount = students.filter(s => s.verification_status === 'Pending').length;
  const confirmedCount = students.filter(s => s.verification_status === 'Confirmed').length;

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-xl p-5 text-white border border-emerald-700">
        <div className="flex items-center gap-3 mb-2">
          <CheckCircle className="w-6 h-6 text-emerald-300" />
          <h2 className="text-[18px] font-bold">Identity Verification Dashboard</h2>
        </div>
        <p className="text-emerald-200 text-[13px]">
          Biometric enrollment and verification status for enrolled students across sentinel schools
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Students', value: students.length, color: 'text-zinc-700' },
          { label: 'Verified', value: confirmedCount, color: 'text-green-700' },
          { label: 'Pending', value: pendingCount, color: 'text-yellow-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
            <p className="text-[11px] text-zinc-600 uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Bulk Actions Bar */}
      {selected.size > 0 && (
        <div className="bg-emerald-600 text-white rounded-xl p-4 flex items-center gap-4 shadow-lg">
          <div className="flex-1">
            <p className="text-[14px] font-bold">{selected.size} student{selected.size !== 1 ? 's' : ''} selected</p>
          </div>
          <button
            disabled={updating}
            onClick={handleBulkVerify}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-emerald-700 font-semibold text-[13px] hover:bg-emerald-50 transition-colors disabled:opacity-60"
          >
            <Zap className="w-4 h-4" />
            {updating ? 'Verifying...' : 'Verify Selected'}
          </button>
        </div>
      )}

      {/* Student List */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* List Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 border-b border-zinc-200">
          <button
            onClick={handleSelectAll}
            className="text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            {selected.size === students.length && students.length > 0 ? (
              <CheckSquare className="w-5 h-5 text-zinc-900" />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>
          <div className="flex-1 text-[11px] font-semibold text-zinc-600 uppercase tracking-wide">
            Student Name
          </div>
          <div className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wide">Status</div>
        </div>

        {/* Student Rows */}
        <div className="divide-y divide-zinc-200">
          {students.map(student => (
            <StudentRow
              key={student.id}
              student={student}
              selected={selected.has(student.id)}
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