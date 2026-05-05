import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { SCHOOLS, SENSOR_READINGS, getRiskColor, getVulnerabilityColor, getPM25Level, DISPATCH_LOGS } from '@/lib/schpData';
import { AlertTriangle, Users, Thermometer, Wind, Activity, MessageCircle, Layers, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeatmapLayer from '@/components/schp/HeatmapLayer';
import WhatsAppNotifier from '@/components/schp/WhatsAppNotifier';
import RiskSummaryWidget from '@/components/schp/RiskSummaryWidget';

const LAYERS = [
  { id: 'pm25', label: 'Air Quality (PM2.5)' },
  { id: 'heat', label: 'Heat Index' },
  { id: 'vulnerability', label: 'School Vulnerability' },
];

function getMarkerColor(school, reading, layer) {
  if (!reading) return '#6B7280';
  if (layer === 'pm25') return getPM25Level(reading.pm25).color;
  if (layer === 'heat') {
    if (reading.heat_index > 42) return '#C0392B';
    if (reading.heat_index > 38) return '#E67E22';
    if (reading.heat_index > 34) return '#D4AC0D';
    return '#1E8449';
  }
  if (layer === 'vulnerability') return getVulnerabilityColor(school.vulnerability_score);
  return '#2E86C1';
}

function AlertBadge({ status }) {
  if (status !== 'Red Alert') return null;
  return (
    <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
      <AlertTriangle className="w-3 h-3" /> RED ALERT
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-border shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4" style={{ color }} />
        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

export default function LiveMap() {
  const [activeLayer, setActiveLayer] = useState('pm25');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [whatsappDispatch, setWhatsappDispatch] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const readingMap = Object.fromEntries(SENSOR_READINGS.map(r => [r.school_id, r]));
  const alertCount = SENSOR_READINGS.filter(r => r.status === 'Red Alert').length;
  const totalStudentsAtRisk = SCHOOLS
    .filter(s => readingMap[s.id]?.status === 'Red Alert')
    .reduce((sum, s) => sum + s.student_population, 0);

  return (
    <div className="p-4 md:p-6 space-y-4 animate-fade-in">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={AlertTriangle} label="Red Alerts" value={alertCount} color="#C0392B" />
        <StatCard icon={Users} label="Students at Risk" value={totalStudentsAtRisk.toLocaleString()} color="#E67E22" />
        <StatCard icon={Wind} label="Avg PM2.5" value="136 μg/m³" color="#1B4F72" />
        <StatCard icon={Thermometer} label="Peak Heat Index" value="44.5°C" color="#E67E22" />
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap gap-2 items-center">
        {LAYERS.map(l => (
          <button
            key={l.id}
            onClick={() => setActiveLayer(l.id)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
              activeLayer === l.id
                ? 'bg-[#1B4F72] text-white shadow-md'
                : 'bg-white text-muted-foreground border border-border hover:border-[#1B4F72]'
            }`}
          >
            {l.label}
          </button>
        ))}

        {/* Heatmap toggle */}
        {activeLayer !== 'vulnerability' && (
          <button
            onClick={() => setShowHeatmap(h => !h)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all border ${
              showHeatmap
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-muted-foreground border-border hover:border-purple-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Interpolated Heatmap
          </button>
        )}

        <div className="ml-auto flex items-center gap-1.5 text-[11px] text-green-600 font-medium bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          AirQo Feed Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden border border-border shadow-md" style={{ height: '460px' }}>
          <MapContainer
            center={[0.38, 32.85]}
            zoom={9}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* IDW Interpolated Heatmap */}
            {showHeatmap && activeLayer !== 'vulnerability' && (
              <HeatmapLayer
                readings={SENSOR_READINGS}
                schools={SCHOOLS}
                activeLayer={activeLayer}
              />
            )}

            {SCHOOLS.map(school => {
              const reading = readingMap[school.id];
              const color = getMarkerColor(school, reading, activeLayer);
              const isAlert = reading?.status === 'Red Alert';
              return (
                <React.Fragment key={school.id}>
                  {isAlert && (
                    <CircleMarker
                      center={[school.lat, school.lng]}
                      radius={22}
                      pathOptions={{ color, fillColor: color, fillOpacity: 0.15, weight: 1 }}
                    />
                  )}
                  <CircleMarker
                    center={[school.lat, school.lng]}
                    radius={isAlert ? 10 : 8}
                    pathOptions={{ color: 'white', fillColor: color, fillOpacity: 0.9, weight: 2 }}
                    eventHandlers={{ click: () => setSelectedSchool(school) }}
                  >
                    <Popup>
                      <div className="font-inter text-[13px] min-w-[200px]">
                        <p className="font-bold text-[#1B4F72] mb-1">{school.name}</p>
                        <p className="text-gray-500 mb-2">{school.district} District</p>
                        {reading ? (
                          <div className="space-y-1">
                            <div className="flex justify-between"><span>PM2.5</span><strong style={{ color: getPM25Level(reading.pm25).color }}>{reading.pm25} μg/m³</strong></div>
                            <div className="flex justify-between"><span>Heat Index</span><strong>{reading.heat_index}°C</strong></div>
                            <div className="flex justify-between"><span>Status</span><strong style={{ color }}>{reading.status}</strong></div>
                            <div className="flex justify-between"><span>Students</span><strong>{school.student_population.toLocaleString()}</strong></div>
                          </div>
                        ) : <p className="text-gray-400">No sensor data</p>}
                      </div>
                    </Popup>
                  </CircleMarker>
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>

        {/* School List */}
        <div className="space-y-2 overflow-y-auto max-h-[460px] pr-1">
          <h3 className="text-[13px] font-semibold text-[#1B4F72] mb-3">TEGU Sentinel Schools</h3>
          {SCHOOLS.map(school => {
            const reading = readingMap[school.id];
            const color = getMarkerColor(school, reading, activeLayer);
            const dispatch = DISPATCH_LOGS.find(d => d.school_id === school.id);
            return (
              <div key={school.id} className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
                <button
                  onClick={() => setSelectedSchool(school)}
                  className="w-full text-left p-3 hover:bg-muted/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-foreground truncate">{school.name}</p>
                      <p className="text-[11px] text-muted-foreground">{school.district}</p>
                    </div>
                    <span className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: color }} />
                  </div>
                  {reading && (
                    <div className="mt-2 flex gap-3 text-[11px] text-muted-foreground">
                      <span>PM2.5: <strong style={{ color }}>{reading.pm25}</strong></span>
                      <span>Hi: <strong>{reading.heat_index}°C</strong></span>
                      <span><Users className="w-3 h-3 inline" /> {school.student_population}</span>
                    </div>
                  )}
                  {reading?.status === 'Red Alert' && (
                    <div className="mt-1.5"><AlertBadge status={reading.status} /></div>
                  )}
                </button>
                {/* View Profile link */}
                <Link
                  to={`/school/${school.id}`}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold border-t border-border bg-blue-50 text-[#1B4F72] hover:bg-blue-100 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View School Profile
                </Link>
                {/* WhatsApp alert button for schools with dispatch orders */}
                {dispatch && (
                  <button
                    onClick={() => setWhatsappDispatch(whatsappDispatch?.school_id === school.id ? null : dispatch)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold border-t border-border transition-colors ${
                      whatsappDispatch?.school_id === school.id
                        ? 'bg-[#25D366] text-white'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Notify Admin via WhatsApp
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* WhatsApp Notifier Panel */}
      {whatsappDispatch && (
        <WhatsAppNotifier
          dispatch={whatsappDispatch}
          onClose={() => setWhatsappDispatch(null)}
        />
      )}

      {/* Risk Summary Widget */}
      <RiskSummaryWidget />

      {/* Heatmap legend note */}
      {showHeatmap && activeLayer !== 'vulnerability' && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-center gap-3 text-[12px] text-purple-800">
          <Layers className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <span>
            <strong>Interpolated Heatmap active</strong> — IDW spatial interpolation estimates {activeLayer === 'pm25' ? 'PM2.5 air quality' : 'heat index'} across the full Kampala–Jinja corridor beyond the 8 sensor points. Darker red zones = highest interpolated risk.
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white rounded-xl p-4 border border-border shadow-sm">
        <p className="text-[12px] font-semibold text-[#1B4F72] mb-3">
          {activeLayer === 'pm25' ? 'PM2.5 Air Quality Index' : activeLayer === 'heat' ? 'Heat Index Scale' : 'Vulnerability Score'}
        </p>
        <div className="flex flex-wrap gap-4">
          {[
            { color: '#1E8449', label: activeLayer === 'pm25' ? 'Good (<55 μg/m³)' : activeLayer === 'heat' ? 'Safe (<34°C)' : 'Low Risk (<30)' },
            { color: '#D4AC0D', label: activeLayer === 'pm25' ? 'Caution (55–100)' : activeLayer === 'heat' ? 'Caution (34–38°C)' : 'Moderate (30–50)' },
            { color: '#E67E22', label: activeLayer === 'pm25' ? 'Warning (100–150)' : activeLayer === 'heat' ? 'Warning (38–42°C)' : 'High (50–70)' },
            { color: '#C0392B', label: activeLayer === 'pm25' ? 'Red Alert (>150)' : activeLayer === 'heat' ? 'Red Alert (>42°C)' : 'Critical (>70)' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[11px] text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}