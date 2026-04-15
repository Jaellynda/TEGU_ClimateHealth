import React, { useState } from 'react';
import { SCHOOLS, SENSOR_READINGS, getPM25Level } from '@/lib/schpData';
import { Radio, Thermometer, Wind, Droplets, Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

function StatusDot({ status }) {
  const colors = {
    'Red Alert': 'bg-red-500',
    'Warning': 'bg-orange-500',
    'Caution': 'bg-yellow-400',
    'Normal': 'bg-green-500',
  };
  return <span className={`w-2.5 h-2.5 rounded-full inline-block ${colors[status] || 'bg-gray-400'} ${status === 'Red Alert' ? 'animate-pulse' : ''}`} />;
}

function SensorCard({ school, reading }) {
  const pm25Level = reading ? getPM25Level(reading.pm25) : null;
  const isAlert = reading?.status === 'Red Alert';

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-4 transition-all ${isAlert ? 'border-red-300 shadow-red-100' : 'border-border'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            {school.has_sensor
              ? <Radio className={`w-4 h-4 ${isAlert ? 'text-red-500' : 'text-[#1B4F72]'}`} />
              : <Radio className="w-4 h-4 text-gray-300" />
            }
            <p className="text-[13px] font-semibold text-foreground">{school.name}</p>
          </div>
          <p className="text-[11px] text-muted-foreground ml-6">{school.district} · Node {school.id.toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          {reading ? (
            <>
              <StatusDot status={reading.status} />
              <span className="font-medium" style={{ color: pm25Level?.color }}>{reading.status}</span>
            </>
          ) : (
            <span className="text-gray-400 text-[11px]">Offline</span>
          )}
        </div>
      </div>

      {reading ? (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted/50 rounded-lg p-2.5 text-center">
            <Wind className="w-3.5 h-3.5 text-[#1B4F72] mx-auto mb-1" />
            <p className="text-[15px] font-bold" style={{ color: pm25Level?.color }}>{reading.pm25}</p>
            <p className="text-[9px] text-muted-foreground">PM2.5 μg/m³</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2.5 text-center">
            <Thermometer className="w-3.5 h-3.5 text-[#E67E22] mx-auto mb-1" />
            <p className="text-[15px] font-bold text-[#E67E22]">{reading.heat_index}°</p>
            <p className="text-[9px] text-muted-foreground">Heat Index</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2.5 text-center">
            <Droplets className="w-3.5 h-3.5 text-blue-500 mx-auto mb-1" />
            <p className="text-[15px] font-bold text-blue-600">{reading.humidity}%</p>
            <p className="text-[9px] text-muted-foreground">Humidity</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-[12px] text-gray-400">No sensor installed</p>
          <p className="text-[10px] text-gray-300 mt-0.5">Planned deployment Q3 2026</p>
        </div>
      )}

      <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {reading ? `Updated ${new Date(reading.timestamp).toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' })} EAT` : '—'}
        </div>
        <div className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${school.has_sensor ? 'bg-green-500' : 'bg-gray-300'}`} />
          {school.has_sensor ? 'AirQo Node Active' : 'Node Pending'}
        </div>
      </div>
    </div>
  );
}

export default function SensorNetwork() {
  const readingMap = Object.fromEntries(SENSOR_READINGS.map(r => [r.school_id, r]));
  const activeNodes = SCHOOLS.filter(s => s.has_sensor).length;
  const alertNodes = SENSOR_READINGS.filter(r => r.status === 'Red Alert').length;

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Radio, label: 'Active Nodes', value: activeNodes, color: '#1B4F72' },
          { icon: AlertTriangle, label: 'Red Alert Nodes', value: alertNodes, color: '#C0392B' },
          { icon: CheckCircle, label: 'Normal Status', value: SENSOR_READINGS.filter(r => r.status === 'Normal').length, color: '#1E8449' },
          { icon: Activity, label: 'Data Points Today', value: '1,248', color: '#E67E22' },
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

      {/* AirQo API Banner */}
      <div className="bg-[#1B4F72]/5 border border-[#1B4F72]/20 rounded-xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#1B4F72] flex items-center justify-center flex-shrink-0">
          <Activity className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold text-[#1B4F72]">AirQo Uganda API Integration</p>
          <p className="text-[11px] text-muted-foreground">Live feed prepared · Endpoint: <code className="bg-muted px-1 rounded">api.airqo.net/api/v2/devices/readings</code> · API Key configured via environment variable</p>
        </div>
        <span className="bg-green-100 text-green-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-green-200">Ready</span>
      </div>

      {/* Sensor Cards Grid */}
      <div>
        <h3 className="text-[14px] font-semibold text-[#1B4F72] mb-3">DePIN Sentinel Node Status — Kampala & Jinja</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {SCHOOLS.map(school => (
            <SensorCard key={school.id} school={school} reading={readingMap[school.id]} />
          ))}
        </div>
      </div>
    </div>
  );
}