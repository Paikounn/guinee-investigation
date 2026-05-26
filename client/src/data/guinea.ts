// Guinea geographic and security data for autofill and AI suggestions

export const GUINEA_REGIONS = [
  { id: 'conakry', name: 'Conakry', type: 'capitale' },
  { id: 'guinee-maritime', name: 'Guinée Maritime', type: 'region' },
  { id: 'moyenne-guinee', name: 'Moyenne Guinée (Fouta Djallon)', type: 'region' },
  { id: 'haute-guinee', name: 'Haute Guinée', type: 'region' },
  { id: 'guinee-forestiere', name: 'Guinée Forestière', type: 'region' },
];

export const GUINEA_PREFECTURES: Record<string, { name: string; region: string; subPrefectures: string[] }> = {
  // Guinée Maritime
  boffa: { name: 'Boffa', region: 'Guinée Maritime', subPrefectures: ['Boffa Centre', 'Douprou', 'Koba', 'Tamita', 'Tougnifily'] },
  boke: { name: 'Boké', region: 'Guinée Maritime', subPrefectures: ['Boké Centre', 'Banguigny', 'Kamsar', 'Kolaboui', 'Mankountan', 'Sangaredi', 'Tougnifily'] },
  coyah: { name: 'Coyah', region: 'Guinée Maritime', subPrefectures: ['Coyah Centre', 'Fogny', 'Kouriah', 'Manéah', 'Wonkifong'] },
  dubreka: { name: 'Dubréka', region: 'Guinée Maritime', subPrefectures: ['Dubréka Centre', 'Balandougou', 'Kassa', 'Khorira', 'Sekoraya'] },
  forecariah: { name: 'Forécariah', region: 'Guinée Maritime', subPrefectures: ['Forécariah Centre', 'Farmoriah', 'Kallia', 'Maférinyah', 'Moribaya', 'Sikhourou'] },
  fria: { name: 'Fria', region: 'Guinée Maritime', subPrefectures: ['Fria Centre', 'Banguinet', 'Tormelin'] },
  kindia: { name: 'Kindia', region: 'Guinée Maritime', subPrefectures: ['Kindia Centre', 'Bangouré', 'Damakania', 'Kolenté', 'Molota', 'Samayah', 'Souguéta'] },
  telimele: { name: 'Télimélé', region: 'Guinée Maritime', subPrefectures: ['Télimélé Centre', 'Bertayah', 'Bourouwal-Tapé', 'Fidécounda', 'Gongoré', 'Missidougou', 'Saramoussaya', 'Thionthian'] },

  // Moyenne Guinée
  dalaba: { name: 'Dalaba', region: 'Moyenne Guinée', subPrefectures: ['Dalaba Centre', 'Bodié', 'Dounkimagna', 'Kébaly', 'Mitty', 'Pellel', 'Sannou'] },
  gaoual: { name: 'Gaoual', region: 'Moyenne Guinée', subPrefectures: ['Gaoual Centre', 'Foulamory', 'Kakoni', 'Koumbia', 'Malanta', 'Wendou-M\'Bour'] },
  koubia: { name: 'Koubia', region: 'Moyenne Guinée', subPrefectures: ['Koubia Centre', 'Doghol-Sigon', 'Gonin', 'Lafou', 'Mombéya'] },
  labe: { name: 'Labé', region: 'Moyenne Guinée', subPrefectures: ['Labé Centre', 'Daara', 'Hafia', 'Kouratongo', 'Noussy', 'Popodara', 'Tountouroun'] },
  lelouma: { name: 'Lélouma', region: 'Moyenne Guinée', subPrefectures: ['Lélouma Centre', 'Baldé-Sounga', 'Diari', 'Féou', 'Gadha-Woundou', 'Koïn', 'Maci', 'Thianguel-Bori', 'Trimoh'] },
  mali: { name: 'Mali', region: 'Moyenne Guinée', subPrefectures: ['Mali Centre', 'Dedougou', 'Fougou', 'Hèrèmakono', 'Madina-Wora', 'Yembering'] },
  mamou: { name: 'Mamou', region: 'Moyenne Guinée', subPrefectures: ['Mamou Centre', 'Bangouya', 'Bouliwel', 'Gongoré', 'Porédaka', 'Saramoussaya', 'Soyah', 'Timbo', 'Tolo'] },
  pita: { name: 'Pita', region: 'Moyenne Guinée', subPrefectures: ['Pita Centre', 'Bantignel', 'Dongol-Touma', 'Gongoré', 'Maci', 'Mitty', 'Pellel', 'Timbi-Madina', 'Timbi-Touni'] },
  tougue: { name: 'Tougué', region: 'Moyenne Guinée', subPrefectures: ['Tougué Centre', 'Bourouwal', 'Diari', 'Fougou', 'Gongoré', 'Kollet', 'Linsan-Koura'] },

  // Haute Guinée
  dabola: { name: 'Dabola', region: 'Haute Guinée', subPrefectures: ['Dabola Centre', 'Arfamoussaya', 'Bissikrima', 'Kindoye', 'Konindou'] },
  dinguiraye: { name: 'Dinguiraye', region: 'Haute Guinée', subPrefectures: ['Dinguiraye Centre', 'Dialakoro', 'Diari', 'Garanfoli', 'Kalinko', 'Lansanaya', 'Miri'] },
  faranah: { name: 'Faranah', region: 'Haute Guinée', subPrefectures: ['Faranah Centre', 'Banian', 'Baro', 'Gnalén', 'Kobikoro', 'Sandenia', 'Songoyah', 'Tiro'] },
  kankan: { name: 'Kankan', region: 'Haute Guinée', subPrefectures: ['Kankan Centre', 'Baranama', 'Djankana', 'Foubanah', 'Kabada', 'Koumana', 'Missamana', 'Moribadougou', 'Sabadou-Baranama'] },
  kerouane: { name: 'Kérouané', region: 'Haute Guinée', subPrefectures: ['Kérouané Centre', 'Banankoro', 'Damaro', 'Komodou', 'Linko', 'Sibiribaro'] },
  kissidougou: { name: 'Kissidougou', region: 'Haute Guinée', subPrefectures: ['Kissidougou Centre', 'Bardou', 'Bofossou', 'Fermessadou-Pombo', 'Firawa', 'Gbenko', 'Kondiadou', 'Manfran', 'Tèmessadou-M\'Brit'] },
  kouroussa: { name: 'Kouroussa', region: 'Haute Guinée', subPrefectures: ['Kouroussa Centre', 'Baro', 'Bouré', 'Doura', 'Harmakhono', 'Koumana', 'Sanguiana', 'Sikoro', 'Tinti-Oulen'] },
  mandiana: { name: 'Mandiana', region: 'Haute Guinée', subPrefectures: ['Mandiana Centre', 'Dialakoro', 'Franwalia', 'Kabala', 'Komodou', 'Morodou', 'Nionsomoridougou', 'Saladou', 'Télékoro'] },
  siguiri: { name: 'Siguiri', region: 'Haute Guinée', subPrefectures: ['Siguiri Centre', 'Doko', 'Franwalia', 'Kintinian', 'Kobikoro', 'Niandankoro', 'Norassoba', 'Ouaran', 'Sissambadougou'] },

  // Guinée Forestière
  beyla: { name: 'Beyla', region: 'Guinée Forestière', subPrefectures: ['Beyla Centre', 'Bania', 'Diassodougou', 'Fouala', 'Gbenko', 'Gnama', 'Lola', 'Moribadougou', 'Sinko'] },
  gueckedou: { name: 'Guéckédou', region: 'Guinée Forestière', subPrefectures: ['Guéckédou Centre', 'Fangamadou', 'Kassadou', 'Koundou', 'Nongoa', 'Ouendé-Sikiro', 'Temessadou-Diécké'] },
  lola: { name: 'Lola', region: 'Guinée Forestière', subPrefectures: ['Lola Centre', 'Bossou', 'Foumbadou', 'Gouécké', 'Nzébéla'] },
  macenta: { name: 'Macenta', region: 'Guinée Forestière', subPrefectures: ['Macenta Centre', 'Bayano', 'Fangamadou', 'Gbangbadou', 'Kouankan', 'Léno', 'Macenta', 'Nzérékoré', 'Panziazou', 'Sérédou', 'Tékoulo', 'Vassérédou'] },
  nzerekore: { name: 'Nzérékoré', region: 'Guinée Forestière', subPrefectures: ['Nzérékoré Centre', 'Bignamou', 'Bounouma', 'Lainé', 'Nzérékoré', 'Soulouta', 'Womey', 'Zié'] },
  yomou: { name: 'Yomou', region: 'Guinée Forestière', subPrefectures: ['Yomou Centre', 'Boma', 'Daféandou', 'Daro', 'Horé-Bandou'] },
};

