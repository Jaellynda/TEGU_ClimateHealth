import React, { useState, useEffect } from 'react';
import { SCHOOLS, SENSOR_READINGS, getPM25Level } from '@/lib/schpData';
import { fetchAllUgandaReadings } from '@/lib/airqo';
import { Radio, Thermometer, Wind, Droplets, Activity, CheckCircle, AlertTriangle, Clock, Wifi, WifiOff, RefreshCw } from 'lucide-react';

function StatusDot({ status }) {
  const colors = {
    'Red Alert': 'bg-red-500',
    'Warning': 'bg-orange-500',
    'Caution': 'bg-yellow-400',
    'Normal': 'bg-green-500',
    'Offline': 'bg-gray-400',
  };
  return <span className={`w-2.5 h-2.5 rounded-full inline-block ${colors[status] || 'bg-gray-400'} ${status === 'Red Alert' ? 'animate-pulse' : ''}`} />;
}

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-300">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      LIVE AIRQO DATA
    </span>
  );
}

function SimBadge() {
  return (
    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-yellow-300">
      SIMULATED DATA
    </span>
  );
}

function SensorCard({ site, isLive }) {
  const pm25Level = site.pm25 != null ? getPM25Level(site.pm25) : null;
  const isAlert = site.status === 'Red Alert';

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-4 transition-all ${isAlert ? 'border-red-300 shadow-red-100' : 'border-border'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            {site.has_sensor
              ? <Radio className={`w-4 h-4 ${isAlert ? 'text-red-500' : 'text-[#1B4F72]'}`} />
              : <Radio className="w-4 h-4 text-gray-300" />
            }
            <p className="text-[13px] font-semibold text-foreground">{site.name}</p>
          </div>
          <div className="flex items-center gap-2 ml-6">
            <p className="text-[11px] text-muted-foreground">{site.district}</p>
            {isLive ? <LiveBadge /> : <SimBadge />}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          {site.has_sensor ? (
            <>
              <StatusDot status={site.status} />
              <span className="font-medium" style={{ color: pm25Level?.color }}>{site.status}</span>
            </>
          ) : (
            <span className="text-gray-400 text-[11px]">Offline</span>
          )}
        </div>
      </div>

      {site.has_sensor && site.pm25 != null ? (
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted/50 rounded-lg p-2.5 text-center">
            <Wind className="w-3.5 h-3.5 text-[#1B4F72] mx-auto mb-1" />
            <p className="text-[15px] font-bold" style={{ color: pm25Level?.color }}>{site.pm25}</p>
            <p className="text-[9px] text-muted-foreground">PM2.5 μg/m³</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2.5 text-center">
            <Thermometer className="w-3.5 h-3.5 text-[#E67E22] mx-auto mb-1" />
            <p className="text-[15px] font-bold text-[#E67E22]">
              {site.heat_index != null ? `${site.heat_index}°` : site.temperature != null ? `${site.temperature}°` : '—'}
            </p>
            <p className="text-[9px] text-muted-foreground">{site.heat_index != null ? 'Heat Index' : 'Temp'}</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-2.5 text-center">
            <Droplets className="w-3.5 h-3.5 text-blue-500 mx-auto mb-1" />
            <p className="text-[15px] font-bold text-blue-600">{site.humidity != null ? `${site.humidity}%` : '—'}</p>
            <p className="text-[9px] text-muted-foreground">Humidity</p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-[12px] text-gray-400">No sensor data available</p>
        </div>
      )}

      <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {site.timestamp
            ? `Updated ${new Date(site.timestamp).toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' })} EAT`
            : '—'}
        </div>
        <div className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${site.has_sensor ? 'bg-green-500' : 'bg-gray-300'}`} />
          {site.has_sensor ? 'AirQo Node Active' : 'Node Pending'}
        </div>
      </div>
    </div>
  );
}

// Normalize mock SENSOR_READINGS into the same shape as live data
function buildSimulatedSites() {
  return SCHOOLS.map(school => {
    const r = SENSOR_READINGS.find(r => r.school_id === school.id);
    return {
      id: school.id,
      name: school.name,
      district: school.district,
      lat: school.lat,
      lng: school.lng,
      pm25: r?.pm25 ?? null,
      temperature: r?.temperature ?? null,
      humidity: r?.humidity ?? null,
      heat_index: r?.heat_index ?? null,
      status: r?.status ?? 'Offline',
      timestamp: r?.timestamp ?? null,
      has_sensor: school.has_sensor,
    };
  });
}

export default function SensorNetwork() {
  const [sites, setSites] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllUgandaReadings();
      if (data.length > 0) {
        setSites(data);
        setIsLive(true);
      } else {
        setSites(buildSimulatedSites());
        setIsLive(false);
        setError('API returned no sites — showing simulated data.');
      }
    } catch (err) {
      setSites(buildSimulatedSites());
      setIsLive(false);
      setError(`AirQo API unavailable — showing simulated data. (${err.message})`);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  }

  useEffect(() => { loadData(); }, []);

  const activeNodes = sites.filter(s => s.has_sensor).length;
  const alertNodes = sites.filter(s => s.status === 'Red Alert').length;
  const normalNodes = sites.filter(s => s.status === 'Normal').length;

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">
      {/* Header stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Radio, label: 'Active Nodes', value: loading ? '…' : activeNodes, color: '#1B4F72' },
          { icon: AlertTriangle, label: 'Red Alert Nodes', value: loading ? '…' : alertNodes, color: '#C0392B' },
          { icon: CheckCircle, label: 'Normal Status', value: loading ? '…' : normalNodes, color: '#1E8449' },
          { icon: Activity, label: 'Total Sites', value: loading ? '…' : sites.length || '—', color: '#E67E22' },
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

      {/* Status banner */}
      {loading ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
          <div>
            <p className="text-[13px] font-semibold text-blue-800">Loading live AirQo Uganda data…</p>
            <p className="text-[11px] text-blue-600">Fetching real-time air quality measurements from the AirQo network.</p>
          </div>
        </div>
      ) : isLive ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <Wifi className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[13px] font-semibold text-green-800">Live AirQo Data</p>
              <LiveBadge />
            </div>
            <p className="text-[11px] text-green-700">
              {sites.length} Uganda sites loaded from <code className="bg-green-100 px-1 rounded">api.airqo.net/api/v2</code>
              {lastRefresh && ` · Refreshed at ${lastRefresh.toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit' })}`}
            </p>
          </div>
          <button onClick={loadData} className="flex items-center gap-1.5 text-[11px] font-medium text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 px-2.5 py-1.5 rounded-lg transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <WifiOff className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[13px] font-semibold text-yellow-800">Simulated Data (API Fallback)</p>
              <SimBadge />
            </div>
            {error && <p className="text-[11px] text-yellow-700">{error}</p>}
          </div>
          <button onClick={loadData} className="flex items-center gap-1.5 text-[11px] font-medium text-yellow-700 hover:text-yellow-900 bg-yellow-100 hover:bg-yellow-200 px-2.5 py-1.5 rounded-lg transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Sensor Cards Grid */}
      <div>
        <h3 className="text-[14px] font-semibold text-[#1B4F72] mb-3">
          {isLive ? `AirQo Uganda Network — ${sites.length} Sites` : 'DePIN Sentinel Node Status — Kampala & Jinja (Simulated)'}
        </h3>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-border shadow-sm p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(3)].map((_, j) => <div key={j} className="h-16 bg-gray-100 rounded-lg" />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {sites.map(site => (
              <SensorCard key={site.id} site={site} isLive={isLive} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
