import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, CheckCircle, Users, MapPin } from 'lucide-react';

export default function IdentityVerification() {
  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-xl p-5 text-white border border-zinc-700">
        <div className="flex items-center gap-3 mb-2">
          <Lock className="w-6 h-6 text-emerald-400" />
          <h2 className="text-[18px] font-bold">Verify Sentinel — Identity Module</h2>
        </div>
        <p className="text-zinc-300 text-[13px]">
          Unified Sentinel Infrastructure · Biometric identity verification for Health Workers and Admin users
        </p>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identity Verification Dashboard */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-emerald-700" />
            <h3 className="text-[14px] font-bold text-zinc-900">Verification Dashboard</h3>
          </div>
          <p className="text-[12px] text-zinc-600 mb-4">
            Manage student identity verification, biometric enrollment, and bulk approval workflows.
          </p>
          <Link
            to="/identity-dashboard"
            className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold rounded-lg transition-colors"
          >
            Register Identity
          </Link>
        </div>

        {/* Unified Impact Report */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-zinc-700" />
            <h3 className="text-[14px] font-bold text-zinc-900">Unified Impact Report</h3>
          </div>
          <p className="text-[12px] text-zinc-600 mb-4">
            View aggregated identity + climate-health metrics showing verified students in risk zones.
          </p>
          <Link
            to="/unified-impact"
            className="inline-block px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-[12px] font-semibold rounded-lg transition-colors"
          >
            View Hex Map
          </Link>
        </div>
      </div>

      {/* Integration Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-emerald-700">
          <strong>Unified Sentinel Integration:</strong> Identity module now connected to Climate-Health Protocol. Student verification data links directly to school sentinel nodes for coordinated health interventions in high-risk zones.
        </p>
      </div>
    </div>
  );
}