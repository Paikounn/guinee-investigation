// NodePanel.tsx — Corps-specific investigation panel for all 8 entity types
import React, { useState, useEffect } from 'react';
import { X, Save, ChevronDown, ChevronUp, AlertTriangle, Shield, Star, FileText, User, Car, Building, MapPin, Phone, Calendar, CreditCard, Zap } from 'lucide-react';
import { NodeType, NODE_TYPE_CONFIG, PersonData, VehicleData, OrganizationData, LocationData, PhoneData, EventData, DocumentData, BankData } from '../types';
import { suggestLocations, suggestCorps, suggestGrades, ALL_GUINEA_LOCATIONS, AI_RELATIONSHIP_LABELS } from '../data/guinea';
import { RELATIONSHIP_LABELS } from '../types';
import {
  GRADES, DEPARTMENTS, CASE_TYPES, PROCEDURES, JURIDICTIONS,
  OPERATEURS_GN, BANQUES_GN, NIVEAUX_CLASSIFICATION, FIABILITE_SOURCE, CREDIBILITE_INFO,
  ESPECES_CITES, AIRES_PROTEGEES, POSTES_FRONTALIERS
} from '../data/corps-data';
import { CORPS_META, CorpsId, CorpsBadge } from './CorpsLogos';
import { useAuthStore } from '../stores/authStore';
import { ROLE_META } from '../utils/permissions';

// ─── Props ──────────────────────────────────────────────────────────────────
interface NodePanelProps {
  node: any;
  onClose: () => void;
  onSave: (id: string, data: any) => void;
  activeCorps?: CorpsId;
}

// ─── Helper UI components ───────────────────────────────────────────────────
const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{children}</label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { accent?: string; readOnly?: boolean }> = ({ accent, ...props }) => (
  <input
    {...props}
    className={`w-full bg-slate-900 border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors ${props.readOnly ? 'opacity-60 cursor-not-allowed' : ''} ${props.className || ''}`}
    style={{ borderColor: accent ? accent + '44' : '#334155', ...props.style }}
  />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { accent?: string }> = ({ accent, children, ...props }) => (
  <select
    {...props}
    className={`w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-slate-500 ${props.disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    style={{ borderColor: accent ? accent + '44' : '#334155' }}
  >
    {children}
  </select>
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { accent?: string }> = ({ accent, ...props }) => (
  <textarea
    {...props}
    className={`w-full bg-slate-900 border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors resize-none ${props.readOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
    style={{ borderColor: accent ? accent + '44' : '#334155' }}
  />
);

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; color: string }> = ({ icon, title, color }) => (
  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
    <span style={{ color }}>{icon}</span>
    <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">{title}</span>
  </div>
);

// Location autofill
const LocationInput: React.FC<{ value: string; onChange: (v: string) => void; placeholder?: string; accent?: string }> = ({ value, onChange, placeholder, accent }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const handleChange = (v: string) => {
    onChange(v);
    setSuggestions(v.length > 1 ? suggestLocations(v).slice(0, 8) : []);
    setOpen(true);
  };
  return (
    <div className="relative">
      <Input value={value} onChange={e => handleChange(e.target.value)} placeholder={placeholder || 'Lieu...'} accent={accent} />
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 w-full bg-slate-800 border border-slate-700 rounded-lg mt-1 shadow-xl max-h-40 overflow-y-auto">
          {suggestions.map(s => (
            <div key={s} className="px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 cursor-pointer"
              onMouseDown={() => { onChange(s); setSuggestions([]); setOpen(false); }}>{s}</div>
          ))}
        </div>
      )}
    </div>
  );
};

// Classification badge for DGSE
const ClassificationBadge: React.FC<{ level: string }> = ({ level }) => {
  const colors: Record<string, string> = {
    'Non Classifié': '#6b7280', 'Diffusion Restreinte': '#2563eb', 'Confidentiel': '#d97706', 'Secret': '#dc2626', 'Très Secret': '#7c3aed'
  };
  return (
    <span className="inline-block px-2 py-0.5 rounded text-xs font-bold text-white" style={{ background: colors[level] || '#6b7280' }}>
      {level}
    </span>
  );
};

