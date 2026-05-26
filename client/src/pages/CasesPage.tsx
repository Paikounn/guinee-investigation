// CasesPage.tsx — Corps-branded investigation dashboard with department filters
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, BarChart2, Shield, AlertTriangle, Clock, CheckCircle, XCircle, ChevronDown, LogOut, Bell, Users, TrendingUp } from 'lucide-react';
import NavBar from '../components/NavBar';
import { CORPS_LOGOS, CORPS_META, CorpsCard, CorpsId } from '../components/CorpsLogos';
import { DEPARTMENTS, CASE_TYPES } from '../data/corps-data';
import { useAuthStore } from '../stores/authStore';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Case {
  id: string;
  title: string;
  caseNumber: string;
  status: 'OUVERT' | 'EN_COURS' | 'FERME' | 'CLASSE' | 'TRANSMIS';
  priority: 'URGENCE' | 'HAUTE' | 'NORMALE' | 'BASSE';
  corps: CorpsId;
  department: string;
  caseType: string;
  region: string;
  createdAt: string;
  updatedAt: string;
  suspects: number;
  entities: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  OUVERT:    { label: 'Ouvert',    color: '#3b82f6', icon: <Clock size={12}/> },
  EN_COURS:  { label: 'En cours',  color: '#f59e0b', icon: <AlertTriangle size={12}/> },
  FERME:     { label: 'Fermé',     color: '#6b7280', icon: <XCircle size={12}/> },
  CLASSE:    { label: 'Classé',    color: '#10b981', icon: <CheckCircle size={12}/> },
  TRANSMIS:  { label: 'Transmis',  color: '#8b5cf6', icon: <Shield size={12}/> },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  URGENCE: { label: '🔴 URGENCE', color: '#ef4444' },
  HAUTE:   { label: '🟠 Haute',   color: '#f97316' },
  NORMALE: { label: '🟡 Normale', color: '#eab308' },
  BASSE:   { label: '🟢 Basse',   color: '#22c55e' },
};

// ─── Sample data ──────────────────────────────────────────────────────────────
const SAMPLE_CASES: Case[] = [
  { id:'1', title:'Trafic de faux billets à Conakry', caseNumber:'PO-2025-0142', status:'EN_COURS', priority:'URGENCE', corps:'POLICE', department:'DCPJ', caseType:'Faux monnayage', region:'Conakry', createdAt:'2025-03-12', updatedAt:'2025-05-20', suspects:4, entities:12 },
  { id:'2', title:'Braconnage éléphants — Forêt de Ziama', caseNumber:'EF-2025-0031', status:'OUVERT', priority:'HAUTE', corps:'EAUX_FORETS', department:'BFN', caseType:'Braconnage faune protégée', region:'Macenta', createdAt:'2025-04-01', updatedAt:'2025-05-18', suspects:2, entities:7 },
  { id:'3', title:'Fraude douanière — Gaoual', caseNumber:'DOU-2025-0087', status:'TRANSMIS', priority:'NORMALE', corps:'DOUANE', department:'BMD', caseType:'Contrebande', region:'Gaoual', createdAt:'2025-02-28', updatedAt:'2025-05-10', suspects:3, entities:9 },
  { id:'4', title:'Menace contre installation stratégique', caseNumber:'DGSE-2025-0012', status:'EN_COURS', priority:'URGENCE', corps:'SECURITE_ETAT', department:'SPHP', caseType:'Menace terroriste', region:'Conakry', createdAt:'2025-05-01', updatedAt:'2025-05-25', suspects:1, entities:15 },
  { id:'5', title:'Escorte mission diplomatique', caseNumber:'GR-2025-0055', status:'FERME', priority:'HAUTE', corps:'GARDE_REPUBLICAINE', department:'EP', caseType:'Escorte VIP', region:'Conakry', createdAt:'2025-04-15', updatedAt:'2025-04-20', suspects:0, entities:4 },
  { id:'6', title:'Bande armée — N\'Zérékoré', caseNumber:'GN-2025-0199', status:'OUVERT', priority:'HAUTE', corps:'GENDARMERIE', department:'SR', caseType:'Banditisme / Grand banditisme', region:'N\'Zérékoré', createdAt:'2025-05-10', updatedAt:'2025-05-24', suspects:6, entities:20 },
];