export const GUINEA_CITIES = [
  'Conakry', 'Kankan', 'Labé', 'Nzérékoré', 'Kindia', 'Mamou', 'Faranah',
  'Boké', 'Siguiri', 'Guéckédou', 'Macenta', 'Kissidougou', 'Kouroussa',
  'Télimélé', 'Forécariah', 'Coyah', 'Dubréka', 'Boffa', 'Fria', 'Kamsar',
  'Dalaba', 'Pita', 'Mali', 'Tougué', 'Koubia', 'Lélouma', 'Gaoual',
  'Dinguiraye', 'Dabola', 'Kérouané', 'Mandiana', 'Beyla', 'Lola', 'Yomou',
  'Sangarédi', 'Koumbia', 'Timbo', 'Labé', 'Popodara', 'Pita', 'Pelel',
];

export const ALL_GUINEA_LOCATIONS = [
  ...GUINEA_CITIES,
  ...Object.values(GUINEA_PREFECTURES).map(p => p.name),
  ...Object.values(GUINEA_PREFECTURES).flatMap(p => p.subPrefectures),
].filter((v, i, a) => a.indexOf(v) === i).sort();

export type CorpsId = 'POLICE' | 'GENDARMERIE' | 'DOUANE' | 'SECURITE_ETAT' | 'GARDE_REPUBLICAINE' | 'POMPIERS' | 'PENITENTIAIRE' | 'EAUX_FORETS';

