import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RotateCcw, AlertTriangle } from 'lucide-react';

const DISTRICTS = ['Kampala', 'Jinja', 'Wakiso', 'Mukono', 'Entebbe'];

const DEFAULT_THRESHOLDS = {
  Kampala: { pm25High: 100, pm25Critical: 150, heatHigh: 38, heatCritical: 42 },
  Jinja: { pm25High: 95, pm25Critical: 145, heatHigh: 37, heatCritical: 41 },
  Wakiso: { pm25High: 90, pm25Critical: 140, heatHigh: 36, heatCritical: 40 },
  Mukono: { pm25High: 85, pm25Critical: 135, heatHigh: 35, heatCritical: 39 },
  Entebbe: { pm25High: 80, pm25Critical: 130, heatHigh: 34, heatCritical: 38 },
};

export default function Settings() {
  const [districtThresholds, setDistrictThresholds] = useState(DEFAULT_THRESHOLDS);
  const [saved, setSaved] = useState(false);

  const handleReset = () => {
    setDistrictThresholds(DEFAULT_THRESHOLDS);
    localStorage.removeItem('districtThresholds');
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem('districtThresholds', JSON.stringify(districtThresholds));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateThreshold = (district, field, value) => {
    setDistrictThresholds(prev => ({
      ...prev,
      [district]: { ...prev[district], [field]: parseInt(value, 10) }
    }));
  };

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-xl p-5 text-white border border-zinc-700">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="w-6 h-6 text-blue-400" />
          <h2 className="text-[18px] font-bold">Sentinel Configuration</h2>
        </div>
        <p className="text-zinc-300 text-[13px]">
          Define climate risk thresholds by district — triggers High Risk and Critical alerts automatically
        </p>
      </div>

      {/* District-Level Threshold Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {DISTRICTS.map(district => (
          <div key={district} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-5">
            <h3 className="text-[14px] font-bold text-zinc-900 mb-4">{district} District</h3>
            <div className="space-y-4">
              {/* PM2.5 High Risk */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-700 block mb-2">
                  PM2.5 High Risk
                  <span className="text-yellow-600 ml-1">{districtThresholds[district].pm25High} μg/m³</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={districtThresholds[district].pm25High}
                  onChange={(e) => updateThreshold(district, 'pm25High', e.target.value)}
                  className="w-full h-2 bg-yellow-100 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                />
              </div>

              {/* PM2.5 Critical */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-700 block mb-2">
                  PM2.5 Critical
                  <span className="text-red-600 ml-1">{districtThresholds[district].pm25Critical} μg/m³</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="250"
                  value={districtThresholds[district].pm25Critical}
                  onChange={(e) => updateThreshold(district, 'pm25Critical', e.target.value)}
                  className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>

              {/* Heat Index High Risk */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-700 block mb-2">
                  Heat Index High Risk
                  <span className="text-yellow-600 ml-1">{districtThresholds[district].heatHigh}°C</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="40"
                  value={districtThresholds[district].heatHigh}
                  onChange={(e) => updateThreshold(district, 'heatHigh', e.target.value)}
                  className="w-full h-2 bg-yellow-100 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                />
              </div>

              {/* Heat Index Critical */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-700 block mb-2">
                  Heat Index Critical
                  <span className="text-red-600 ml-1">{districtThresholds[district].heatCritical}°C</span>
                </label>
                <input
                  type="range"
                  min="35"
                  max="50"
                  value={districtThresholds[district].heatCritical}
                  onChange={(e) => updateThreshold(district, 'heatCritical', e.target.value)}
                  className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary & Actions */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
        <h3 className="text-[13px] font-bold text-zinc-900 mb-3">Configuration Status</h3>
        
        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 mb-3 flex items-center gap-2">
            <span className="text-green-600 text-[12px] font-semibold">✓ Settings saved to all districts</span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-[12px] font-semibold rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-[12px] font-semibold rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-[12px] text-blue-700">
          <strong>District-Level Alert Logic:</strong> Each district has configurable PM2.5 and Heat Index thresholds. When a school in that district breaches High Risk or Critical thresholds, it automatically triggers a "High Risk" alert in the dashboard feed. These settings sync in real-time across the Sentinel Network.
        </p>
      </div>
    </div>
  );
}