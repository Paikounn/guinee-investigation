// GuineaMap.tsx — Interactive Leaflet map of Guinea with investigation case markers
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CORPS_META, type CorpsId } from './CorpsLogos';

// Fix Leaflet default marker icon issue with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ─── Guinea prefecture coordinates ──────────────────────────────────────────
export const GUINEA_PREFECTURES: { name: string; lat: number; lng: number; region: string }[] = [
  // Conakry
  { name: 'Conakry',        lat: 9.6412,  lng: -13.5784, region: 'Conakry' },
  // Boké
  { name: 'Boké',           lat: 10.9406, lng: -14.2918, region: 'Boké' },
  { name: 'Boffa',          lat: 10.1831, lng: -14.0399, region: 'Boké' },
  { name: 'Fria',           lat: 10.3706, lng: -13.5494, region: 'Boké' },
  { name: 'Gaoual',         lat: 11.7598, lng: -13.2009, region: 'Boké' },
  { name: 'Koundara',       lat: 12.4834, lng: -13.3018, region: 'Boké' },
  { name: 'Télimélé',       lat: 10.9000, lng: -13.0333, region: 'Boké' },
  // Kindia
  { name: 'Kindia',         lat: 10.0549, lng: -12.8670, region: 'Kindia' },
  { name: 'Coyah',          lat: 9.7054,  lng: -13.3840, region: 'Kindia' },
  { name: 'Dubréka',        lat: 9.7884,  lng: -13.5142, region: 'Kindia' },
  { name: 'Forécariah',     lat: 9.4301,  lng: -13.0793, region: 'Kindia' },
  { name: 'Mamou',          lat: 10.3786, lng: -12.0941, region: 'Mamou' },
  { name: 'Dalaba',         lat: 10.6895, lng: -12.2477, region: 'Mamou' },
  { name: 'Pita',           lat: 11.0590, lng: -12.3965, region: 'Mamou' },
  // Labé
  { name: 'Labé',           lat: 11.3181, lng: -12.2853, region: 'Labé' },
  { name: 'Koubia',         lat: 11.5800, lng: -11.8700, region: 'Labé' },
  { name: 'Lélouma',        lat: 11.3000, lng: -12.5500, region: 'Labé' },
  { name: 'Mali',           lat: 12.0833, lng: -12.3000, region: 'Labé' },
  { name: 'Tougué',         lat: 11.4333, lng: -11.6667, region: 'Labé' },
  // Faranah
  { name: 'Faranah',        lat: 10.0358, lng: -10.7415, region: 'Faranah' },
  { name: 'Dabola',         lat: 10.7505, lng: -11.1137, region: 'Faranah' },
  { name: 'Dinguiraye',     lat: 11.2999, lng: -10.7167, region: 'Faranah' },
  { name: 'Kissidougou',    lat: 9.1856,  lng: -10.1244, region: 'Faranah' },
  // Kankan
  { name: 'Kankan',         lat: 10.3833, lng: -9.3000,  region: 'Kankan' },
  { name: 'Kérouané',       lat: 9.2672,  lng: -9.0153,  region: 'Kankan' },
  { name: 'Kouroussa',      lat: 10.6493, lng: -9.8849,  region: 'Kankan' },
  { name: 'Mandiana',       lat: 10.6167, lng: -8.6833,  region: 'Kankan' },
  { name: 'Siguiri',        lat: 11.4167, lng: -9.1667,  region: 'Kankan' },
  // N'Zérékoré
  { name: "N'Zérékoré",    lat: 7.7564,  lng: -8.8179,  region: "N'Zérékoré" },
  { name: 'Beyla',          lat: 8.6878,  lng: -8.6444,  region: "N'Zérékoré" },
  { name: 'Guéckédou',      lat: 8.5667,  lng: -10.1333, region: "N'Zérékoré" },
  { name: 'Lola',           lat: 7.8235,  lng: -8.5338,  region: "N'Zérékoré" },
  { name: 'Macenta',        lat: 8.5420,  lng: -9.4680,  region: "N'Zérékoré" },
  { name: 'Yomou',          lat: 7.5667,  lng: -9.2500,  region: "N'Zérékoré" },
];

// ─── Types ───────────────────────────────────────────────────────────────────
export interface MapCase {
  id: string;
  title: string;
  caseNumber: string;
  corps: CorpsId;
  priority: 'URGENCE' | 'HAUTE' | 'NORMALE' | 'BASSE';
  status: string;
  region: string;
  lat?: number;
  lng?: number;
  suspects: number;
}

const PRIORITY_COLORS: Record<string, string> = {
  URGENCE: '#ef4444',
  HAUTE:   '#f97316',
  NORMALE: '#eab308',
  BASSE:   '#22c55e',
};

const PRIORITY_RADIUS: Record<string, number> = {
  URGENCE: 18, HAUTE: 14, NORMALE: 11, BASSE: 9,
};

// ─── Map style control ────────────────────────────────────────────────────────
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.setView(center, zoom); }, [center, zoom]);
  return null;
}