export const GUINEA_SECURITY_CORPS: Record<CorpsId, {
  name: string;
  shortName: string;
  color: string;
  grades: string[];
  roles: string[];
  ministry: string;
}> = {
  POLICE: {
    name: 'Police Nationale de Guinée',
    shortName: 'PNG',
    color: '#1e3a8a',
    ministry: 'Ministère de la Sécurité et de la Protection Civile',
    grades: ['Gardien de la Paix', 'Caporal', 'Caporal-Chef', 'Sergent', 'Sergent-Chef', 'Adjudant', 'Adjudant-Chef', 'Lieutenant', 'Capitaine', 'Commandant', 'Lieutenant-Colonel', 'Colonel', 'Contrôleur Général', 'Directeur Général'],
    roles: ['Agent de Ronde', 'Officier de Permanence', 'Enquêteur', 'Officier de Police Judiciaire', 'Commissaire', 'Chef de Brigade', 'Chef de Section'],
  },
  GENDARMERIE: {
    name: 'Gendarmerie Nationale de Guinée',
    shortName: 'GNG',
    color: '#14532d',
    ministry: 'Ministère de la Défense Nationale',
    grades: ['Gendarme', 'Brigadier', 'Brigadier-Chef', 'Maréchal des Logis', 'Maréchal des Logis-Chef', 'Adjudant', 'Adjudant-Chef', 'Major', 'Sous-Lieutenant', 'Lieutenant', 'Capitaine', 'Commandant', 'Lieutenant-Colonel', 'Colonel', 'Général de Brigade'],
    roles: ['Gendarme de Brigade', 'Enquêteur Judiciaire', 'Officier de Police Judiciaire', 'Chef de Brigade', 'Commandant de Compagnie', 'Commandant de Groupement'],
  },
  DOUANE: {
    name: 'Douanes Nationales de Guinée',
    shortName: 'DNG',
    color: '#854d0e',
    ministry: 'Ministère du Budget',
    grades: ['Agent des Douanes', 'Contrôleur', 'Contrôleur Principal', 'Inspecteur', 'Inspecteur Principal', 'Receveur des Douanes', 'Directeur des Douanes'],
    roles: ['Agent de Visite', 'Agent de Surveillance', 'Enquêteur Douanier', 'Chef de Poste', 'Chef de Brigade', 'Directeur Régional'],
  },
  SECURITE_ETAT: {
    name: 'Direction Générale de la Sécurité d\'État',
    shortName: 'DGSE',
    color: '#1c1917',
    ministry: 'Présidence de la République',
    grades: ['Agent', 'Agent Principal', 'Officier', 'Officier Supérieur', 'Officier Général', 'Directeur'],
    roles: ['Agent de Renseignement', 'Analyste', 'Officier Traitant', 'Chef de Section', 'Chef de Division', 'Directeur Régional'],
  },
  GARDE_REPUBLICAINE: {
    name: 'Garde Républicaine de Guinée',
    shortName: 'GRG',
    color: '#7c2d12',
    ministry: 'Présidence de la République',
    grades: ['Soldat', 'Caporal', 'Sergent', 'Lieutenant', 'Capitaine', 'Commandant', 'Colonel', 'Général'],
    roles: ['Garde du Corps', 'Escorte Présidentielle', 'Officier de Protocole', 'Chef de Détachement'],
  },
  POMPIERS: {
    name: 'Sapeurs-Pompiers Nationaux',
    shortName: 'SPN',
    color: '#991b1b',
    ministry: 'Ministère de la Sécurité et de la Protection Civile',
    grades: ['Sapeur', 'Caporal', 'Sergent', 'Lieutenant', 'Capitaine', 'Commandant', 'Colonel'],
    roles: ['Sapeur-Pompier', 'Chef d\'Agrès', 'Chef de Garde', 'Officier de Permanence'],
  },
  PENITENTIAIRE: {
    name: 'Administration Pénitentiaire',
    shortName: 'AP',
    color: '#374151',
    ministry: 'Ministère de la Justice',
    grades: ['Gardien', 'Gardien-Chef', 'Major', 'Lieutenant', 'Capitaine', 'Commandant', 'Directeur'],
    roles: ['Surveillant', 'Chef de Détention', 'Officier de Surveillance', 'Directeur d\'Établissement'],
  },
  EAUX_FORETS: {
    name: 'Direction Nationale des Eaux et Forêts',
    shortName: 'DNEF',
    color: '#166534',
    ministry: 'Ministère de l\'Environnement',
    grades: ['Agent Forestier', 'Brigadier Forestier', 'Inspecteur Forestier', 'Ingénieur Forestier', 'Directeur Forestier'],
    roles: ['Agent de Terrain', 'Enquêteur Environnemental', 'Chef de Cantonnement', 'Directeur Régional'],
  },
};

