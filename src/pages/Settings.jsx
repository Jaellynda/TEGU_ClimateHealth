import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RotateCcw, AlertTriangle } from 'lucide-react';

export default function Settings() {
  const [pm25_high_risk, setPm25HighRisk] = useState(100);
  const [pm25_critical, setPm25Critical] = useState(150);
  const [heat_index_high_risk, setHeatIndexHighRisk] = useState(38);
  const [heat_index_critical, setHeatIndexCritical] = useState(42);
  const [saved, setSaved] = useState(false);

  const handleReset = () => {
    setPm25HighRisk(100);
    setPm25Critical(150);
    setHeatIndexHighRisk(38);
    setHeatIndexCritical(42);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
          Define climate risk thresholds that automatically trigger High Risk and Critical Risk status
        </p>
      </div>

      {/* PM2.5 Settings */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
        <h3 className="text-[14px] font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600" />
          PM2.5 Air Quality Thresholds (μg/m³)
        </h3>
        
        <div className="space-y-5">
          {/* High Risk */}
          <div>
            <label className="text-[12px] font-semibold text-zinc-700 block mb-2">
              High Risk Threshold
              <span className="text-yellow-600 ml-1">↕ {pm25_high_risk} μg/m³</span>
            </label>
            <input
              type="range"
              min="50"
              max="200"
              value={pm25_high_risk}
              onChange={(e) => setPm25HighRisk(parseInt(e.target.value))}
              className="w-full h-2 bg-yellow-100 rounded-lg appearance-none cursor-pointer accent-yellow-600"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>50</span>
              <span>200</span>
            </div>
            <p className="text-[11px] text-zinc-600 mt-2">Trigger action for schools with moderate air pollution</p>
          </div>

          {/* Critical */}
          <div>
            <label className="text-[12px] font-semibold text-zinc-700 block mb-2">
              Critical Risk Threshold
              <span className="text-red-600 ml-1">↕ {pm25_critical} μg/m³</span>
            </label>
            <input
              type="range"
              min="100"
              max="300"
              value={pm25_critical}
              onChange={(e) => setPm25Critical(parseInt(e.target.value))}
              className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>100</span>
              <span>300</span>
            </div>
            <p className="text-[11px] text-zinc-600 mt-2">Trigger emergency dispatch and sentinel alerts</p>
          </div>
        </div>
      </div>

      {/* Heat Index Settings */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
        <h3 className="text-[14px] font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-600" />
          Heat Index Thresholds (°C)
        </h3>

        <div className="space-y-5">
          {/* High Risk */}
          <div>
            <label className="text-[12px] font-semibold text-zinc-700 block mb-2">
              High Risk Threshold
              <span className="text-yellow-600 ml-1">↕ {heat_index_high_risk}°C</span>
            </label>
            <input
              type="range"
              min="30"
              max="45"
              step="0.5"
              value={heat_index_high_risk}
              onChange={(e) => setHeatIndexHighRisk(parseFloat(e.target.value))}
              className="w-full h-2 bg-yellow-100 rounded-lg appearance-none cursor-pointer accent-yellow-600"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>30°C</span>
              <span>45°C</span>
            </div>
            <p className="text-[11px] text-zinc-600 mt-2">Dehydration and heat exhaustion risk elevated</p>
          </div>

          {/* Critical */}
          <div>
            <label className="text-[12px] font-semibold text-zinc-700 block mb-2">
              Critical Risk Threshold
              <span className="text-red-600 ml-1">↕ {heat_index_critical}°C</span>
            </label>
            <input
              type="range"
              min="35"
              max="50"
              step="0.5"
              value={heat_index_critical}
              onChange={(e) => setHeatIndexCritical(parseFloat(e.target.value))}
              className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>35°C</span>
              <span>50°C</span>
            </div>
            <p className="text-[11px] text-zinc-600 mt-2">Heatstroke risk — emergency cooling and hydration dispatch</p>
          </div>
        </div>
      </div>

      {/* Summary & Actions */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
        <h3 className="text-[13px] font-bold text-zinc-900 mb-3">Active Configuration</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-lg p-3 border border-yellow-200">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">High Risk Trigger</p>
            <p className="text-[14px] font-bold text-zinc-900 mt-1">
              PM2.5 &gt; {pm25_high_risk} μg/m³
              <br />
              <span className="text-[12px] font-normal">or Heat &gt; {heat_index_high_risk}°C</span>
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 border border-red-200">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Critical Risk Trigger</p>
            <p className="text-[14px] font-bold text-zinc-900 mt-1">
              PM2.5 &gt; {pm25_critical} μg/m³
              <br />
              <span className="text-[12px] font-normal">or Heat &gt; {heat_index_critical}°C</span>
            </p>
          </div>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 mb-3 flex items-center gap-2">
            <span className="text-green-600 text-[12px] font-semibold">✓ Settings saved</span>
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
          <strong>Sentinel Logic:</strong> These thresholds automatically classify schools in monitored zones. When a school breaches either threshold, it triggers the dispatch engine to send supplies based on the school's verified population capacity (students + staff). In production, these settings sync across all health worker mobile apps and the DHIS2 alert system.
        </p>
      </div>
    </div>
  );
}