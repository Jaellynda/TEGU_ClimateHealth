import React from 'react';
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
        {/* Identity Registration */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-zinc-700" />
            <h3 className="text-[14px] font-bold text-zinc-900">Health Worker Registration</h3>
          </div>
          <p className="text-[12px] text-zinc-600 mb-4">
            Biometric enrollment and identity verification for field health workers and district administrators.
          </p>
          <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-[12px] font-semibold rounded-lg transition-colors">
            Register Identity
          </button>
        </div>

        {/* Sentinel H3 Mapping */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-zinc-700" />
            <h3 className="text-[14px] font-bold text-zinc-900">Sentinel H3 Hex Mapping</h3>
          </div>
          <p className="text-[12px] text-zinc-600 mb-4">
            View identity-linked sentinel locations across the H3 resolution 9 hexagonal grid.
          </p>
          <button className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-[12px] font-semibold rounded-lg transition-colors">
            View Hex Map
          </button>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-center gap-3">
        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <p className="text-[12px] text-zinc-700">
          <strong>Identity Module:</strong> Biometric enrollment, role-based access control, and H3-linked identity verification coming in Phase 2.
        </p>
      </div>
    </div>
  );
}