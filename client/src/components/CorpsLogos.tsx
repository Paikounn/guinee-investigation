// CorpsLogos.tsx — Official-style SVG emblems for Guinea's 6 national security corps
import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const PoliceNationaleLogoSVG: React.FC<LogoProps> = ({ size = 80, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="pn-grad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#1a2a5e"/>
        <stop offset="100%" stopColor="#0a1030"/>
      </radialGradient>
    </defs>
    <path d="M50 5 L90 20 L90 55 C90 75 70 90 50 97 C30 90 10 75 10 55 L10 20 Z"
      fill="url(#pn-grad)" stroke="#FCD116" strokeWidth="2.5"/>
    <path d="M50 5 L90 20 L90 28 L10 28 L10 20 Z" fill="#CE1126" opacity="0.85"/>
    <polygon points="50,22 53,32 63,32 55,38 58,48 50,42 42,48 45,38 37,32 47,32"
      fill="#FCD116" stroke="#FCD116" strokeWidth="0.5"/>
    <line x1="50" y1="52" x2="50" y2="72" stroke="#FCD116" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="38" y1="57" x2="62" y2="57" stroke="#FCD116" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="38" cy="62" r="4" fill="none" stroke="#FCD116" strokeWidth="2"/>
    <circle cx="62" cy="62" r="4" fill="none" stroke="#FCD116" strokeWidth="2"/>
    <circle cx="50" cy="52" r="2.5" fill="#FCD116"/>
    <path d="M25 82 Q50 90 75 82 L73 88 Q50 96 27 88 Z" fill="#CE1126"/>
    <text x="50" y="87" textAnchor="middle" fill="#FCD116" fontSize="4.5" fontWeight="bold" fontFamily="serif">POLICE NATIONALE</text>
  </svg>
);

export const GendarmerieNationaleLogoSVG: React.FC<LogoProps> = ({ size = 80, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="gn-grad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#1a3a1a"/>
        <stop offset="100%" stopColor="#0a1a0a"/>
      </radialGradient>
    </defs>
    <polygon points="50,4 68,10 82,24 88,42 82,60 68,74 50,80 32,74 18,60 12,42 18,24 32,10"
      fill="url(#gn-grad)" stroke="#009460" strokeWidth="2.5"/>
    <polygon points="50,12 65,17 76,28 80,42 76,56 65,67 50,72 35,67 24,56 20,42 24,28 35,17"
      fill="none" stroke="#FCD116" strokeWidth="1.2"/>
    <line x1="30" y1="30" x2="70" y2="70" stroke="#FCD116" strokeWidth="3" strokeLinecap="round"/>
    <line x1="70" y1="30" x2="30" y2="70" stroke="#FCD116" strokeWidth="3" strokeLinecap="round"/>
    <line x1="26" y1="33" x2="34" y2="27" stroke="#CE1126" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="74" y1="27" x2="66" y2="33" stroke="#CE1126" strokeWidth="2.5" strokeLinecap="round"/>
    <polygon points="50,38 52.5,45 60,45 54,49.5 56.5,56.5 50,52 43.5,56.5 46,49.5 40,45 47.5,45"
      fill="#FCD116"/>
    <rect x="35" y="6" width="10" height="5" fill="#CE1126" rx="1"/>
    <rect x="45" y="6" width="10" height="5" fill="#FCD116" rx="1"/>
    <rect x="55" y="6" width="10" height="5" fill="#009460" rx="1"/>
    <text x="50" y="88" textAnchor="middle" fill="#FCD116" fontSize="4" fontWeight="bold" fontFamily="serif">GENDARMERIE NAT.</text>
  </svg>
);

export const DouanesNationalesLogoSVG: React.FC<LogoProps> = ({ size = 80, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="dn-grad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#2a1a0a"/>
        <stop offset="100%" stopColor="#1a0a00"/>
      </radialGradient>
    </defs>
    <path d="M50 5 L88 40 L88 65 C88 80 70 92 50 97 C30 92 12 80 12 65 L12 40 Z"
      fill="url(#dn-grad)" stroke="#FCD116" strokeWidth="2.5"/>
    <line x1="50" y1="25" x2="50" y2="72" stroke="#FCD116" strokeWidth="2.5"/>
    <line x1="32" y1="42" x2="68" y2="42" stroke="#FCD116" strokeWidth="2.5"/>
    <path d="M28 42 Q32 52 36 42" fill="none" stroke="#FCD116" strokeWidth="1.8"/>
    <line x1="28" y1="52" x2="36" y2="52" stroke="#FCD116" strokeWidth="1.8"/>
    <path d="M64 42 Q68 52 72 42" fill="none" stroke="#FCD116" strokeWidth="1.8"/>
    <line x1="64" y1="52" x2="72" y2="52" stroke="#FCD116" strokeWidth="1.8"/>
    <polygon points="50,36 52,40 56,40 53,43 54,47 50,44 46,47 47,43 44,40 48,40" fill="#FCD116"/>
    <ellipse cx="50" cy="65" rx="14" ry="14" fill="none" stroke="#009460" strokeWidth="1.5"/>
    <line x1="36" y1="65" x2="64" y2="65" stroke="#009460" strokeWidth="1"/>
    <path d="M42 51 Q50 65 58 79" fill="none" stroke="#009460" strokeWidth="1"/>
    <path d="M44 51 Q36 65 44 79" fill="none" stroke="#009460" strokeWidth="1"/>
    <path d="M22 84 Q50 93 78 84 L76 90 Q50 98 24 90 Z" fill="#CE1126"/>
    <text x="50" y="88.5" textAnchor="middle" fill="#FCD116" fontSize="4" fontWeight="bold" fontFamily="serif">DOUANES NATIONALES</text>
  </svg>
);

export const SecuriteEtatLogoSVG: React.FC<LogoProps> = ({ size = 80, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="se-grad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#1a1a2e"/>
        <stop offset="100%" stopColor="#060b14"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#se-grad)" stroke="#CE1126" strokeWidth="3"/>
    <circle cx="50" cy="50" r="38" fill="none" stroke="#CE1126" strokeWidth="1"/>
    <ellipse cx="50" cy="52" rx="10" ry="12" fill="#CE1126"/>
    <path d="M40 48 C30 42 15 45 12 38 C18 38 25 42 33 46 L40 48Z" fill="#CE1126"/>
    <path d="M60 48 C70 42 85 45 88 38 C82 38 75 42 67 46 L60 48Z" fill="#CE1126"/>
    <path d="M44 64 L50 75 L56 64 Z" fill="#CE1126"/>
    <circle cx="50" cy="38" r="7" fill="#CE1126"/>
    <path d="M55 37 L61 40 L57 42 Z" fill="#FCD116"/>
    <circle cx="53" cy="36" r="1.5" fill="#FCD116"/>
    <polygon points="50,16 52,22 58,22 53,26 55,32 50,28 45,32 47,26 42,22 48,22" fill="#FCD116"/>
    <path d="M46 48 L54 48 L54 58 L50 62 L46 58 Z" fill="#FCD116" opacity="0.9"/>
    <path d="M20 70 Q30 62 38 72" fill="none" stroke="#009460" strokeWidth="2"/>
    <circle cx="24" cy="67" r="2" fill="#009460"/>
    <circle cx="28" cy="64" r="2" fill="#009460"/>
    <circle cx="32" cy="65" r="2" fill="#009460"/>
    <path d="M80 70 Q70 62 62 72" fill="none" stroke="#009460" strokeWidth="2"/>
    <circle cx="76" cy="67" r="2" fill="#009460"/>
    <circle cx="72" cy="64" r="2" fill="#009460"/>
    <circle cx="68" cy="65" r="2" fill="#009460"/>
    <text x="50" y="92" textAnchor="middle" fill="#FCD116" fontSize="4.5" fontWeight="bold" fontFamily="serif">SECURITE D'ETAT</text>
  </svg>
);

export const GardeRepublicaineLogoSVG: React.FC<LogoProps> = ({ size = 80, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="gr-grad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#2a1a00"/>
        <stop offset="100%" stopColor="#1a0f00"/>
      </radialGradient>
    </defs>
    <path d="M20 10 L80 10 L80 60 Q80 85 50 96 Q20 85 20 60 Z"
      fill="url(#gr-grad)" stroke="#FCD116" strokeWidth="2.5"/>
    <line x1="50" y1="10" x2="50" y2="96" stroke="#FCD116" strokeWidth="1.2" opacity="0.6"/>
    <line x1="20" y1="40" x2="80" y2="40" stroke="#FCD116" strokeWidth="1.2" opacity="0.6"/>
    <rect x="21" y="11" width="9" height="28" fill="#CE1126" opacity="0.8"/>
    <rect x="30" y="11" width="9" height="28" fill="#FCD116" opacity="0.8"/>
    <rect x="39" y="11" width="10" height="28" fill="#009460" opacity="0.8"/>
    <ellipse cx="65" cy="28" rx="10" ry="7" fill="#FCD116" opacity="0.85"/>
    <circle cx="58" cy="23" r="5" fill="#FCD116" opacity="0.85"/>
    <path d="M55 19 C53 14 57 14 58 18" fill="#FCD116"/>
    <line x1="75" y1="30" x2="80" y2="25" stroke="#FCD116" strokeWidth="2" strokeLinecap="round"/>
    <line x1="28" y1="50" x2="52" y2="85" stroke="#009460" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="72" y1="50" x2="48" y2="85" stroke="#009460" strokeWidth="2.5" strokeLinecap="round"/>
    <rect x="25" y="47" width="5" height="8" rx="1" fill="#CE1126"/>
    <rect x="70" y="47" width="5" height="8" rx="1" fill="#CE1126"/>
    <polygon points="50,64 52,68 56,68 53,71 54,75 50,72 46,75 47,71 44,68 48,68" fill="#FCD116"/>
    <path d="M38 8 L44 2 L50 8 L56 2 L62 8 L60 12 L40 12 Z" fill="#FCD116"/>
    <circle cx="44" cy="4" r="1.5" fill="#CE1126"/>
    <circle cx="50" cy="6" r="1.5" fill="#CE1126"/>
    <circle cx="56" cy="4" r="1.5" fill="#CE1126"/>
    <path d="M18 88 Q50 97 82 88 L80 94 Q50 100 20 94 Z" fill="#CE1126"/>
    <text x="50" y="93" textAnchor="middle" fill="#FCD116" fontSize="3.8" fontWeight="bold" fontFamily="serif">GARDE REPUBLICAINE</text>
  </svg>
);

export const EauxForetsLogoSVG: React.FC<LogoProps> = ({ size = 80, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ef-grad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#0a2a0a"/>
        <stop offset="100%" stopColor="#041004"/>
      </radialGradient>
    </defs>
    <path d="M50 5 L85 18 L85 55 C85 78 68 92 50 97 C32 92 15 78 15 55 L15 18 Z"
      fill="url(#ef-grad)" stroke="#009460" strokeWidth="2.5"/>
    <path d="M50 12 L78 23 L78 54 C78 72 64 84 50 89 C36 84 22 72 22 54 L22 23 Z"
      fill="none" stroke="#009460" strokeWidth="1" opacity="0.7"/>
    <rect x="47" y="58" width="6" height="22" rx="1" fill="#6b3a1f"/>
    <polygon points="50,20 35,45 65,45" fill="#009460"/>
    <polygon points="50,30 33,55 67,55" fill="#00b050"/>
    <polygon points="50,40 30,65 70,65" fill="#009460"/>
    <path d="M20 78 Q30 74 40 78 Q50 82 60 78 Q70 74 80 78" fill="none" stroke="#4fc3f7" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M23 84 Q33 80 43 84 Q53 88 63 84 Q73 80 77 84" fill="none" stroke="#29b6f6" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="72" cy="22" r="7" fill="#FCD116" opacity="0.9"/>
    <line x1="72" y1="12" x2="72" y2="9" stroke="#FCD116" strokeWidth="1.5"/>
    <line x1="80" y1="16" x2="82" y2="14" stroke="#FCD116" strokeWidth="1.5"/>
    <line x1="82" y1="22" x2="85" y2="22" stroke="#FCD116" strokeWidth="1.5"/>
    <path d="M24 28 C26 24 30 24 32 28 C30 30 26 30 24 28Z" fill="#FCD116"/>
    <polygon points="50,8 51.2,11.5 55,11.5 52,13.5 53.2,17 50,15 46.8,17 48,13.5 45,11.5 48.8,11.5" fill="#FCD116"/>
    <path d="M20 90 Q50 98 80 90 L78 95 Q50 100 22 95 Z" fill="#CE1126"/>
    <text x="50" y="94.5" textAnchor="middle" fill="#FCD116" fontSize="3.5" fontWeight="bold" fontFamily="serif">EAUX ET FORETS</text>
  </svg>
);

export type CorpsId = 'POLICE' | 'GENDARMERIE' | 'DOUANE' | 'SECURITE_ETAT' | 'GARDE_REPUBLICAINE' | 'EAUX_FORETS';

export const CORPS_LOGOS: Record<CorpsId, React.FC<LogoProps>> = {
  POLICE: PoliceNationaleLogoSVG,
  GENDARMERIE: GendarmerieNationaleLogoSVG,
  DOUANE: DouanesNationalesLogoSVG,
  SECURITE_ETAT: SecuriteEtatLogoSVG,
  GARDE_REPUBLICAINE: GardeRepublicaineLogoSVG,
  EAUX_FORETS: EauxForetsLogoSVG,
};

export const CORPS_META: Record<CorpsId, {
  label: string;
  shortLabel: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgDark: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
  description: string;
}> = {
  POLICE: {
    label: 'Police Nationale',
    shortLabel: 'Police',
    primaryColor: '#1a2a5e',
    secondaryColor: '#FCD116',
    accentColor: '#CE1126',
    bgDark: '#0d1530',
    borderColor: '#253a7a',
    textColor: '#a0aec0',
    badgeBg: 'rgba(26,42,94,0.5)',
    description: 'Direction Générale de la Police Nationale',
  },
  GENDARMERIE: {
    label: 'Gendarmerie Nationale',
    shortLabel: 'Gendarmerie',
    primaryColor: '#1a3a1a',
    secondaryColor: '#FCD116',
    accentColor: '#009460',
    bgDark: '#0d1f0d',
    borderColor: '#254a25',
    textColor: '#a0c0a0',
    badgeBg: 'rgba(26,58,26,0.5)',
    description: 'Direction Générale de la Gendarmerie Nationale',
  },
  DOUANE: {
    label: 'Douanes Nationales',
    shortLabel: 'Douanes',
    primaryColor: '#3a2000',
    secondaryColor: '#FCD116',
    accentColor: '#ff8c00',
    bgDark: '#1f1000',
    borderColor: '#5a3500',
    textColor: '#c0a060',
    badgeBg: 'rgba(58,32,0,0.5)',
    description: 'Direction Générale des Douanes et Droits Indirects',
  },
  SECURITE_ETAT: {
    label: "Sécurité d'État",
    shortLabel: 'DGSE',
    primaryColor: '#1a1a2e',
    secondaryColor: '#CE1126',
    accentColor: '#7b0d1e',
    bgDark: '#0a0a1a',
    borderColor: '#2a2a4e',
    textColor: '#b0a0c0',
    badgeBg: 'rgba(26,26,46,0.5)',
    description: "Direction Générale des Services de l'État",
  },
  GARDE_REPUBLICAINE: {
    label: 'Garde Républicaine',
    shortLabel: 'Garde Rép.',
    primaryColor: '#2a1500',
    secondaryColor: '#FCD116',
    accentColor: '#CE1126',
    bgDark: '#150a00',
    borderColor: '#4a2500',
    textColor: '#c0a070',
    badgeBg: 'rgba(42,21,0,0.5)',
    description: 'Garde Républicaine de Guinée',
  },
  EAUX_FORETS: {
    label: 'Eaux et Forêts',
    shortLabel: 'Eaux & Forêts',
    primaryColor: '#0a2a0a',
    secondaryColor: '#009460',
    accentColor: '#4fc3f7',
    bgDark: '#041004',
    borderColor: '#154a15',
    textColor: '#90c090',
    badgeBg: 'rgba(10,42,10,0.5)',
    description: 'Direction Nationale des Eaux et Forêts',
  },
};

export const CorpsBadge: React.FC<{ corpsId: CorpsId; size?: number; showLabel?: boolean }> = ({
  corpsId, size = 40, showLabel = false
}) => {
  const Logo = CORPS_LOGOS[corpsId];
  const meta = CORPS_META[corpsId];
  return (
    <div className="flex items-center gap-2">
      <Logo size={size} />
      {showLabel && (
        <span style={{ color: meta.secondaryColor, fontSize: 13, fontWeight: 600 }}>
          {meta.label}
        </span>
      )}
    </div>
  );
};

export const CorpsCard: React.FC<{
  corpsId: CorpsId;
  selected?: boolean;
  onClick?: () => void;
}> = ({ corpsId, selected = false, onClick }) => {
  const Logo = CORPS_LOGOS[corpsId];
  const meta = CORPS_META[corpsId];
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 w-full"
      style={{
        background: selected ? meta.badgeBg : 'rgba(255,255,255,0.03)',
        borderColor: selected ? meta.primaryColor : 'rgba(255,255,255,0.1)',
        boxShadow: selected ? '0 0 20px ' + meta.primaryColor + '66' : 'none',
      }}
    >
      <Logo size={56} />
      <div className="text-center">
        <div className="font-bold text-sm" style={{ color: meta.secondaryColor }}>
          {meta.shortLabel}
        </div>
        <div className="text-xs opacity-60 mt-0.5" style={{ color: meta.textColor }}>
          {meta.description}
        </div>
      </div>
    </button>
  );
};
