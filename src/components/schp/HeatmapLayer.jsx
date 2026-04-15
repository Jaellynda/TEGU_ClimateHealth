import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// IDW (Inverse Distance Weighting) interpolation
// Generates a canvas-based heatmap overlay using sensor data points
function idwInterpolate(points, lat, lng, power = 2) {
  let numerator = 0;
  let denominator = 0;
  for (const p of points) {
    const dist = Math.sqrt(Math.pow(lat - p.lat, 2) + Math.pow(lng - p.lng, 2));
    if (dist < 0.0001) return p.value; // exactly on point
    const w = 1 / Math.pow(dist, power);
    numerator += w * p.value;
    denominator += w;
  }
  return denominator === 0 ? 0 : numerator / denominator;
}

function valueToColor(value, layer) {
  let r, g, b, a;
  if (layer === 'pm25') {
    // 0 (green) → 55 (yellow) → 100 (orange) → 150+ (red)
    if (value < 55) {
      const t = value / 55;
      r = Math.round(30 + t * (212 - 30));
      g = Math.round(132 - t * (132 - 172));
      b = Math.round(73 - t * 73);
    } else if (value < 100) {
      const t = (value - 55) / 45;
      r = Math.round(212 + t * (230 - 212));
      g = Math.round(172 - t * (172 - 126));
      b = 0;
    } else if (value < 150) {
      const t = (value - 100) / 50;
      r = Math.round(230 + t * (192 - 230));
      g = Math.round(126 - t * (126 - 57));
      b = Math.round(t * 43);
    } else {
      r = 192; g = 57; b = 43;
    }
    a = Math.min(0.65, 0.25 + (value / 200) * 0.4);
  } else {
    // heat index: 28 (green) → 34 (yellow) → 40 (orange) → 44+ (red)
    if (value < 34) {
      const t = Math.max(0, (value - 28)) / 6;
      r = Math.round(30 + t * (212 - 30));
      g = Math.round(132 + t * (172 - 132));
      b = Math.round(73 - t * 73);
    } else if (value < 40) {
      const t = (value - 34) / 6;
      r = Math.round(212 + t * (230 - 212));
      g = Math.round(172 - t * (172 - 126));
      b = 0;
    } else {
      const t = Math.min(1, (value - 40) / 4);
      r = Math.round(230 - t * (230 - 192));
      g = Math.round(126 - t * (126 - 57));
      b = Math.round(t * 43);
    }
    a = Math.min(0.6, 0.2 + ((value - 28) / 20) * 0.4);
  }
  return `rgba(${r},${g},${b},${a})`;
}

export default function HeatmapLayer({ readings, schools, activeLayer }) {
  const map = useMap();

  useEffect(() => {
    const points = schools
      .filter(s => s.has_sensor)
      .map(s => {
        const r = readings.find(r => r.school_id === s.id);
        if (!r) return null;
        return {
          lat: s.lat,
          lng: s.lng,
          value: activeLayer === 'pm25' ? r.pm25 : r.heat_index,
        };
      })
      .filter(Boolean);

    if (points.length === 0) return;

    // Build canvas overlay
    const bounds = map.getBounds().pad(0.3);
    const size = 120; // grid resolution
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const latStep = (bounds.getNorth() - bounds.getSouth()) / size;
    const lngStep = (bounds.getEast() - bounds.getWest()) / size;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const lat = bounds.getNorth() - row * latStep;
        const lng = bounds.getWest() + col * lngStep;
        const val = idwInterpolate(points, lat, lng, 2.5);
        ctx.fillStyle = valueToColor(val, activeLayer);
        ctx.fillRect(col, row, 1, 1);
      }
    }

    const imageUrl = canvas.toDataURL();
    const overlay = L.imageOverlay(imageUrl, bounds, { opacity: 1, interactive: false });
    overlay.addTo(map);

    return () => {
      map.removeLayer(overlay);
    };
  }, [map, readings, schools, activeLayer]);

  return null;
}