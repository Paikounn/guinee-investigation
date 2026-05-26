// CasesPage.tsx — Modern corps dashboard with Leaflet map + RBAC
import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, BarChart2, Shield, AlertTriangle, Clock, CheckCircle, XCircle, LogOut, Bell, Users, TrendingUp, Map, List, Lock, ChevronRight, Star } from 'lucide-react';
import { CORPS_LOGOS, CORPS_META, CorpsId } from '../components/CorpsLogos';
import { DEPARTMENTS, CASE_TYPES } from '../data/corps-data';
import { useAuthStore } from '../stores/authStore';
import { ROLE_META, getRoleBadgeStyle } from '../utils/permissions';
import type { MapCase } from '../components/GuineaMap';

// Lazy-load map to avoid SSR issues
const GuineaMap = lazy(() => import('../components/GuineaMap'));

// ─── Types ───────────────────────────────────────────────────────────────────
interface Case {
  id: string; title: string; caseNumber: string;
  status: 'OUVERT' | 'EN_COURS' | 'FERME' | 'CLASSE' | 'TRANSMIS';
  priority: 'URGENCE' | 'HAUTE' | 'NORMALE' | 'BASSE';
  corps: CorpsId; department: string; caseType: string; region: string;
  createdAt: string; updatedAt: string; suspects: number; entities: number;
  lat?: number; lng?: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
  OUVERT:   { label: 'Ouvert',   color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  icon: <Clock size={12}/> },
  EN_COURS: { label: 'En cours', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: <AlertTriangle size={12}/> },
  FERME:    { label: 'Fermé',    color: '#6b7280', bg: 'rgba(107,114,128,0.12)', icon: <XCircle size={12}/> },
  CLASSE:   { label: 'Classé',   color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: <CheckCircle size={12}/> },
  TRANSMIS: { label: 'Transmis', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',  icon: <Shield size={12}/> },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  URGENCE: { label: 'URGENCE', color: '#ef4444', dot: '🔴' },
  HAUTE:   { label: 'Haute',   color: '#f97316', dot: '🟠' },
  NORMALE: { label: 'Normale', color: '#eab308', dot: '🟡' },
  BASSE:   { label: 'Basse',   color: '#22c55e', dot: '🟢' },
};

const SAMPLE_CASES: Case[] = [
  { id:'1', title:'Trafic de faux billets à Conakry', caseNumber:'PO-2025-0142', status:'EN_COURS', priority:'URGENCE', corps:'POLICE', department:'DCPJ', caseType:'FRAUDE_FINANCIERE', region:'Conakry', createdAt:'2025-03-12', updatedAt:'2025-05-20', suspects:4, entities:12, lat:9.6412, lng:-13.5784 },
  { id:'2', title:'Braconnage éléphants — Forêt de Ziama', caseNumber:'EF-2025-0031', status:'OUVERT', priority:'HAUTE', corps:'EAUX_FORETS', department:'BFN', caseType:'BRACONNAGE', region:'Macenta', createdAt:'2025-04-01', updatedAt:'2025-05-18', suspects:2, entities:7, lat:8.54, lng:-9.47 },
  { id:'3', title:'Fraude douanière — Gaoual', caseNumber:'DOU-2025-0087', status:'TRANSMIS', priority:'NORMALE', corps:'DOUANE', department:'BMD', caseType:'CONTREBANDE', region:'Gaoual', createdAt:'2025-02-28', updatedAt:'2025-05-10', suspects:3, entities:9, lat:11.76, lng:-13.2 },
  { id:'4', title:'Menace contre installation stratégique', caseNumber:'DGSE-2025-0012', status:'EN_COURS', priority:'URGENCE', corps:'SECURITE_ETAT', department:'SPHP', caseType:'MENACE', region:'Conakry', createdAt:'2025-05-01', updatedAt:'2025-05-25', suspects:1, entities:15, lat:9.62, lng:-13.62 },
  { id:'5', title:'Escorte mission diplomatique', caseNumber:'GR-2025-0055', status:'FERME', priority:'HAUTE', corps:'GARDE_REPUBLICAINE', department:'EP', caseType:'ESCORTE', region:'Conakry', createdAt:'2025-04-15', updatedAt:'2025-04-20', suspects:0, entities:4, lat:9.55, lng:-13.68 },
  { id:'6', title:"Bande armée — N'Zérékoré", caseNumber:'GN-2025-0199', status:'OUVERT', priority:'HAUTE', corps:'GENDARMERIE', department:'SR', caseType:'BANDITISME', region:"N'Zérékoré", createdAt:'2025-05-10', updatedAt:'2025-05-24', suspects:6, entities:20, lat:7.76, lng:-8.82 },
  { id:'7', title:'Réseau de traite de personnes — Kankan', caseNumber:'PO-2025-0188', status:'EN_COURS', priority:'URGENCE', corps:'POLICE', department:'DCPAF', caseType:'TRAITE_PERSONNES', region:'Kankan', createdAt:'2025-04-20', updatedAt:'2025-05-22', suspects:8, entities:25, lat:10.38, lng:-9.3 },
  { id:'8', title:'Exploitation minière illégale — Siguiri', caseNumber:'GN-2025-0211', status:'OUVERT', priority:'HAUTE', corps:'GENDARMERIE', department:'SR', caseType:'MINES_ILLEGAL', region:'Siguiri', createdAt:'2025-05-15', updatedAt:'2025-05-25', suspects:12, entities:18, lat:11.42, lng:-9.17 },
];

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: number | string; icon: React.ReactNode; color: string; sub?: string; trend?: string }> = ({ label, value, icon, color, sub, trend }) => (
  <div className="rounded-2xl p-5 border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ background: `radial-gradient(circle at 20% 50%, ${color}08, transparent 70%)` }}/>
    <div className="flex items-start justify-between relative">
      <div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-slate-500 font-medium">{label}</div>
        {sub && <div className="text-xs mt-1" style={{ color }}>{sub}</div>}
      </div>
      <div className="rounded-xl p-3" style={{ background: color + '15' }}>
        <span style={{ color }}>{icon}</span>
      </div>
    </div>
    {trend && <div className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-800">{trend}</div>}
  </div>
);

// ─── Case Card (for grid view) ───────────────────────────────────────────────
const CaseCard: React.FC<{ cas: Case; onClick: () => void; canEdit: boolean }> = ({ cas, onClick, canEdit }) => {
  const Logo = CORPS_LOGOS[cas.corps];
  const meta = CORPS_META[cas.corps];
  const status = STATUS_CONFIG[cas.status];
  const priority = PRIORITY_CONFIG[cas.priority];
  return (
    <div onClick={onClick}
      className="group rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur p-5 cursor-pointer hover:border-slate-700 transition-all duration-300 hover:shadow-lg relative overflow-hidden"
      style={{ '--hover-shadow': meta.primaryColor } as any}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at 80% 20%, ${meta.primaryColor}10, transparent 60%)` }}/>

      <div className="flex items-start justify-between mb-4 relative">
        <Logo size={36}/>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1"
            style={{ background: status.bg, color: status.color }}>
            {status.icon}{status.label}
          </span>
          {!canEdit && <Lock size={12} className="text-slate-600"/>}
        </div>
      </div>

      <div className="relative">
        <div className="font-semibold text-white text-sm leading-tight mb-1 line-clamp-2">{cas.title}</div>
        <div className="text-xs text-slate-500 font-mono mb-3">{cas.caseNumber}</div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold" style={{ color: priority.color }}>
            {priority.dot} {priority.label}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Users size={11}/>{cas.suspects}
            <span className="text-slate-700">·</span>
            <span>{cas.region}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
          <span className="text-xs" style={{ color: meta.secondaryColor }}>{meta.shortLabel}</span>
          <ChevronRight size={14} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all"/>
        </div>
      </div>
    </div>
  );
};

// ─── Case Table Row ───────────────────────────────────────────────────────────
const CaseRow: React.FC<{ cas: Case; onClick: () => void; canEdit: boolean }> = ({ cas, onClick, canEdit }) => {
  const Logo = CORPS_LOGOS[cas.corps];
  const meta = CORPS_META[cas.corps];
  const status = STATUS_CONFIG[cas.status];
  const priority = PRIORITY_CONFIG[cas.priority];
  return (
    <tr className="border-b border-slate-800/40 hover:bg-slate-800/20 cursor-pointer transition-colors group" onClick={onClick}>
      <td className="px-4 py-3"><Logo size={30}/></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white text-sm group-hover:text-blue-300 transition-colors">{cas.title}</span>
          {!canEdit && <Lock size={11} className="text-slate-600 flex-shrink-0"/>}
        </div>
        <div className="text-xs text-slate-500 font-mono mt-0.5">{cas.caseNumber}</div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 w-fit"
          style={{ background: status.bg, color: status.color }}>
          {status.icon}{status.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-bold" style={{ color: priority.color }}>{priority.dot} {priority.label}</span>
      </td>
      <td className="px-4 py-3"><span className="text-xs" style={{ color: meta.secondaryColor }}>{meta.shortLabel}</span></td>
      <td className="px-4 py-3"><span className="text-xs text-slate-400">{cas.region}</span></td>
      <td className="px-4 py-3">
        <div className="text-xs text-slate-400">{cas.suspects} suspects · {cas.entities} entités</div>
      </td>
      <td className="px-4 py-3"><span className="text-xs text-slate-500">{cas.updatedAt}</span></td>
    </tr>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const CasesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, clearAuth, canEditData, can } = useAuthStore();
  const canEdit = canEditData();
  const canCreate = can('case:create');

  const [cases, setCases] = useState<Case[]>(SAMPLE_CASES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCorps, setSelectedCorps] = useState<CorpsId | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');
  const [showNewCase, setShowNewCase] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCorps, setNewCorps] = useState<CorpsId>('POLICE');
  const [newPriority, setNewPriority] = useState<'URGENCE'|'HAUTE'|'NORMALE'|'BASSE'>('NORMALE');
  const [newRegion, setNewRegion] = useState('Conakry');

  const filtered = cases.filter(c => {
    const matchSearch = !searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCorps = selectedCorps === 'ALL' || c.corps === selectedCorps;
    const matchStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    return matchSearch && matchCorps && matchStatus;
  });

  const mapCases: MapCase[] = filtered.map(c => ({
    id: c.id, title: c.title, caseNumber: c.caseNumber, corps: c.corps,
    priority: c.priority, status: c.status, region: c.region,
    suspects: c.suspects, lat: c.lat, lng: c.lng,
  }));

  const totalOpen = cases.filter(c => c.status === 'OUVERT' || c.status === 'EN_COURS').length;
  const totalUrgence = cases.filter(c => c.priority === 'URGENCE').length;
  const totalSuspects = cases.reduce((s, c) => s + c.suspects, 0);

  const createCase = () => {
    if (!newTitle.trim()) return;
    const id = Date.now().toString();
    const num = `${newCorps.slice(0,2)}-2025-${String(cases.length+1).padStart(4,'0')}`;
    setCases(prev => [...prev, {
      id, title: newTitle, caseNumber: num, status: 'OUVERT', priority: newPriority,
      corps: newCorps, department: '', caseType: '', region: newRegion,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      suspects: 0, entities: 0,
    }]);
    setShowNewCase(false);
    setNewTitle('');
    setNewRegion('Conakry');
  };

  const roleMeta = user?.role ? ROLE_META[user.role] : null;

  return (
    <div className="min-h-screen text-white" style={{
      background: 'linear-gradient(135deg, #060b14 0%, #080c18 50%, #060b14 100%)',
    }}>
      {/* Top navigation bar */}
      <div className="border-b border-slate-800/60 px-6 py-3 flex items-center justify-between backdrop-blur-sm"
        style={{ background: 'rgba(8,12,20,0.85)' }}>
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs"
              style={{ background: 'linear-gradient(135deg,#CE1126,#009460)' }}>GN</div>
            <span className="text-sm font-bold text-white hidden md:block">Enquête Guinée</span>
          </div>
          <div className="w-px h-6 bg-slate-700"/>
          {/* User info */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: roleMeta ? roleMeta.badgeBg : 'rgba(100,116,139,0.3)', color: roleMeta?.color || '#94a3b8', border: `1px solid ${roleMeta?.color || '#475569'}44` }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-white leading-none">{user?.name || 'Agent'}</div>
              <div className="text-[10px] mt-0.5" style={{ color: roleMeta?.color || '#94a3b8' }}>
                {roleMeta?.labelFr || user?.role}
              </div>
            </div>
            {roleMeta && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full hidden md:inline"
                style={getRoleBadgeStyle(user!.role)}>
                {roleMeta.label}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!canEdit && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-xs text-amber-400">
              <Lock size={11}/> Mode lecture seule
            </div>
          )}
          <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors relative">
            <Bell size={16}/>
            {totalUrgence > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"/>
            )}
          </button>
          <button onClick={() => { clearAuth(); navigate('/login'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20">
            <LogOut size={13}/>Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-6">

        {/* Page header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">Tableau de Bord</h1>
            <p className="text-slate-500 text-sm mt-0.5">République de Guinée — Système National d'Investigation</p>
          </div>
          {canCreate && (
            <button onClick={() => setShowNewCase(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 shadow-lg"
              style={{ background: 'linear-gradient(135deg,#CE1126,#009460)', boxShadow: '0 4px 20px rgba(206,17,38,0.3)' }}>
              <Plus size={16}/><span className="hidden sm:inline">Nouvelle enquête</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Affaires totales" value={cases.length} icon={<BarChart2 size={20}/>} color="#3b82f6" trend={`${filtered.length} dans la vue actuelle`}/>
          <StatCard label="En cours / Ouvertes" value={totalOpen} icon={<Clock size={20}/>} color="#f59e0b" sub={`${Math.round(totalOpen/cases.length*100)}% actif`}/>
          <StatCard label="Urgences actives" value={totalUrgence} icon={<AlertTriangle size={20}/>} color="#ef4444" sub={totalUrgence > 0 ? "Intervention requise" : "Aucune urgence"}/>
          <StatCard label="Suspects identifiés" value={totalSuspects} icon={<Users size={20}/>} color="#10b981" trend="Tous corps confondus"/>
        </div>

        {/* Corps selector */}
        <div className="mb-5">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button onClick={() => setSelectedCorps('ALL')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold flex-shrink-0 transition-all"
              style={{
                background: selectedCorps === 'ALL' ? 'rgba(100,116,139,0.2)' : 'rgba(255,255,255,0.02)',
                borderColor: selectedCorps === 'ALL' ? '#64748b' : 'rgba(255,255,255,0.08)',
                color: selectedCorps === 'ALL' ? '#e2e8f0' : '#64748b',
              }}>
              <Shield size={14}/> Tous les corps
              <span className="bg-slate-700 text-slate-300 rounded-full px-1.5 text-[10px]">{cases.length}</span>
            </button>
            {(Object.keys(CORPS_LOGOS) as CorpsId[]).map(corpsId => {
              const Logo = CORPS_LOGOS[corpsId];
              const meta = CORPS_META[corpsId];
              const count = cases.filter(c => c.corps === corpsId).length;
              const sel = selectedCorps === corpsId;
              return (
                <button key={corpsId} onClick={() => setSelectedCorps(corpsId)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold flex-shrink-0 transition-all"
                  style={{
                    background: sel ? meta.badgeBg : 'rgba(255,255,255,0.02)',
                    borderColor: sel ? meta.primaryColor : 'rgba(255,255,255,0.08)',
                    color: sel ? meta.secondaryColor : '#64748b',
                    boxShadow: sel ? `0 0 12px ${meta.primaryColor}33` : 'none',
                  }}>
                  <Logo size={18}/>
                  {meta.shortLabel}
                  <span className="rounded-full px-1.5 text-[10px]"
                    style={{ background: sel ? meta.primaryColor + '33' : '#1e293b', color: sel ? meta.secondaryColor : '#64748b' }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter + view toggle bar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-[180px] px-3 py-2 rounded-xl border border-slate-800/60 bg-slate-900/40">
            <Search size={14} className="text-slate-500 flex-shrink-0"/>
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Rechercher une affaire..."
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none"/>
          </div>
          <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none">
            <option value="ALL">Tous statuts</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <div className="flex rounded-xl border border-slate-800/60 overflow-hidden">
            {([['list', <List size={14}/>, 'Liste'], ['grid', <Star size={14}/>, 'Grille'], ['map', <Map size={14}/>, 'Carte']] as const).map(([mode, icon, label]) => (
              <button key={mode} onClick={() => setViewMode(mode as any)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors"
                style={{
                  background: viewMode === mode ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.02)',
                  color: viewMode === mode ? '#60a5fa' : '#64748b',
                }}>
                {icon}<span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-600">{filtered.length} affaire(s)</span>
        </div>

        {/* Content area */}
        {viewMode === 'map' ? (
          <div>
            <Suspense fallback={
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 flex items-center justify-center" style={{ height: 560 }}>
                <div className="text-slate-500 text-sm">Chargement de la carte…</div>
              </div>
            }>
              <GuineaMap
                cases={mapCases}
                onCaseClick={id => navigate('/cases/' + id)}
                selectedCorps={selectedCorps}
                height="560px"
              />
            </Suspense>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-600">Aucune affaire trouvée</div>
            ) : filtered.map(cas => (
              <CaseCard key={cas.id} cas={cas} onClick={() => navigate('/cases/' + cas.id)} canEdit={canEdit}/>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800/60 overflow-hidden bg-slate-900/20 backdrop-blur">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/60 bg-slate-900/60">
                    {['Corps','Affaire','Statut','Priorité','Unité','Région','Entités','Màj'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] text-slate-500 font-bold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="py-20 text-center text-slate-600 text-sm">Aucune affaire trouvée</td></tr>
                  ) : filtered.map(cas => (
                    <CaseRow key={cas.id} cas={cas} onClick={() => navigate('/cases/' + cas.id)} canEdit={canEdit}/>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bottom stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Corps breakdown */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={15} className="text-blue-400"/>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Répartition corps</span>
            </div>
            {(Object.keys(CORPS_LOGOS) as CorpsId[]).map(corpsId => {
              const Logo = CORPS_LOGOS[corpsId];
              const meta = CORPS_META[corpsId];
              const count = cases.filter(c => c.corps === corpsId).length;
              const pct = cases.length ? Math.round(count / cases.length * 100) : 0;
              return (
                <div key={corpsId} className="flex items-center gap-3 mb-3">
                  <Logo size={18}/>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: meta.secondaryColor }}>{meta.shortLabel}</span>
                      <span className="text-slate-600">{count}</span>
                    </div>
                    <div className="h-1 rounded-full bg-slate-800">
                      <div className="h-1 rounded-full transition-all duration-500" style={{ width: pct + '%', background: `linear-gradient(90deg, ${meta.primaryColor}, ${meta.accentColor})` }}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status breakdown */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={15} className="text-amber-400"/>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Statuts</span>
            </div>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const count = cases.filter(c => c.status === key).length;
              const pct = cases.length ? Math.round(count / cases.length * 100) : 0;
              return (
                <div key={key} className="flex items-center gap-3 mb-3">
                  <span style={{ color: cfg.color }}>{cfg.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{cfg.label}</span>
                      <span className="text-slate-600">{count}</span>
                    </div>
                    <div className="h-1 rounded-full bg-slate-800">
                      <div className="h-1 rounded-full transition-all" style={{ width: pct + '%', background: cfg.color }}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Urgent cases */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={15} className="text-red-400"/>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Urgences</span>
            </div>
            {cases.filter(c => c.priority === 'URGENCE' || c.priority === 'HAUTE').slice(0, 5).map(cas => {
              const Logo = CORPS_LOGOS[cas.corps];
              return (
                <div key={cas.id} onClick={() => navigate('/cases/' + cas.id)}
                  className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-slate-800/40 rounded-xl p-2 -mx-2 transition-colors group">
                  <Logo size={22}/>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white truncate group-hover:text-blue-300 transition-colors">{cas.title}</div>
                    <div className="text-[10px]" style={{ color: PRIORITY_CONFIG[cas.priority].color }}>
                      {PRIORITY_CONFIG[cas.priority].dot} {PRIORITY_CONFIG[cas.priority].label}
                    </div>
                  </div>
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-white transition-colors flex-shrink-0"/>
                </div>
              );
            })}
            {cases.filter(c => c.priority === 'URGENCE').length === 0 && (
              <div className="text-xs text-slate-600 text-center py-4">Aucune urgence active</div>
            )}
          </div>
        </div>
      </div>

      {/* New Case Modal */}
      {showNewCase && canCreate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1020] border border-slate-700/50 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6">Nouvelle affaire</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Titre</label>
                <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  placeholder="Description de l'affaire..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Région</label>
                <input value={newRegion} onChange={e => setNewRegion(e.target.value)}
                  placeholder="Conakry, Kankan..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Corps compétent</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(CORPS_LOGOS) as CorpsId[]).map(c => {
                    const Logo = CORPS_LOGOS[c]; const meta = CORPS_META[c];
                    return (
                      <button key={c} onClick={() => setNewCorps(c)}
                        className="flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all"
                        style={{ background: newCorps === c ? meta.badgeBg : 'transparent', borderColor: newCorps === c ? meta.primaryColor : '#334155' }}>
                        <Logo size={28}/>
                        <span className="text-[10px] font-medium" style={{ color: meta.secondaryColor }}>{meta.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Priorité</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['URGENCE','HAUTE','NORMALE','BASSE'] as const).map(p => (
                    <button key={p} onClick={() => setNewPriority(p)}
                      className="text-xs py-2 rounded-xl border font-bold transition-all"
                      style={{ background: newPriority === p ? PRIORITY_CONFIG[p].color + '22' : 'transparent', borderColor: newPriority === p ? PRIORITY_CONFIG[p].color : '#334155', color: PRIORITY_CONFIG[p].color }}>
                      {PRIORITY_CONFIG[p].dot} {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowNewCase(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:bg-slate-800 transition-colors">
                Annuler
              </button>
              <button onClick={createCase} disabled={!newTitle.trim()}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#CE1126,#009460)' }}>
                Créer l'affaire
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesPage;
