import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, MapPin, Activity, Network } from 'lucide-react';

export default function IdentityVerification() {
  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0D2B45] to-[#1B4F72] rounded-xl p-5 text-white border border-[#1B4F72]">
        <div className="flex items-center gap-3 mb-2">
          <Network className="w-6 h-6 text-emerald-400" />
          <h2 className="text-[18px] font-bold">Sentinel Network Hub</h2>
        </div>
        <p className="text-blue-200 text-[13px]">
          Geospatial Verification &amp; Sensor Health · AirQo Uganda Integration · GPS-Mapped School Nodes
        </p>
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sentinel Network Manager */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <Radio className="w-5 h-5 text-emerald-700" />
            <h3 className="text-[14px] font-bold text-zinc-900">Sentinel Network Manager</h3>
          </div>
          <p className="text-[12px] text-zinc-600 mb-4">
            Verify school GPS coordinates, AirQo sensor calibration status, and school vulnerability profiles across all sentinel nodes.
          </p>
          <Link
            to="/identity-dashboard"
            className="inline-block px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold rounded-lg transition-colors"
          >
            Open Network Manager
          </Link>
        </div>

        {/* Unified Impact Report */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-[#1B4F72]" />
            <h3 className="text-[14px] font-bold text-zinc-900">Unified Impact Report</h3>
          </div>
          <p className="text-[12px] text-zinc-600 mb-4">
            View aggregated geospatial and climate-health metrics — sentinel node coverage, population in risk zones, and district-level exposure analysis.
          </p>
          <Link
            to="/unified-impact"
            className="inline-block px-4 py-2 bg-[#1B4F72] hover:bg-[#154360] text-white text-[12px] font-semibold rounded-lg transition-colors"
          >
            View Hex Map
          </Link>
        </div>
      </div>

      {/* Integration Notice */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <Activity className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-emerald-700">
          <strong>AirQo Integration Ready:</strong> Sentinel nodes are mapped using GPS grid coordinates. Sensor accuracy verification compares local node readings against the nearest AirQo reference station to ensure data integrity before dispatch triggers fire.
        </p>
      </div>
    </div>
  );
}