// ─── Stat Card ───────────────────────────────────────────────────────────────
const StatCard: React.FC<{ label: string; value: number | string; icon: React.ReactNode; color: string; sub?: string }> = ({ label, value, icon, color, sub }) => (
  <div className="rounded-xl p-4 border border-slate-800 bg-slate-900/50 flex items-center gap-4">
    <div className="rounded-lg p-3 flex-shrink-0" style={{ background: color + '22' }}>
      <span style={{ color }}>{icon}</span>
    </div>
    <div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
      {sub && <div className="text-xs mt-0.5" style={{ color }}>{sub}</div>}
    </div>
  </div>
);

// ─── Case Row ────────────────────────────────────────────────────────────────
const CaseRow: React.FC<{ cas: Case; onClick: () => void }> = ({ cas, onClick }) => {
  const Logo = CORPS_LOGOS[cas.corps];
  const meta = CORPS_META[cas.corps];
  const status = STATUS_CONFIG[cas.status];
  const priority = PRIORITY_CONFIG[cas.priority];
  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/40 cursor-pointer transition-colors" onClick={onClick}>
      <td className="px-4 py-3">
        <Logo size={32}/>
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-white text-sm">{cas.title}</div>
        <div className="text-xs text-slate-500 mt-0.5">{cas.caseNumber}</div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: status.color+'22', color: status.color }}>
          {status.label}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs font-medium" style={{ color: priority.color }}>{priority.label}</span>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-slate-300" style={{ color: meta.secondaryColor }}>{meta.shortLabel}</span>
        <div className="text-xs text-slate-500">{cas.department}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-xs text-slate-400">{cas.caseType}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-xs text-slate-400">{cas.region}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-xs text-slate-400">{cas.suspects} suspects</div>
        <div className="text-xs text-slate-500">{cas.entities} entités</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-xs text-slate-500">{cas.updatedAt}</div>
      </td>
    </tr>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const CasesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const logout = clearAuth;
  const [cases, setCases] = useState<Case[]>(SAMPLE_CASES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCorps, setSelectedCorps] = useState<CorpsId | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedCaseType, setSelectedCaseType] = useState('ALL');
  const [showNewCase, setShowNewCase] = useState(false);

  // New case form state
  const [newTitle, setNewTitle] = useState('');
  const [newCorps, setNewCorps] = useState<CorpsId>('POLICE');
  const [newPriority, setNewPriority] = useState<'URGENCE'|'HAUTE'|'NORMALE'|'BASSE'>('NORMALE');

  const activeMeta = selectedCorps !== 'ALL' ? CORPS_META[selectedCorps] : null;
  const depts = selectedCorps !== 'ALL' ? (DEPARTMENTS[selectedCorps as CorpsId] || []) : [];
  const caseTypes = selectedCorps !== 'ALL' ? (CASE_TYPES[selectedCorps as CorpsId] || []) : [];

  const filtered = cases.filter(c => {
    const matchSearch = !searchTerm || c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCorps = selectedCorps === 'ALL' || c.corps === selectedCorps;
    const matchStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchDept = selectedDept === 'ALL' || c.department === selectedDept;
    const matchType = selectedCaseType === 'ALL' || c.caseType === selectedCaseType;
    return matchSearch && matchCorps && matchStatus && matchDept && matchType;
  });

  const totalOpen = cases.filter(c=>c.status==='OUVERT'||c.status==='EN_COURS').length;
  const totalUrgence = cases.filter(c=>c.priority==='URGENCE').length;
  const totalSuspects = cases.reduce((s,c)=>s+c.suspects,0);

  const createCase = () => {
    if (!newTitle.trim()) return;
    const id = Date.now().toString();
    const num = `${newCorps.slice(0,2)}-2025-${String(cases.length+1).padStart(4,'0')}`;
    setCases(prev=>[...prev, {
      id, title: newTitle, caseNumber: num, status:'OUVERT', priority:newPriority,
      corps:newCorps, department:'', caseType:'', region:'Conakry',
      createdAt:new Date().toISOString().split('T')[0], updatedAt:new Date().toISOString().split('T')[0],
      suspects:0, entities:0
    }]);
    setShowNewCase(false);
    setNewTitle('');
  };

  return (
    <div className="min-h-screen bg-[#060b14] text-white">
      {/* Top bar */}
      <div className="border-b border-slate-800 px-6 py-3 flex items-center justify-between bg-[#080c14]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: 'linear-gradient(135deg,#CE1126,#009460)' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{user?.name || 'Agent'}</div>
            <div className="text-xs text-slate-500">{user?.corps || 'Système d\'enquête'}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"><Bell size={16}/></button>
          <button onClick={()=>{logout();navigate('/login');}} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={14}/>Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Tableau de Bord des Enquêtes</h1>
            <p className="text-slate-400 text-sm mt-1">Système National d'Investigation — République de Guinée</p>
          </div>
          <button onClick={()=>setShowNewCase(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#CE1126,#009460)', color:'#fff' }}>
            <Plus size={16}/> Nouvelle enquête
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Affaires totales" value={cases.length} icon={<BarChart2 size={20}/>} color="#3b82f6"/>
          <StatCard label="En cours / Ouvertes" value={totalOpen} icon={<Clock size={20}/>} color="#f59e0b" sub={`${Math.round(totalOpen/cases.length*100)}% du total`}/>
          <StatCard label="Urgences actives" value={totalUrgence} icon={<AlertTriangle size={20}/>} color="#ef4444"/>
          <StatCard label="Suspects identifiés" value={totalSuspects} icon={<Users size={20}/>} color="#10b981"/>
        </div>

        {/* Corps selector mosaic */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Filtrer par corps</div>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
            <button onClick={()=>setSelectedCorps('ALL')}
              className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-xs font-semibold"
              style={{
                background: selectedCorps==='ALL' ? 'rgba(100,116,139,0.2)' : 'rgba(255,255,255,0.02)',
                borderColor: selectedCorps==='ALL' ? '#64748b' : 'rgba(255,255,255,0.08)',
              }}>
              <Shield size={22} className="text-slate-400"/>
              <span className="text-slate-400">Tous</span>
              <span className="text-slate-600 text-[10px]">{cases.length}</span>
            </button>
            {(Object.keys(CORPS_LOGOS) as CorpsId[]).map(corpsId => {
              const Logo = CORPS_LOGOS[corpsId];
              const meta = CORPS_META[corpsId];
              const count = cases.filter(c=>c.corps===corpsId).length;
              const sel = selectedCorps===corpsId;
              return (
                <button key={corpsId} onClick={()=>setSelectedCorps(corpsId)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-xs font-semibold"
                  style={{
                    background: sel ? meta.badgeBg : 'rgba(255,255,255,0.02)',
                    borderColor: sel ? meta.primaryColor : 'rgba(255,255,255,0.08)',
                    boxShadow: sel ? '0 0 16px '+meta.primaryColor+'44' : 'none',
                  }}>
                  <Logo size={28}/>
                  <span style={{ color: meta.secondaryColor }}>{meta.shortLabel}</span>
                  <span className="text-slate-500 text-[10px]">{count} affaires</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl border border-slate-800 bg-slate-900/30">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search size={14} className="text-slate-500"/>
            <input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
              placeholder="Rechercher une affaire..."
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none"/>
          </div>
          <select value={selectedStatus} onChange={e=>setSelectedStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none">
            <option value="ALL">Tous statuts</option>
            {Object.entries(STATUS_CONFIG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
          </select>
          {selectedCorps !== 'ALL' && depts.length > 0 && (
            <select value={selectedDept} onChange={e=>setSelectedDept(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none">
              <option value="ALL">Tous départements</option>
              {depts.map((d:any)=><option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          )}
          {selectedCorps !== 'ALL' && caseTypes.length > 0 && (
            <select value={selectedCaseType} onChange={e=>setSelectedCaseType(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded-lg px-3 py-2 focus:outline-none">
              <option value="ALL">Tous types</option>
              {caseTypes.map((c:any)=><option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          )}
          <div className="text-xs text-slate-500">{filtered.length} affaire(s) trouvée(s)</div>
        </div>

        {/* Cases table */}
        <div className="rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60">
                  <th className="px-4 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">Corps</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">Affaire</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">Priorité</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">Unité</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">Région</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">Entités</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-500 font-semibold uppercase tracking-wider">Màj</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-16 text-center text-slate-500">Aucune affaire trouvée</td></tr>
                ) : (
                  filtered.map(cas => (
                    <CaseRow key={cas.id} cas={cas} onClick={()=>navigate('/cases/'+cas.id)}/>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Regional stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-blue-400"/>
              <span className="text-sm font-bold text-white">Répartition par corps</span>
            </div>
            {(Object.keys(CORPS_LOGOS) as CorpsId[]).map(corpsId => {
              const Logo = CORPS_LOGOS[corpsId];
              const meta = CORPS_META[corpsId];
              const count = cases.filter(c=>c.corps===corpsId).length;
              const pct = cases.length ? Math.round(count/cases.length*100) : 0;
              return (
                <div key={corpsId} className="flex items-center gap-3 mb-3">
                  <Logo size={20}/>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: meta.secondaryColor }}>{meta.shortLabel}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800">
                      <div className="h-1.5 rounded-full" style={{ width: pct+'%', background: meta.primaryColor }}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-yellow-400"/>
              <span className="text-sm font-bold text-white">Statuts des affaires</span>
            </div>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const count = cases.filter(c=>c.status===key).length;
              const pct = cases.length ? Math.round(count/cases.length*100) : 0;
              return (
                <div key={key} className="flex items-center gap-3 mb-3">
                  <span style={{ color: cfg.color }}>{cfg.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{cfg.label}</span>
                      <span className="text-slate-500">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800">
                      <div className="h-1.5 rounded-full" style={{ width: pct+'%', background: cfg.color }}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} className="text-green-400"/>
              <span className="text-sm font-bold text-white">Affaires urgentes</span>
            </div>
            {cases.filter(c=>c.priority==='URGENCE'||c.priority==='HAUTE').slice(0,5).map(cas => {
              const Logo = CORPS_LOGOS[cas.corps];
              const priority = PRIORITY_CONFIG[cas.priority];
              return (
                <div key={cas.id} className="flex items-center gap-3 mb-3 cursor-pointer hover:bg-slate-800/50 rounded-lg p-2 -mx-2 transition-colors"
                  onClick={()=>navigate('/cases/'+cas.id)}>
                  <Logo size={24}/>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white font-medium truncate">{cas.title}</div>
                    <div className="text-xs" style={{ color: priority.color }}>{priority.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Case Modal */}
      {showNewCase && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b1020] border border-slate-700 rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-white mb-6">Nouvelle affaire</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Titre de l'affaire</label>
                <input value={newTitle} onChange={e=>setNewTitle(e.target.value)}
                  placeholder="Description concise..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-slate-500"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Corps compétent</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(CORPS_LOGOS) as CorpsId[]).map(c=>{
                    const Logo=CORPS_LOGOS[c];
                    const meta=CORPS_META[c];
                    return (
                      <button key={c} onClick={()=>setNewCorps(c)}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl border transition-all"
                        style={{
                          background: newCorps===c ? meta.badgeBg : 'transparent',
                          borderColor: newCorps===c ? meta.primaryColor : '#334155',
                        }}>
                        <Logo size={28}/>
                        <span className="text-[10px]" style={{ color: meta.secondaryColor }}>{meta.shortLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Priorité</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['URGENCE','HAUTE','NORMALE','BASSE'] as const).map(p=>(
                    <button key={p} onClick={()=>setNewPriority(p)}
                      className="text-xs py-1.5 rounded-lg border font-semibold transition-all"
                      style={{
                        background: newPriority===p ? PRIORITY_CONFIG[p].color+'22' : 'transparent',
                        borderColor: newPriority===p ? PRIORITY_CONFIG[p].color : '#334155',
                        color: PRIORITY_CONFIG[p].color,
                      }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={()=>setShowNewCase(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm hover:bg-slate-800 transition-colors">
                Annuler
              </button>
              <button onClick={createCase}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
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