// ─── Custom SVG icon for corps markers ───────────────────────────────────────
function makeCorpsIcon(color: string, priority: string) {
  const size = PRIORITY_RADIUS[priority] * 2;
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="${color}" fill-opacity="0.85" stroke="white" stroke-width="2"/>
    <circle cx="${size/2}" cy="${size/2}" r="${size/4}" fill="white" fill-opacity="0.5"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  });
}

// ─── Main GuineaMap component ─────────────────────────────────────────────────
interface GuineaMapProps {
  cases: MapCase[];
  onCaseClick?: (caseId: string) => void;
  selectedCorps?: CorpsId | 'ALL';
  height?: string;
}

const GuineaMap: React.FC<GuineaMapProps> = ({
  cases, onCaseClick, selectedCorps = 'ALL', height = '500px'
}) => {
  // Guinea center coordinates
  const GUINEA_CENTER: [number, number] = [10.7, -11.5];
  const GUINEA_ZOOM = 7;

  // Resolve coordinates: use case lat/lng if provided, else match by region name
  const casesWithCoords = cases.map(c => {
    if (c.lat && c.lng) return { ...c };
    const pref = GUINEA_PREFECTURES.find(p =>
      p.name.toLowerCase() === c.region.toLowerCase() ||
      p.region.toLowerCase() === c.region.toLowerCase()
    );
    return {
      ...c,
      lat: pref ? pref.lat + (Math.random() - 0.5) * 0.15 : GUINEA_CENTER[0] + (Math.random() - 0.5) * 2,
      lng: pref ? pref.lng + (Math.random() - 0.5) * 0.15 : GUINEA_CENTER[1] + (Math.random() - 0.5) * 2,
    };
  });

  const filtered = selectedCorps === 'ALL'
    ? casesWithCoords
    : casesWithCoords.filter(c => c.corps === selectedCorps);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-700/50" style={{ height }}>
      {/* Map legend */}
      <div className="absolute top-3 right-3 z-[1000] bg-[#0b1020]/90 backdrop-blur border border-slate-700/50 rounded-xl p-3 text-xs space-y-2">
        <div className="font-bold text-slate-300 text-[11px] uppercase tracking-wider mb-2">Priorité</div>
        {Object.entries(PRIORITY_COLORS).map(([p, color]) => (
          <div key={p} className="flex items-center gap-2">
            <div className="rounded-full flex-shrink-0" style={{ width: PRIORITY_RADIUS[p], height: PRIORITY_RADIUS[p], background: color }}/>
            <span className="text-slate-400">{p}</span>
          </div>
        ))}
        <div className="border-t border-slate-700 pt-2 mt-2 text-slate-500 text-[10px]">
          {filtered.length} affaire(s) affichée(s)
        </div>
      </div>

      <MapContainer
        center={GUINEA_CENTER}
        zoom={GUINEA_ZOOM}
        style={{ height: '100%', width: '100%', background: '#060b14' }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Dark tile layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        <ZoomControl position="bottomright"/>

        {/* Prefecture markers (subtle dots) */}
        {GUINEA_PREFECTURES.map(pref => (
          <CircleMarker
            key={pref.name}
            center={[pref.lat, pref.lng]}
            radius={3}
            pathOptions={{ color: '#334155', fillColor: '#1e293b', fillOpacity: 0.7, weight: 1 }}
          >
            <Popup className="dark-popup">
              <div className="bg-[#0b1020] text-white p-2 rounded text-xs">
                <div className="font-bold">{pref.name}</div>
                <div className="text-slate-400">{pref.region}</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Case markers */}
        {filtered.map(cas => {
          const meta = CORPS_META[cas.corps];
          const color = PRIORITY_COLORS[cas.priority];
          const icon = makeCorpsIcon(color, cas.priority);
          return (
            <Marker
              key={cas.id}
              position={[cas.lat!, cas.lng!]}
              icon={icon}
              eventHandlers={{ click: () => onCaseClick?.(cas.id) }}
            >
              <Popup>
                <div style={{ background: '#0b1020', color: 'white', padding: '8px 10px', borderRadius: 10, minWidth: 200, border: '1px solid #334155', fontFamily: 'sans-serif' }}>
                  <div style={{ color: meta.secondaryColor, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>
                    {meta.label}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{cas.title}</div>
                  <div style={{ color: '#94a3b8', fontSize: 11 }}>{cas.caseNumber}</div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ background: color + '22', color, border: '1px solid ' + color + '44', borderRadius: 4, padding: '2px 6px', fontSize: 10, fontWeight: 700 }}>
                      {cas.priority}
                    </span>
                    <span style={{ color: '#64748b', fontSize: 10 }}>{cas.suspects} suspects</span>
                  </div>
                  {onCaseClick && (
                    <button
                      onClick={() => onCaseClick(cas.id)}
                      style={{ marginTop: 8, width: '100%', padding: '4px 0', borderRadius: 6, background: 'linear-gradient(135deg,#CE1126,#009460)', color: 'white', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    >
                      Ouvrir l'affaire →
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Guinea flag attribution stripe */}
      <div className="absolute bottom-0 left-0 right-0 flex h-1 z-[1000]">
        <div className="flex-1 bg-[#CE1126]"/>
        <div className="flex-1 bg-[#FCD116]"/>
        <div className="flex-1 bg-[#009460]"/>
      </div>
    </div>
  );
};

export default GuineaMap;
