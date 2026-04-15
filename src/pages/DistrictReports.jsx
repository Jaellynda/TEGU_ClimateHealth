import React, { useState } from 'react';
import { DISTRICT_STATS, SCHOOLS, SENSOR_READINGS } from '@/lib/schpData';
import { useAdminAuth } from '@/lib/authContext';
import { FileText, Download, CheckCircle, Clock, AlertTriangle, Lock, Database, RefreshCw, Users } from 'lucide-react';

const DHIS2_STATUS = {
  Active: { color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200', dot: 'bg-green-500' },
  Pending: { color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200', dot: 'bg-yellow-500' },
};

function DistrictCard({ stat }) {
  const dhis2 = DHIS2_STATUS[stat.dhis2_sync] || DHIS2_STATUS.Pending;
  const districtSchools = SCHOOLS.filter(s => s.district === stat.district);
  const districtReadings = SENSOR_READINGS.filter(r =>
    districtSchools.some(s => s.id === r.school_id)
  );
  const alertCount = districtReadings.filter(r => r.status === 'Red Alert').length;

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-[15px] font-bold text-[#1B4F72]">{stat.district} District</h3>
          <p className="text-[12px] text-muted-foreground">{stat.schools} sentinel schools monitored</p>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${dhis2.bg} ${dhis2.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dhis2.dot}`} />
          <span className={`text-[11px] font-semibold ${dhis2.color}`}>DHIS2 {stat.dhis2_sync}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-muted/40 rounded-lg p-2.5 text-center">
          <p className="text-[15px] font-bold text-[#1B4F72]">{stat.schools}</p>
          <p className="text-[9px] text-muted-foreground">Schools</p>
        </div>
        <div className={`rounded-lg p-2.5 text-center ${alertCount > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
          <p className={`text-[15px] font-bold ${alertCount > 0 ? 'text-red-600' : 'text-green-600'}`}>{alertCount}</p>
          <p className="text-[9px] text-muted-foreground">Red Alerts</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-2.5 text-center">
          <p className="text-[15px] font-bold text-[#E67E22]">{stat.students_at_risk.toLocaleString()}</p>
          <p className="text-[9px] text-muted-foreground">At Risk</p>
        </div>
      </div>

      <div className="flex gap-2 text-[11px]">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#1B4F72] text-white rounded-lg hover:bg-[#154360] transition-colors font-medium">
          <Download className="w-3.5 h-3.5" />
          Export DHIS2
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/70 transition-colors font-medium border border-border">
          <FileText className="w-3.5 h-3.5" />
          PDF Report
        </button>
      </div>
    </div>
  );
}

export default function DistrictReports() {
  const { isAdmin, login } = useAdminAuth();
  const [lastSync] = useState(new Date().toLocaleString('en-UG', { timeZone: 'Africa/Kampala' }));

  if (!isAdmin) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-[#1B4F72]/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-[#1B4F72]" />
          </div>
          <h2 className="text-[20px] font-bold text-[#1B4F72] mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground text-[13px] mb-5">District reports are restricted to authorized health system administrators.</p>
          <button
            onClick={login}
            className="bg-[#E67E22] hover:bg-[#D35400] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Login as Health Worker
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* DHIS2 Banner */}
      <div className="bg-white rounded-xl border border-green-200 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-green-800">DHIS2 Export Status: <span className="text-green-600">Active</span></p>
              <p className="text-[12px] text-green-600/80">Uganda Ministry of Health · National Health Data Warehouse</p>
            </div>
          </div>
          <div className="ml-auto flex flex-wrap gap-3 text-[12px]">
            <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-700">API Connected</span>
            </div>
            <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
              <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-blue-700">Last Sync: {lastSync} EAT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: FileText, label: 'Districts Monitored', value: DISTRICT_STATS.length, color: '#1B4F72' },
          { icon: AlertTriangle, label: 'Active Alert Zones', value: DISTRICT_STATS.filter(d => d.alerts > 0).length, color: '#C0392B' },
          { icon: Users, label: 'Total Students At Risk', value: DISTRICT_STATS.reduce((s, d) => s + d.students_at_risk, 0).toLocaleString(), color: '#E67E22' },
          { icon: CheckCircle, label: 'DHIS2 Synced', value: `${DISTRICT_STATS.filter(d => d.dhis2_sync === 'Active').length}/${DISTRICT_STATS.length}`, color: '#1E8449' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4" style={{ color }} />
              <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* District Cards */}
      <div>
        <h3 className="text-[14px] font-semibold text-[#1B4F72] mb-3">District Health Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {DISTRICT_STATS.map(stat => (
            <DistrictCard key={stat.district} stat={stat} />
          ))}
        </div>
      </div>

      {/* Export note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-[12px] text-blue-700">
        <strong>DHIS2 Integration Note:</strong> All sentinel data is structured to comply with DHIS2 data exchange standards (ADX/JSON). In production, exports will push directly to Uganda MOH's national health information system via the DHIS2 Web API. This prototype simulates the export endpoint.
      </div>
    </div>
  );
}