// ─── MAIN PANEL ─────────────────────────────────────────────────────────────
const NodePanel: React.FC<NodePanelProps> = ({ node, onClose, onSave, activeCorps = 'POLICE' }) => {
  const [data, setData] = useState<any>(node?.data || {});
  const [showRelations, setShowRelations] = useState(false);
  const [showProcedure, setShowProcedure] = useState(false);
  const [showCorpsPanel, setShowCorpsPanel] = useState(true);

  useEffect(() => { setData(node?.data || {}); }, [node]);

  const { canEditData, user } = useAuthStore();
  const readOnly = !canEditData();

  if (!node) return null;

  const type: NodeType = node.data?.type || 'PERSON';
  const cfg = NODE_TYPE_CONFIG[type];
  const corps = CORPS_META[activeCorps];
  const accent = cfg?.color || corps.primaryColor;

  const update = (key: string, val: any) => setData((d: any) => ({ ...d, [key]: val }));

  const handleSave = () => {
    onSave(node.id, { ...data, type });
  };

  // ─── Base entity fields ─────────────────────────────────────────────────
  const PersonFields = () => (
    <div className="space-y-3">
      <SectionHeader icon={<User size={14}/>} title="Identité" color={accent}/>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Prénom</Label><Input value={data.firstName||''} onChange={e=>update('firstName',e.target.value)} placeholder="Prénom" accent={accent}/></div>
        <div><Label>Nom</Label><Input value={data.lastName||''} onChange={e=>update('lastName',e.target.value)} placeholder="Nom" accent={accent}/></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Date de naissance</Label><Input type="date" value={data.birthDate||''} onChange={e=>update('birthDate',e.target.value)} accent={accent}/></div>
        <div><Label>Nationalité</Label><Input value={data.nationality||'Guinéenne'} onChange={e=>update('nationality',e.target.value)} accent={accent}/></div>
      </div>
      <div><Label>Lieu de naissance</Label><LocationInput value={data.birthPlace||''} onChange={v=>update('birthPlace',v)} placeholder="Préfecture/Ville" accent={accent}/></div>
      <div><Label>Adresse</Label><LocationInput value={data.address||''} onChange={v=>update('address',v)} placeholder="Localité actuelle" accent={accent}/></div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Profession</Label><Input value={data.profession||''} onChange={e=>update('profession',e.target.value)} placeholder="Profession" accent={accent}/></div>
        <div><Label>Téléphone</Label><Input value={data.phone||''} onChange={e=>update('phone',e.target.value)} placeholder="+224..." accent={accent}/></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>N° CNI / Passeport</Label><Input value={data.idNumber||''} onChange={e=>update('idNumber',e.target.value)} accent={accent}/></div>
        <div><Label>Statut</Label>
          <Select value={data.status||''} onChange={e=>update('status',e.target.value)} accent={accent}>
            <option value="">-- Statut --</option>
            <option value="SUSPECT">Suspect</option>
            <option value="TEMOIN">Témoin</option>
            <option value="VICTIME">Victime</option>
            <option value="COMPLICE">Complice</option>
            <option value="RECHERCHE">Recherché</option>
            <option value="MIS_EN_CAUSE">Mis en cause</option>
            <option value="INFORME">Informé</option>
          </Select>
        </div>
      </div>
      <div><Label>Remarques</Label><TextArea value={data.notes||''} onChange={e=>update('notes',e.target.value)} rows={3} placeholder="Informations complémentaires..." accent={accent}/></div>
    </div>
  );

  const VehicleFields = () => (
    <div className="space-y-3">
      <SectionHeader icon={<Car size={14}/>} title="Véhicule" color={accent}/>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Immatriculation</Label><Input value={data.plate||''} onChange={e=>update('plate',e.target.value)} placeholder="AB-1234-C" accent={accent}/></div>
        <div><Label>Type</Label>
          <Select value={data.vehicleType||''} onChange={e=>update('vehicleType',e.target.value)} accent={accent}>
            <option value="">-- Type --</option>
            <option>Berline</option><option>4x4</option><option>Moto</option>
            <option>Camion</option><option>Minibus</option><option>Pirogue</option>
            <option>Autre</option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Marque</Label><Input value={data.brand||''} onChange={e=>update('brand',e.target.value)} placeholder="Toyota, etc." accent={accent}/></div>
        <div><Label>Modèle</Label><Input value={data.model||''} onChange={e=>update('model',e.target.value)} placeholder="Hilux, etc." accent={accent}/></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Année</Label><Input value={data.year||''} onChange={e=>update('year',e.target.value)} placeholder="2022" accent={accent}/></div>
        <div><Label>Couleur</Label><Input value={data.color||''} onChange={e=>update('color',e.target.value)} placeholder="Blanc" accent={accent}/></div>
      </div>
      <div><Label>N° Châssis (VIN)</Label><Input value={data.vin||''} onChange={e=>update('vin',e.target.value)} accent={accent}/></div>
      <div><Label>Dernière localisation</Label><LocationInput value={data.lastLocation||''} onChange={v=>update('lastLocation',v)} accent={accent}/></div>
      <div><Label>Propriétaire déclaré</Label><Input value={data.owner||''} onChange={e=>update('owner',e.target.value)} accent={accent}/></div>
    </div>
  );

  const OrganizationFields = () => (
    <div className="space-y-3">
      <SectionHeader icon={<Building size={14}/>} title="Organisation" color={accent}/>
      <div><Label>Nom</Label><Input value={data.name||''} onChange={e=>update('name',e.target.value)} placeholder="Nom de l'organisation" accent={accent}/></div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Type</Label>
          <Select value={data.orgType||''} onChange={e=>update('orgType',e.target.value)} accent={accent}>
            <option value="">-- Type --</option>
            <option>Entreprise</option><option>ONG</option><option>Administration</option>
            <option>Groupe criminel</option><option>Réseau</option><option>Groupe armé</option>
            <option>Parti politique</option><option>Syndicat</option>
          </Select>
        </div>
        <div><Label>RCCM</Label><Input value={data.rccm||''} onChange={e=>update('rccm',e.target.value)} placeholder="N° RCCM" accent={accent}/></div>
      </div>
      <div><Label>Siège social</Label><LocationInput value={data.address||''} onChange={v=>update('address',v)} accent={accent}/></div>
      <div><Label>Représentant légal</Label><Input value={data.legalRep||''} onChange={e=>update('legalRep',e.target.value)} accent={accent}/></div>
      <div><Label>Activités déclarées</Label><TextArea value={data.activities||''} onChange={e=>update('activities',e.target.value)} rows={2} accent={accent}/></div>
    </div>
  );

  const LocationFields = () => (
    <div className="space-y-3">
      <SectionHeader icon={<MapPin size={14}/>} title="Lieu" color={accent}/>
      <div><Label>Désignation</Label><Input value={data.name||''} onChange={e=>update('name',e.target.value)} placeholder="Nom du lieu" accent={accent}/></div>
      <div><Label>Localité</Label><LocationInput value={data.location||''} onChange={v=>update('location',v)} accent={accent}/></div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Latitude</Label><Input type="number" value={data.lat||''} onChange={e=>update('lat',e.target.value)} placeholder="9.5..." accent={accent}/></div>
        <div><Label>Longitude</Label><Input type="number" value={data.lng||''} onChange={e=>update('lng',e.target.value)} placeholder="-13.7..." accent={accent}/></div>
      </div>
      <div><Label>Type de lieu</Label>
        <Select value={data.locType||''} onChange={e=>update('locType',e.target.value)} accent={accent}>
          <option value="">-- Type --</option>
          <option>Domicile</option><option>Bureau</option><option>Entrepôt</option>
          <option>Poste frontière</option><option>Aéroport</option><option>Port</option>
          <option>Zone forestière</option><option>Carrefour</option><option>Marché</option>
        </Select>
      </div>
    </div>
  );

  const PhoneFields = () => (
    <div className="space-y-3">
      <SectionHeader icon={<Phone size={14}/>} title="Téléphone / IMEI" color={accent}/>
      <div><Label>Numéro</Label><Input value={data.number||''} onChange={e=>update('number',e.target.value)} placeholder="+224 6X XX XX XX" accent={accent}/></div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Opérateur</Label>
          <Select value={data.operator||''} onChange={e=>update('operator',e.target.value)} accent={accent}>
            <option value="">-- Opérateur --</option>
            {OPERATEURS_GN.map(op=><option key={op}>{op}</option>)}
          </Select>
        </div>
        <div><Label>IMEI</Label><Input value={data.imei||''} onChange={e=>update('imei',e.target.value)} placeholder="35XXXXXX" accent={accent}/></div>
      </div>
      <div><Label>Propriétaire enregistré</Label><Input value={data.registeredOwner||''} onChange={e=>update('registeredOwner',e.target.value)} accent={accent}/></div>
      <div><Label>Dernière cellule BTS</Label><LocationInput value={data.lastCell||''} onChange={v=>update('lastCell',v)} placeholder="Tour BTS / zone" accent={accent}/></div>
    </div>
  );

  const EventFields = () => (
    <div className="space-y-3">
      <SectionHeader icon={<Calendar size={14}/>} title="Événement" color={accent}/>
      <div><Label>Titre</Label><Input value={data.title||''} onChange={e=>update('title',e.target.value)} accent={accent}/></div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Date</Label><Input type="date" value={data.eventDate||''} onChange={e=>update('eventDate',e.target.value)} accent={accent}/></div>
        <div><Label>Heure</Label><Input type="time" value={data.eventTime||''} onChange={e=>update('eventTime',e.target.value)} accent={accent}/></div>
      </div>
      <div><Label>Lieu</Label><LocationInput value={data.eventLocation||''} onChange={v=>update('eventLocation',v)} accent={accent}/></div>
      <div><Label>Type d'événement</Label>
        <Select value={data.eventType||''} onChange={e=>update('eventType',e.target.value)} accent={accent}>
          <option value="">-- Type --</option>
          <option>Arrestation</option><option>Perquisition</option><option>Rencontre suspecte</option>
          <option>Transaction</option><option>Transfert</option><option>Infraction</option>
          <option>Incident</option><option>Réunion</option>
        </Select>
      </div>
      <div><Label>Description</Label><TextArea value={data.description||''} onChange={e=>update('description',e.target.value)} rows={3} accent={accent}/></div>
    </div>
  );

  const DocumentFields = () => (
    <div className="space-y-3">
      <SectionHeader icon={<FileText size={14}/>} title="Document" color={accent}/>
      <div><Label>Titre / Référence</Label><Input value={data.docTitle||''} onChange={e=>update('docTitle',e.target.value)} accent={accent}/></div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Type de document</Label>
          <Select value={data.docType||''} onChange={e=>update('docType',e.target.value)} accent={accent}>
            <option value="">-- Type --</option>
            <option>CNI</option><option>Passeport</option><option>Acte judiciaire</option>
            <option>Mandat</option><option>PV</option><option>Rapport</option>
            <option>Contrat</option><option>Certificat</option><option>Facture</option>
          </Select>
        </div>
        <div><Label>Numéro</Label><Input value={data.docNumber||''} onChange={e=>update('docNumber',e.target.value)} accent={accent}/></div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label>Date d'émission</Label><Input type="date" value={data.issueDate||''} onChange={e=>update('issueDate',e.target.value)} accent={accent}/></div>
        <div><Label>Date d'expiration</Label><Input type="date" value={data.expiryDate||''} onChange={e=>update('expiryDate',e.target.value)} accent={accent}/></div>
      </div>
      <div><Label>Autorité émettrice</Label><Input value={data.issuedBy||''} onChange={e=>update('issuedBy',e.target.value)} accent={accent}/></div>
    </div>
  );

  const BankFields = () => (
    <div className="space-y-3">
      <SectionHeader icon={<CreditCard size={14}/>} title="Compte Bancaire" color={accent}/>
      <div><Label>Banque</Label>
        <Select value={data.bank||''} onChange={e=>update('bank',e.target.value)} accent={accent}>
          <option value="">-- Banque --</option>
          {BANQUES_GN.map(b=><option key={b}>{b}</option>)}
        </Select>
      </div>
      <div><Label>N° de compte / IBAN</Label><Input value={data.accountNumber||''} onChange={e=>update('accountNumber',e.target.value)} accent={accent}/></div>
      <div><Label>Titulaire</Label><Input value={data.accountHolder||''} onChange={e=>update('accountHolder',e.target.value)} accent={accent}/></div>
      <div className="grid grid-cols-3 gap-2">
        <div><Label>Solde GNF</Label><Input type="number" value={data.balanceGNF||''} onChange={e=>update('balanceGNF',e.target.value)} placeholder="0" accent={accent}/></div>
        <div><Label>Solde USD</Label><Input type="number" value={data.balanceUSD||''} onChange={e=>update('balanceUSD',e.target.value)} placeholder="0" accent={accent}/></div>
        <div><Label>Solde EUR</Label><Input type="number" value={data.balanceEUR||''} onChange={e=>update('balanceEUR',e.target.value)} placeholder="0" accent={accent}/></div>
      </div>
      <div><Label>Transactions suspectes</Label><TextArea value={data.suspiciousTx||''} onChange={e=>update('suspiciousTx',e.target.value)} rows={2} accent={accent}/></div>
    </div>
  );

  // ─── Corps-specific panels ────────────────────────────────────────────────
  const PoliceCorpsPanel = () => {
    const depts = DEPARTMENTS.POLICE;
    const caseTypes = CASE_TYPES.POLICE;
    const procedures = PROCEDURES.POLICE;
    const grades = GRADES.POLICE;
    return (
      <div className="space-y-3">
        <SectionHeader icon={<Shield size={14}/>} title="Fiche Police Nationale" color="#1a2a5e"/>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>N° PV</Label><Input value={data.pvNumber||''} onChange={e=>update('pvNumber',e.target.value)} placeholder="PV-2025-XXXX" accent="#1a2a5e"/></div>
          <div><Label>N° Parquet</Label><Input value={data.parquetNumber||''} onChange={e=>update('parquetNumber',e.target.value)} placeholder="PAR-XXXX" accent="#1a2a5e"/></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Département</Label>
            <Select value={data.department||''} onChange={e=>update('department',e.target.value)} accent="#1a2a5e">
              <option value="">-- Département --</option>
              {depts.map((d:any)=><option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </div>
          <div><Label>Type d'affaire</Label>
            <Select value={data.caseType||''} onChange={e=>update('caseType',e.target.value)} accent="#1a2a5e">
              <option value="">-- Type --</option>
              {caseTypes.map((c:any)=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Procédure</Label>
            <Select value={data.procedure||''} onChange={e=>update('procedure',e.target.value)} accent="#1a2a5e">
              <option value="">-- Procédure --</option>
              {procedures.map((p:any)=><option key={p.id} value={p.id}>{p.label}</option>)}
            </Select>
          </div>
          <div><Label>Grade OPJ</Label>
            <Select value={data.grade||''} onChange={e=>update('grade',e.target.value)} accent="#1a2a5e">
              <option value="">-- Grade --</option>
              {grades.map((g:string)=><option key={g} value={g}>{g}</option>)}
            </Select>
          </div>
        </div>
        <div><Label>Juridiction saisie</Label>
          <Select value={data.juridiction||''} onChange={e=>update('juridiction',e.target.value)} accent="#1a2a5e">
            <option value="">-- Juridiction --</option>
            {JURIDICTIONS.map((j:string)=><option key={j}>{j}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Garde à vue</Label>
            <Select value={data.gavStatus||''} onChange={e=>update('gavStatus',e.target.value)} accent="#1a2a5e">
              <option value="">-- GAV --</option>
              <option>En cours</option><option>Levée</option><option>Prolongée</option><option>Transmis parquet</option>
            </Select>
          </div>
          <div><Label>Durée GAV (h)</Label><Input type="number" value={data.gavDuration||''} onChange={e=>update('gavDuration',e.target.value)} placeholder="48" accent="#1a2a5e"/></div>
        </div>
        <div><Label>Officier en charge</Label><Input value={data.officerInCharge||''} onChange={e=>update('officerInCharge',e.target.value)} placeholder="Nom et grade" accent="#1a2a5e"/></div>
        <div><Label>Observations</Label><TextArea value={data.corpsNotes||''} onChange={e=>update('corpsNotes',e.target.value)} rows={3} placeholder="Notes d'enquête Police..." accent="#1a2a5e"/></div>
      </div>
    );
  };

  const GendarmerieCorpsPanel = () => {
    const depts = DEPARTMENTS.GENDARMERIE;
    const caseTypes = CASE_TYPES.GENDARMERIE;
    const procedures = PROCEDURES.GENDARMERIE;
    const grades = GRADES.GENDARMERIE;
    return (
      <div className="space-y-3">
        <SectionHeader icon={<Shield size={14}/>} title="Fiche Gendarmerie Nationale" color="#009460"/>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>N° Procès-verbal</Label><Input value={data.pvNumber||''} onChange={e=>update('pvNumber',e.target.value)} placeholder="GN-PV-2025-XXXX" accent="#009460"/></div>
          <div><Label>N° Procédure</Label><Input value={data.procedureNumber||''} onChange={e=>update('procedureNumber',e.target.value)} accent="#009460"/></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Unité / Brigade</Label>
            <Select value={data.department||''} onChange={e=>update('department',e.target.value)} accent="#009460">
              <option value="">-- Unité --</option>
              {depts.map((d:any)=><option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </div>
          <div><Label>Type d'affaire</Label>
            <Select value={data.caseType||''} onChange={e=>update('caseType',e.target.value)} accent="#009460">
              <option value="">-- Type --</option>
              {caseTypes.map((c:any)=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Procédure</Label>
            <Select value={data.procedure||''} onChange={e=>update('procedure',e.target.value)} accent="#009460">
              <option value="">-- Procédure --</option>
              {procedures.map((p:any)=><option key={p.id} value={p.id}>{p.label}</option>)}
            </Select>
          </div>
          <div><Label>Grade enquêteur</Label>
            <Select value={data.grade||''} onChange={e=>update('grade',e.target.value)} accent="#009460">
              <option value="">-- Grade --</option>
              {grades.map((g:string)=><option key={g} value={g}>{g}</option>)}
            </Select>
          </div>
        </div>
        <div><Label>Zone territoriale</Label><LocationInput value={data.territorialZone||''} onChange={v=>update('territorialZone',v)} placeholder="Préfecture / Sous-préfecture" accent="#009460"/></div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Juridiction</Label>
            <Select value={data.juridiction||''} onChange={e=>update('juridiction',e.target.value)} accent="#009460">
              <option value="">-- Juridiction --</option>
              {JURIDICTIONS.map((j:string)=><option key={j}>{j}</option>)}
            </Select>
          </div>
          <div><Label>Mode opératoire</Label><Input value={data.modus||''} onChange={e=>update('modus',e.target.value)} accent="#009460"/></div>
        </div>
        <div><Label>Observations</Label><TextArea value={data.corpsNotes||''} onChange={e=>update('corpsNotes',e.target.value)} rows={3} placeholder="Notes d'enquête Gendarmerie..." accent="#009460"/></div>
      </div>
    );
  };

  const DouanesCorpsPanel = () => {
    const depts = DEPARTMENTS.DOUANE;
    const caseTypes = CASE_TYPES.DOUANE;
    const procedures = PROCEDURES.DOUANE;
    const grades = GRADES.DOUANE;
    return (
      <div className="space-y-3">
        <SectionHeader icon={<Shield size={14}/>} title="Fiche Douanes Nationales" color="#ff8c00"/>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>N° Procès-verbal</Label><Input value={data.pvNumber||''} onChange={e=>update('pvNumber',e.target.value)} placeholder="DOU-PV-2025-XXXX" accent="#ff8c00"/></div>
          <div><Label>N° Déclaration</Label><Input value={data.declarationNumber||''} onChange={e=>update('declarationNumber',e.target.value)} accent="#ff8c00"/></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Service</Label>
            <Select value={data.department||''} onChange={e=>update('department',e.target.value)} accent="#ff8c00">
              <option value="">-- Service --</option>
              {depts.map((d:any)=><option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </div>
          <div><Label>Type d'infraction</Label>
            <Select value={data.caseType||''} onChange={e=>update('caseType',e.target.value)} accent="#ff8c00">
              <option value="">-- Infraction --</option>
              {caseTypes.map((c:any)=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Procédure</Label>
            <Select value={data.procedure||''} onChange={e=>update('procedure',e.target.value)} accent="#ff8c00">
              <option value="">-- Procédure --</option>
              {procedures.map((p:any)=><option key={p.id} value={p.id}>{p.label}</option>)}
            </Select>
          </div>
          <div><Label>Grade agent</Label>
            <Select value={data.grade||''} onChange={e=>update('grade',e.target.value)} accent="#ff8c00">
              <option value="">-- Grade --</option>
              {grades.map((g:string)=><option key={g} value={g}>{g}</option>)}
            </Select>
          </div>
        </div>
        <div><Label>Poste frontière</Label>
          <Select value={data.borderPost||''} onChange={e=>update('borderPost',e.target.value)} accent="#ff8c00">
            <option value="">-- Poste --</option>
            {POSTES_FRONTALIERS.map((p:any)=><option key={p.nom} value={p.nom}>{p.nom} ({p.pays})</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div><Label>Valeur déclarée (GNF)</Label><Input type="number" value={data.declaredValue||''} onChange={e=>update('declaredValue',e.target.value)} accent="#ff8c00"/></div>
          <div><Label>Valeur réelle (GNF)</Label><Input type="number" value={data.realValue||''} onChange={e=>update('realValue',e.target.value)} accent="#ff8c00"/></div>
          <div><Label>Amende (GNF)</Label><Input type="number" value={data.fine||''} onChange={e=>update('fine',e.target.value)} accent="#ff8c00"/></div>
        </div>
        <div><Label>Marchandises saisies</Label><TextArea value={data.seizures||''} onChange={e=>update('seizures',e.target.value)} rows={2} placeholder="Description des marchandises..." accent="#ff8c00"/></div>
        <div><Label>Observations</Label><TextArea value={data.corpsNotes||''} onChange={e=>update('corpsNotes',e.target.value)} rows={2} accent="#ff8c00"/></div>
      </div>
    );
  };

  const DGSECorpsPanel = () => {
    const depts = DEPARTMENTS.SECURITE_ETAT;
    const caseTypes = CASE_TYPES.SECURITE_ETAT;
    const grades = GRADES.SECURITE_ETAT;
    return (
      <div className="space-y-3">
        <SectionHeader icon={<AlertTriangle size={14}/>} title="Fiche Sécurité d'État" color="#CE1126"/>
        <div className="flex items-center gap-2 mb-2">
          <Label>Classification</Label>
          <Select value={data.classification||'Non Classifié'} onChange={e=>update('classification',e.target.value)} accent="#CE1126">
            {NIVEAUX_CLASSIFICATION.map((n:any)=><option key={n.id} value={n.label}>{n.label}</option>)}
          </Select>
          {data.classification && <ClassificationBadge level={data.classification}/>}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>N° Rapport</Label><Input value={data.reportNumber||''} onChange={e=>update('reportNumber',e.target.value)} placeholder="DGSE-R-2025-XXXX" accent="#CE1126"/></div>
          <div><Label>Service traitant</Label>
            <Select value={data.department||''} onChange={e=>update('department',e.target.value)} accent="#CE1126">
              <option value="">-- Service --</option>
              {depts.map((d:any)=><option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Fiabilité source (A-F)</Label>
            <Select value={data.sourceReliability||''} onChange={e=>update('sourceReliability',e.target.value)} accent="#CE1126">
              <option value="">-- Fiabilité --</option>
              {FIABILITE_SOURCE.map((f:any)=><option key={f.code} value={f.code}>{f.code} — {f.label}</option>)}
            </Select>
          </div>
          <div><Label>Crédibilité info (1-6)</Label>
            <Select value={data.infoCredibility||''} onChange={e=>update('infoCredibility',e.target.value)} accent="#CE1126">
              <option value="">-- Crédibilité --</option>
              {CREDIBILITE_INFO.map((c:any)=><option key={c.code} value={c.code}>{c.code} — {c.label}</option>)}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Type de renseignement</Label>
            <Select value={data.caseType||''} onChange={e=>update('caseType',e.target.value)} accent="#CE1126">
              <option value="">-- Type --</option>
              {caseTypes.map((c:any)=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </Select>
          </div>
          <div><Label>Grade officier traitant</Label>
            <Select value={data.grade||''} onChange={e=>update('grade',e.target.value)} accent="#CE1126">
              <option value="">-- Grade --</option>
              {grades.map((g:string)=><option key={g} value={g}>{g}</option>)}
            </Select>
          </div>
        </div>
        <div><Label>Codename / Opération</Label><Input value={data.operationName||''} onChange={e=>update('operationName',e.target.value)} placeholder="Nom de code..." accent="#CE1126"/></div>
        <div><Label>Analyse / Évaluation</Label><TextArea value={data.analysis||''} onChange={e=>update('analysis',e.target.value)} rows={3} placeholder="Analyse du renseignement..." accent="#CE1126"/></div>
        <div><Label>Diffusion autorisée à</Label><Input value={data.diffusion||''} onChange={e=>update('diffusion',e.target.value)} placeholder="Destinataires autorisés" accent="#CE1126"/></div>
      </div>
    );
  };

  const GardeRepublicaineCorpsPanel = () => {
    const depts = DEPARTMENTS.GARDE_REPUBLICAINE;
    const caseTypes = CASE_TYPES.GARDE_REPUBLICAINE;
    const grades = GRADES.GARDE_REPUBLICAINE;
    return (
      <div className="space-y-3">
        <SectionHeader icon={<Star size={14}/>} title="Fiche Garde Républicaine" color="#FCD116"/>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>N° Ordre de mission</Label><Input value={data.missionOrder||''} onChange={e=>update('missionOrder',e.target.value)} placeholder="GR-OM-2025-XXXX" accent="#FCD116"/></div>
          <div><Label>Unité</Label>
            <Select value={data.department||''} onChange={e=>update('department',e.target.value)} accent="#FCD116">
              <option value="">-- Unité --</option>
              {depts.map((d:any)=><option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Type de mission</Label>
            <Select value={data.caseType||''} onChange={e=>update('caseType',e.target.value)} accent="#FCD116">
              <option value="">-- Mission --</option>
              {caseTypes.map((c:any)=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </Select>
          </div>
          <div><Label>Grade</Label>
            <Select value={data.grade||''} onChange={e=>update('grade',e.target.value)} accent="#FCD116">
              <option value="">-- Grade --</option>
              {grades.map((g:string)=><option key={g} value={g}>{g}</option>)}
            </Select>
          </div>
        </div>
        <div><Label>Personnalité protégée / VIP</Label><Input value={data.vipName||''} onChange={e=>update('vipName',e.target.value)} placeholder="Nom / Titre" accent="#FCD116"/></div>
        <div><Label>Itinéraire / Zone</Label><LocationInput value={data.itinerary||''} onChange={v=>update('itinerary',v)} placeholder="Zones de déplacement" accent="#FCD116"/></div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Date début</Label><Input type="date" value={data.startDate||''} onChange={e=>update('startDate',e.target.value)} accent="#FCD116"/></div>
          <div><Label>Date fin</Label><Input type="date" value={data.endDate||''} onChange={e=>update('endDate',e.target.value)} accent="#FCD116"/></div>
        </div>
        <div><Label>Niveau de menace</Label>
          <Select value={data.threatLevel||''} onChange={e=>update('threatLevel',e.target.value)} accent="#FCD116">
            <option value="">-- Menace --</option>
            <option>Faible</option><option>Modérée</option><option>Élevée</option><option>Critique</option>
          </Select>
        </div>
        <div><Label>Observations</Label><TextArea value={data.corpsNotes||''} onChange={e=>update('corpsNotes',e.target.value)} rows={2} accent="#FCD116"/></div>
      </div>
    );
  };

  const EauxForetsCorpsPanel = () => {
    const depts = DEPARTMENTS.EAUX_FORETS;
    const caseTypes = CASE_TYPES.EAUX_FORETS;
    const procedures = PROCEDURES.EAUX_FORETS;
    const grades = GRADES.EAUX_FORETS;
    return (
      <div className="space-y-3">
        <SectionHeader icon={<Zap size={14}/>} title="Fiche Eaux et Forêts" color="#009460"/>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>N° Procès-verbal</Label><Input value={data.pvNumber||''} onChange={e=>update('pvNumber',e.target.value)} placeholder="EF-PV-2025-XXXX" accent="#009460"/></div>
          <div><Label>Brigade</Label>
            <Select value={data.department||''} onChange={e=>update('department',e.target.value)} accent="#009460">
              <option value="">-- Brigade --</option>
              {depts.map((d:any)=><option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Type d'infraction</Label>
            <Select value={data.caseType||''} onChange={e=>update('caseType',e.target.value)} accent="#009460">
              <option value="">-- Infraction --</option>
              {caseTypes.map((c:any)=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            </Select>
          </div>
          <div><Label>Procédure</Label>
            <Select value={data.procedure||''} onChange={e=>update('procedure',e.target.value)} accent="#009460">
              <option value="">-- Procédure --</option>
              {procedures.map((p:any)=><option key={p.id} value={p.id}>{p.label}</option>)}
            </Select>
          </div>
        </div>
        <div><Label>Aire protégée concernée</Label>
          <Select value={data.protectedArea||''} onChange={e=>update('protectedArea',e.target.value)} accent="#009460">
            <option value="">-- Aire protégée --</option>
            {AIRES_PROTEGEES.map((a:string)=><option key={a}>{a}</option>)}
          </Select>
        </div>
        <div><Label>Espèce CITES saisie</Label>
          <Select value={data.citesSpecies||''} onChange={e=>update('citesSpecies',e.target.value)} accent="#009460">
            <option value="">-- Espèce CITES --</option>
            {ESPECES_CITES.map((s:string)=><option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><Label>Grade agent</Label>
            <Select value={data.grade||''} onChange={e=>update('grade',e.target.value)} accent="#009460">
              <option value="">-- Grade --</option>
              {grades.map((g:string)=><option key={g} value={g}>{g}</option>)}
            </Select>
          </div>
          <div><Label>Quantité saisie</Label><Input value={data.seizureQuantity||''} onChange={e=>update('seizureQuantity',e.target.value)} placeholder="kg / unités" accent="#009460"/></div>
        </div>
        <div><Label>Localisation infraction</Label><LocationInput value={data.infractionLocation||''} onChange={v=>update('infractionLocation',v)} placeholder="Forêt / Zone" accent="#009460"/></div>
        <div><Label>Observations</Label><TextArea value={data.corpsNotes||''} onChange={e=>update('corpsNotes',e.target.value)} rows={2} accent="#009460"/></div>
      </div>
    );
  };

  const corpsPanel: Record<CorpsId, React.ReactNode> = {
    POLICE: <PoliceCorpsPanel/>,
    GENDARMERIE: <GendarmerieCorpsPanel/>,
    DOUANE: <DouanesCorpsPanel/>,
    SECURITE_ETAT: <DGSECorpsPanel/>,
    GARDE_REPUBLICAINE: <GardeRepublicaineCorpsPanel/>,
    EAUX_FORETS: <EauxForetsCorpsPanel/>,
  };

  const entityPanel: Record<NodeType, React.ReactNode> = {
    PERSON: <PersonFields/>,
    VEHICLE: <VehicleFields/>,
    ORGANIZATION: <OrganizationFields/>,
    LOCATION: <LocationFields/>,
    PHONE: <PhoneFields/>,
    EVENT: <EventFields/>,
    DOCUMENT: <DocumentFields/>,
    BANK: <BankFields/>,
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[380px] flex flex-col z-40 shadow-2xl"
      style={{ background: '#0b1020', borderLeft: `1px solid ${accent}33` }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800"
        style={{ background: `linear-gradient(135deg, ${corps.bgDark}, #0b1020)` }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{cfg?.emoji}</span>
          <div>
            <div className="font-bold text-white text-sm">{cfg?.label || type}</div>
            <div className="text-xs" style={{ color: corps.secondaryColor }}>{corps.label}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CorpsBadge corpsId={activeCorps} size={28}/>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X size={16}/>
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Entity fields */}
        <div className="p-4 border-b border-slate-800">
          {entityPanel[type]}
        </div>

        {/* Corps investigation panel */}
        <div className="p-4 border-b border-slate-800">
          <button className="flex items-center justify-between w-full mb-3"
            onClick={()=>setShowCorpsPanel(v=>!v)}>
            <div className="flex items-center gap-2">
              <Shield size={14} style={{ color: corps.accentColor }}/>
              <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Données d'enquête</span>
            </div>
            {showCorpsPanel ? <ChevronUp size={14} className="text-slate-500"/> : <ChevronDown size={14} className="text-slate-500"/>}
          </button>
          {showCorpsPanel && corpsPanel[activeCorps]}
        </div>

        {/* Relation reference */}
        <div className="p-4 border-b border-slate-800">
          <button className="flex items-center justify-between w-full mb-2"
            onClick={()=>setShowRelations(v=>!v)}>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Étiquettes de relations ({RELATIONSHIP_LABELS.length})</span>
            {showRelations ? <ChevronUp size={12} className="text-slate-600"/> : <ChevronDown size={12} className="text-slate-600"/>}
          </button>
          {showRelations && (
            <div className="flex flex-wrap gap-1 mt-2">
              {RELATIONSHIP_LABELS.map((r:string) => (
                <span key={r} className="px-2 py-0.5 rounded text-xs" style={{ background: accent+'22', color: accent, border: `1px solid ${accent}44` }}>{r}</span>
              ))}
            </div>
          )}
        </div>

        {/* Procedure reference */}
        <div className="p-4">
          <button className="flex items-center justify-between w-full mb-2"
            onClick={()=>setShowProcedure(v=>!v)}>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Procédures disponibles</span>
            {showProcedure ? <ChevronUp size={12} className="text-slate-600"/> : <ChevronDown size={12} className="text-slate-600"/>}
          </button>
          {showProcedure && (
            <div className="space-y-1 mt-2">
              {((PROCEDURES as any)[activeCorps] || []).map((p:any) => (
                <div key={p.id || p} className="text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0" style={{ background: accent }}/>
                  {p.label || p}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        {readOnly ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-center">
            <div className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">🔒 Accès Lecture Seule</div>
            <div className="text-amber-300/70 text-xs">
              Votre rôle <span className="font-bold" style={{ color: user?.role ? ROLE_META[user.role]?.color : '#fbbf24' }}>{user?.role ? ROLE_META[user.role]?.labelFr : 'inconnu'}</span> ne permet pas de modifier ces données.
            </div>
            <div className="text-slate-600 text-[10px] mt-1">Contactez un commandant ou l'administrateur.</div>
          </div>
        ) : (
          <button onClick={handleSave}
            className="w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95"
            style={{ background: `linear-gradient(135deg, ${accent}, ${corps.accentColor})`, color: '#fff' }}>
            <Save size={16}/>
            Enregistrer les données
          </button>
        )}
        <div className="text-center text-xs text-slate-600 mt-2">
          Système d'Enquête Guinée v2.0 — {corps.shortLabel}
        </div>
      </div>
    </div>
  );
};

export default NodePanel;