export const AI_ENTITY_TYPES = [
  { type: 'PERSON', label: 'Personne', icon: '👤', description: 'Individu, suspect, témoin, victime' },
  { type: 'VEHICLE', label: 'Véhicule', icon: '🚗', description: 'Voiture, moto, camion, embarcation' },
  { type: 'ADDRESS', label: 'Adresse', icon: '📍', description: 'Domicile, lieu d\'activité, point de rendez-vous' },
  { type: 'PHONE', label: 'Téléphone', icon: '📱', description: 'Numéro de téléphone, appel, communication' },
  { type: 'EVENT', label: 'Événement', icon: '📅', description: 'Incident, réunion, transaction, fait' },
  { type: 'COMPANY', label: 'Organisation', icon: '🏢', description: 'Entreprise, association, groupe criminel' },
  { type: 'DOCUMENT', label: 'Document', icon: '📄', description: 'Pièce d\'identité, contrat, rapport' },
  { type: 'BANK', label: 'Compte Bancaire', icon: '🏦', description: 'Compte, transaction financière, virement' },
];

export const AI_RELATIONSHIP_LABELS = [
  'Associé à', 'Propriétaire de', 'Réside à', 'Contacte', 'Membre de',
  'Emploie', 'Financement de', 'Présent lors de', 'Témoin de', 'Victime de',
  'Suspect principal', 'Complice de', 'Fournisseur de', 'Client de',
  'Parent de', 'Conjoint de', 'Collègue de', 'Supérieur hiérarchique de',
  'Utilise', 'Possède', 'Dirige', 'Contrôle', 'Surveille',
];

export function suggestLocations(query: string): string[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return ALL_GUINEA_LOCATIONS
    .filter(loc => loc.toLowerCase().includes(q))
    .slice(0, 10);
}

export function suggestCorps(query: string): Array<{ id: CorpsId; name: string; shortName: string }> {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return (Object.entries(GUINEA_SECURITY_CORPS) as [CorpsId, typeof GUINEA_SECURITY_CORPS[CorpsId]][])
    .filter(([id, corps]) =>
      corps.name.toLowerCase().includes(q) ||
      corps.shortName.toLowerCase().includes(q) ||
      id.toLowerCase().includes(q)
    )
    .map(([id, corps]) => ({ id, name: corps.name, shortName: corps.shortName }))
    .slice(0, 5);
}

export function suggestGrades(corpsId: CorpsId, query: string): string[] {
  const corps = GUINEA_SECURITY_CORPS[corpsId];
  if (!corps) return [];
  if (!query) return corps.grades;
  const q = query.toLowerCase();
  return corps.grades.filter(g => g.toLowerCase().includes(q));
}
