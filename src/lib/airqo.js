const BASE_URL = 'https://api.airqo.net/api/v2';

function getToken() {
  return import.meta.env.VITE_AIRQO_TOKEN;
}

function pm25ToStatus(pm25) {
  if (pm25 > 150) return 'Red Alert';
  if (pm25 > 100) return 'Warning';
  if (pm25 > 55) return 'Caution';
  return 'Normal';
}

export async function fetchUgandaSites() {
  const token = getToken();
  const url = `${BASE_URL}/devices/sites?token=${token}&country=Uganda`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sites fetch failed: ${res.status}`);
  const json = await res.json();
  // API returns { sites: [...] } or { data: [...] }
  return json.sites ?? json.data ?? [];
}

export async function fetchSiteMeasurements(siteId) {
  const token = getToken();
  const url = `${BASE_URL}/devices/measurements/sites/${siteId}/recent?token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Measurements fetch failed for ${siteId}: ${res.status}`);
  const json = await res.json();
  return json.measurements ?? json.data ?? [];
}

// Returns an array of normalized sensor objects ready for display.
// Each object: { id, name, district, lat, lng, pm25, temperature, humidity, heat_index, status, timestamp }
export async function fetchAllUgandaReadings() {
  const sites = await fetchUgandaSites();
  if (!sites.length) return [];

  const results = await Promise.allSettled(
    sites.map(async (site) => {
      const siteId = site._id ?? site.id;
      const measurements = await fetchSiteMeasurements(siteId);
      const latest = measurements[0] ?? null;

      const pm25Raw = latest?.pm2_5?.value ?? latest?.pm25?.value ?? latest?.pm2_5 ?? latest?.pm25 ?? null;
      const pm25 = pm25Raw != null ? Math.round(pm25Raw) : null;

      const temp = latest?.temperature?.value ?? latest?.temperature ?? null;
      const humidity = latest?.humidity?.value ?? latest?.humidity ?? null;
      // Simplified heat index approximation when temp & humidity available
      let heatIndex = null;
      if (temp != null && humidity != null) {
        heatIndex = Math.round(temp + 0.33 * (humidity / 100 * 6.105 * Math.exp((17.27 * temp) / (237.7 + temp))) - 4);
      }

      return {
        id: siteId,
        name: site.name ?? site.description ?? 'Unknown Site',
        district: site.district ?? site.region ?? site.city ?? 'Uganda',
        lat: site.latitude ?? site.lat ?? 0,
        lng: site.longitude ?? site.lng ?? 0,
        pm25,
        temperature: temp != null ? Math.round(temp * 10) / 10 : null,
        humidity: humidity != null ? Math.round(humidity) : null,
        heat_index: heatIndex,
        status: pm25 != null ? pm25ToStatus(pm25) : 'Offline',
        timestamp: latest?.time ?? latest?.timestamp ?? latest?.created_at ?? new Date().toISOString(),
        has_sensor: pm25 != null,
      };
    })
  );

  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)
    .filter(r => r.lat !== 0 && r.lng !== 0); // drop sites with no coordinates
}
