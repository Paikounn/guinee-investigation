// ============================================================
//  GUINÉE INVESTIGATION — Corps de Sécurité Nationale Data
//  République de Guinée — Données opérationnelles complètes
// ============================================================

export type CorpsId =
  | 'POLICE'
  | 'GENDARMERIE'
  | 'DOUANE'
  | 'SECURITE_ETAT'
  | 'GARDE_REPUBLICAINE'
  | 'EAUX_FORETS'

// ─── Grades par corps ────────────────────────────────────────
export const GRADES: Record<CorpsId, string[]> = {
  POLICE: [
    'Gardien de la Paix', 'Gardien de la Paix Brigadier',
    'Brigadier', 'Brigadier-Chef', 'Sergent', 'Sergent-Chef',
    'Adjudant', 'Adjudant-Chef', 'Major',
    'Inspecteur Stagiaire', 'Inspecteur', 'Inspecteur Principal',
    'Commissaire Stagiaire', 'Commissaire', 'Commissaire Principal',
    'Commissaire Divisionnaire', 'Commissaire Général',
    'Directeur Général de la Police',
  ],
  GENDARMERIE: [
    'Gendarme', 'Gendarme Brigadier', 'Brigadier', 'Brigadier-Chef',
    'Maréchal des Logis', 'Maréchal des Logis-Chef',
    'Adjudant', 'Adjudant-Chef', 'Major',
    'Aspirant', 'Sous-Lieutenant', 'Lieutenant', 'Capitaine',
    'Commandant (Chef d\'Escadron)', 'Lieutenant-Colonel', 'Colonel',
    'Général de Brigade', 'Général de Division',
    'Haut Commandant de la Gendarmerie',
  ],
  DOUANE: [
    'Agent de Constatation', 'Agent de Constatation Principal',
    'Contrôleur des Douanes', 'Contrôleur Principal',
    'Inspecteur des Douanes', 'Inspecteur Principal',
    'Receveur des Douanes', 'Receveur Principal',
    'Directeur des Douanes de Région',
    'Directeur Général des Douanes',
  ],
  SECURITE_ETAT: [
    'Agent', 'Agent Principal', 'Agent Spécialisé',
    'Officier', 'Officier Principal', 'Officier Supérieur',
    'Commandant de Section', 'Chef de Division',
    'Directeur Régional', 'Directeur Central',
    'Directeur Général de la Sécurité d\'État',
  ],
  GARDE_REPUBLICAINE: [
    'Soldat de 2ème classe', 'Soldat de 1ère classe',
    'Caporal', 'Caporal-Chef', 'Sergent', 'Sergent-Chef',
    'Adjudant', 'Adjudant-Chef', 'Major',
    'Sous-Lieutenant', 'Lieutenant', 'Capitaine',
    'Commandant', 'Lieutenant-Colonel', 'Colonel',
    'Général de Brigade', 'Commandant Supérieur de la Garde',
  ],
  EAUX_FORETS: [
    'Agent de Conservation', 'Agent Technique',
    'Brigadier Forestier', 'Brigadier-Chef',
    'Inspecteur Forestier', 'Inspecteur Principal',
    'Ingénieur des Eaux et Forêts',
    'Ingénieur en Chef', 'Directeur Régional',
    'Directeur National des Eaux et Forêts',
  ],
}

// ─── Directions & Départements ──────────────────────────────
export interface Department {
  id: string
  name: string
  shortName: string
  description: string
  roles: string[]
}

export const DEPARTMENTS: Record<CorpsId, Department[]> = {
  POLICE: [
    {
      id: 'DCPJ', name: 'Direction Centrale de la Police Judiciaire', shortName: 'DCPJ',
      description: 'Enquêtes criminelles, crimes et délits, coordination judiciaire',
      roles: ['Officier de Police Judiciaire', 'Chef de Brigade Criminelle', 'Chef de la Brigade Anti-Drogue', 'Coordinateur OPJ'],
    },
    {
      id: 'DCSP', name: 'Direction Centrale de la Sécurité Publique', shortName: 'DCSP',
      description: 'Ordre public, maintien de la paix, sécurité des personnes et biens',
      roles: ['Officier de Permanence', 'Chef de Commissariat', 'Chef de Poste de Police', 'Agent de Ronde'],
    },
    {
      id: 'DCPAF', name: 'Direction Centrale Police de l\'Air et des Frontières', shortName: 'DCPAF',
      description: 'Contrôle frontières, immigration, sécurité aéroportuaire',
      roles: ['Officier PAF', 'Agent de Contrôle Frontière', 'Chef de Poste Frontière', 'Agent Biométrie'],
    },
    {
      id: 'DRG', name: 'Direction des Renseignements Généraux', shortName: 'DRG',
      description: 'Renseignement intérieur, surveillance, analyse des menaces',
      roles: ['Agent de Renseignement', 'Analyste', 'Chef de Section RG', 'Officier Traitant'],
    },
    {
      id: 'BAD', name: 'Brigade Anti-Drogue', shortName: 'BAD',
      description: 'Lutte contre le trafic de stupéfiants et substances illicites',
      roles: ['Chef de Brigade Anti-Drogue', 'Enquêteur Stupéfiants', 'Agent d\'Infiltration'],
    },
    {
      id: 'BEFIN', name: 'Brigade Économique et Financière', shortName: 'BEF',
      description: 'Crimes économiques, fraude, blanchiment, corruption',
      roles: ['Enquêteur Financier', 'Analyste Financier', 'Chef de Brigade Financière'],
    },
    {
      id: 'BCIJ', name: 'Brigade Centrale des Investigations Judiciaires', shortName: 'BCIJ',
      description: 'Investigations judiciaires complexes, crimes organisés',
      roles: ['Investigateur BCIJ', 'Chef de Groupe', 'Coordinateur Judiciaire'],
    },
    {
      id: 'DPPM', name: 'Direction de la Police des Polices et des Mœurs', shortName: 'DPPM',
      description: 'Contrôle interne, discipline, moralité publique',
      roles: ['Officier de l\'IGPN', 'Enquêteur Interne'],
    },
  ],

  GENDARMERIE: [
    {
      id: 'GN_CONAKRY', name: 'Groupement de Gendarmerie de Conakry', shortName: 'GGC',
      description: 'Conakry et communes de la capitale',
      roles: ['Commandant de Groupement', 'Commandant de Compagnie', 'Chef de Brigade'],
    },
    {
      id: 'GN_MARITIME', name: 'Groupement de Gendarmerie Maritime', shortName: 'GGM',
      description: 'Surveillance maritime, zones côtières, pêche illégale',
      roles: ['Officier de Gendarmerie Maritime', 'Brigadier Maritime', 'Patrouilleur'],
    },
    {
      id: 'EM', name: 'Escadron Mobile', shortName: 'EM',
      description: 'Maintien de l\'ordre, opérations de grande envergure',
      roles: ['Commandant d\'Escadron', 'Officier de Peloton', 'Gendarme Mobile'],
    },
    {
      id: 'SR', name: 'Section de Recherches', shortName: 'SR',
      description: 'Enquêtes judiciaires complexes, crimes organisés',
      roles: ['Commandant de Section de Recherches', 'Enquêteur SR', 'Technicien de Police Scientifique'],
    },
    {
      id: 'BR', name: 'Brigade de Recherches', shortName: 'BR',
      description: 'Investigations locales, enquêtes préliminaires',
      roles: ['Commandant de Brigade de Recherches', 'Enquêteur BR'],
    },
    {
      id: 'PM', name: 'Police Militaire', shortName: 'PM',
      description: 'Police des armées, discipline militaire',
      roles: ['Officier PM', 'Agent PM'],
    },
    {
      id: 'GIGN_GN', name: 'Groupe d\'Intervention de la Gendarmerie', shortName: 'GIG',
      description: 'Opérations spéciales, prise d\'otages, cibles dangereuses',
      roles: ['Commandant GIG', 'Opérateur d\'Intervention', 'Négociateur'],
    },
    {
      id: 'GN_AIR', name: 'Gendarmerie de l\'Air', shortName: 'GA',
      description: 'Sécurité des bases aériennes et installations militaires',
      roles: ['Officier Gendarmerie Air', 'Agent Sécurité Base'],
    },
  ],

  DOUANE: [
    {
      id: 'DED', name: 'Direction des Enquêtes Douanières', shortName: 'DED',
      description: 'Investigations, fraudes douanières, faux en écriture',
      roles: ['Chef des Enquêtes', 'Inspecteur Enquêteur', 'Analyste Fraude'],
    },
    {
      id: 'DSF', name: 'Direction des Services aux Frontières', shortName: 'DSF',
      description: 'Contrôle aux postes frontières terrestres, maritimes, aériens',
      roles: ['Chef de Poste Frontière', 'Contrôleur Frontière', 'Agent de Visite'],
    },
    {
      id: 'BM_DOUAN', name: 'Brigade Mobile Douanière', shortName: 'BMD',
      description: 'Contrôles mobiles sur le territoire national',
      roles: ['Chef de Brigade Mobile', 'Agent Brigade Mobile'],
    },
    {
      id: 'SRD', name: 'Service du Renseignement Douanier', shortName: 'SRD',
      description: 'Renseignement économique, profilage des opérateurs',
      roles: ['Analyste Renseignement', 'Chef de Cellule Renseignement'],
    },
    {
      id: 'DVNI', name: 'Direction de la Valeur et des Normes', shortName: 'DVN',
      description: 'Contrôle de la valeur en douane, normes et conformité',
      roles: ['Inspecteur de la Valeur', 'Vérificateur'],
    },
    {
      id: 'DAE', name: 'Direction des Affaires Économiques', shortName: 'DAE',
      description: 'Régimes économiques suspensifs, entrepôts, zones franches',
      roles: ['Gestionnaire Régimes Économiques', 'Vérificateur DAE'],
    },
    {
      id: 'POST_FRONT', name: 'Postes Frontaliers', shortName: 'PF',
      description: 'Pamelap, Koundara, Moribaya, Niandankoro, Gbalatouo, Lélouma',
      roles: ['Receveur de Poste', 'Agent de Poste', 'Visiteur'],
    },
  ],

  SECURITE_ETAT: [
    {
      id: 'SRIE', name: 'Service du Renseignement Intérieur et Extérieur', shortName: 'SRIE',
      description: 'Collecte et analyse du renseignement stratégique',
      roles: ['Officier de Renseignement', 'Analyste Stratégique', 'Chef de Cellule'],
    },
    {
      id: 'SCE', name: 'Service du Contre-Espionnage', shortName: 'SCE',
      description: 'Protection contre les activités d\'espionnage étranger',
      roles: ['Officier Contre-Espionnage', 'Analyste CE', 'Agent de Surveillance'],
    },
    {
      id: 'SPHP', name: 'Service de Protection des Hautes Personnalités', shortName: 'SPHP',
      description: 'Protection rapprochée des personnalités de l\'État',
      roles: ['Agent de Protection Rapprochée', 'Chef d\'Équipe Protection', 'Coordinateur de Sécurité'],
    },
    {
      id: 'SSC', name: 'Service de Surveillance des Communications', shortName: 'SSC',
      description: 'Interception légale, analyse des communications suspectes',
      roles: ['Technicien SIGINT', 'Analyste Communications', 'Officier Technique'],
    },
    {
      id: 'SRI', name: 'Service de Recherche et d\'Investigation', shortName: 'SRI',
      description: 'Investigations spéciales, terrorisme, subversion',
      roles: ['Investigateur Spécial', 'Chef de Groupe SRI', 'Agent d\'Investigation'],
    },
    {
      id: 'SATM', name: 'Service Anti-Terrorisme et Menaces', shortName: 'SATM',
      description: 'Prévention et lutte contre le terrorisme et extrémisme',
      roles: ['Analyste Terrorisme', 'Officier AT', 'Coordinateur Menaces'],
    },
  ],

  GARDE_REPUBLICAINE: [
    {
      id: 'BP', name: 'Bataillon de la Présidence', shortName: 'BP',
      description: 'Protection du Palais Présidentiel et du Chef de l\'État',
      roles: ['Commandant de Bataillon', 'Officier de Garde', 'Garde Présidentiel'],
    },
    {
      id: 'EP', name: 'Escorte Présidentielle', shortName: 'EP',
      description: 'Escorte et convois officiels du Président',
      roles: ['Chef d\'Escorte', 'Motard d\'Escorte', 'Agent d\'Escorte'],
    },
    {
      id: 'GI', name: 'Garde des Institutions', shortName: 'GI',
      description: 'Protection de l\'Assemblée Nationale, Primature, ministères',
      roles: ['Commandant de Garde', 'Officier de Piquet', 'Garde Institutionnel'],
    },
    {
      id: 'FN', name: 'Fanfare Nationale', shortName: 'FN',
      description: 'Cérémonies officielles, représentation protocolaire',
      roles: ['Chef de Musique', 'Musicien Militaire'],
    },
    {
      id: 'GR_SPEC', name: 'Unité Spéciale de Réaction', shortName: 'USR',
      description: 'Interventions d\'urgence, protection rapprochée VIP',
      roles: ['Commandant USR', 'Opérateur Spécial', 'Tireur d\'Élite'],
    },
  ],

  EAUX_FORETS: [
    {
      id: 'BF', name: 'Brigade Forestière Nationale', shortName: 'BFN',
      description: 'Surveillance des massifs forestiers, contrôle exploitation',
      roles: ['Commandant de Brigade', 'Agent Forestier', 'Patrouilleur Forestier'],
    },
    {
      id: 'SF', name: 'Service de la Faune', shortName: 'SF',
      description: 'Protection de la faune sauvage, lutte anti-braconnage',
      roles: ['Inspecteur Faune', 'Agent Anti-Braconnage', 'Coordinateur Faune'],
    },
    {
      id: 'SAP', name: 'Service des Aires Protégées', shortName: 'SAP',
      description: 'Gestion parcs nationaux (Haut Niger, Mont Nimba, Badiar)',
      roles: ['Conservateur de Parc', 'Ranger', 'Écoguide'],
    },
    {
      id: 'BAB', name: 'Brigade Anti-Braconnage', shortName: 'BAB',
      description: 'Opérations anti-braconnage, saisies, contrôle CITES',
      roles: ['Chef de Brigade AB', 'Agent AB', 'Vétérinaire Faune'],
    },
    {
      id: 'SPC', name: 'Service de la Pêche Continentale', shortName: 'SPC',
      description: 'Contrôle pêche illégale rivières et lacs, quotas',
      roles: ['Inspecteur Pêche', 'Agent de Contrôle Pêche'],
    },
    {
      id: 'DCF', name: 'Direction du Contrôle Forestier', shortName: 'DCF',
      description: 'Autorisation d\'exploitation, contrôle des grumiers, scieries',
      roles: ['Inspecteur Forestier', 'Contrôleur Exploitation', 'Vérificateur Bois'],
    },
  ],
}

// ─── Types d'affaires par corps ──────────────────────────────
export const CASE_TYPES: Record<CorpsId, { id: string; label: string; icon: string }[]> = {
  POLICE: [
    { id: 'CRIME_SANG', label: 'Crime de sang', icon: '🔴' },
    { id: 'TRAFIC_DROGUE', label: 'Trafic de drogue', icon: '💊' },
    { id: 'VOL_QUALIFIE', label: 'Vol qualifié / Braquage', icon: '🔫' },
    { id: 'CRIME_ORGANISE', label: 'Crime organisé', icon: '🕸️' },
    { id: 'FRAUDE_FINANCIERE', label: 'Fraude financière', icon: '💰' },
    { id: 'CYBERCRIMINALITE', label: 'Cybercriminalité', icon: '💻' },
    { id: 'TERRORISME', label: 'Terrorisme', icon: '💣' },
    { id: 'TRAITE_PERSONNES', label: 'Traite de personnes', icon: '🚫' },
    { id: 'VIOLENCE_GBV', label: 'Violences basées sur le genre', icon: '⚠️' },
    { id: 'HOMICIDE', label: 'Homicide / Meurtre', icon: '⚰️' },
    { id: 'IMMIGRATION_ILLEGALE', label: 'Immigration irrégulière', icon: '🛂' },
    { id: 'AUTRE_POLICE', label: 'Autre infraction pénale', icon: '📋' },
  ],
  GENDARMERIE: [
    { id: 'CRIME_RURAL', label: 'Crime en zone rurale', icon: '🌾' },
    { id: 'BANDITISME', label: 'Banditisme / Grand banditisme', icon: '🔫' },
    { id: 'TRAFIC_BÉTAIL', label: 'Trafic de bétail', icon: '🐄' },
    { id: 'ENLÈVEMENT', label: 'Enlèvement / Séquestration', icon: '⛓️' },
    { id: 'MINES_ILLEGAL', label: 'Exploitation minière illégale', icon: '⛏️' },
    { id: 'RÉBELLION', label: 'Rébellion / Troubles à l\'ordre', icon: '🚨' },
    { id: 'ACCIDENT_CORPOREL', label: 'Accident corporel grave', icon: '🚗' },
    { id: 'FAUX_USAGE', label: 'Faux et usage de faux', icon: '📝' },
    { id: 'CRIME_MINIER', label: 'Crime lié aux ressources minières', icon: '💎' },
    { id: 'TERRORISME_GN', label: 'Menace terroriste', icon: '💣' },
    { id: 'AUTRE_GN', label: 'Autre infraction', icon: '📋' },
  ],
  DOUANE: [
    { id: 'CONTREBANDE', label: 'Contrebande', icon: '📦' },
    { id: 'FRAUDE_VALEUR', label: 'Fraude sur la valeur', icon: '💱' },
    { id: 'FAUX_ORIGINE', label: 'Fausse déclaration d\'origine', icon: '🏷️' },
    { id: 'TRAFIC_DROGUE_D', label: 'Trafic de stupéfiants', icon: '💊' },
    { id: 'TRAFIC_ARMES', label: 'Trafic d\'armes', icon: '🔫' },
    { id: 'BLANCHIMENT', label: 'Blanchiment de capitaux', icon: '💰' },
    { id: 'TRAFIC_FAUNE', label: 'Trafic faune sauvage (CITES)', icon: '🦁' },
    { id: 'FAUX_DOC_DOUANE', label: 'Faux documents douaniers', icon: '📄' },
    { id: 'FRAUDE_FISCALE', label: 'Fraude fiscale / TVA', icon: '🧾' },
    { id: 'MARCHANDISES_PROHIBEES', label: 'Marchandises prohibées', icon: '🚫' },
    { id: 'AUTRE_DOUANE', label: 'Autre infraction douanière', icon: '📋' },
  ],
  SECURITE_ETAT: [
    { id: 'ESPIONNAGE', label: 'Espionnage / Trahison', icon: '🕵️' },
    { id: 'SUBVERSION', label: 'Subversion / Déstabilisation', icon: '🔥' },
    { id: 'TERRORISME_DGSE', label: 'Terrorisme / Extrémisme', icon: '💣' },
    { id: 'INFILTRATION', label: 'Infiltration organisation hostile', icon: '🎭' },
    { id: 'ATTEINTE_SUR', label: 'Atteinte à la sûreté de l\'État', icon: '🏛️' },
    { id: 'CYBER_DGSE', label: 'Cyberattaque / Guerre hybride', icon: '💻' },
    { id: 'FINANCEMENT_ILLEGAL', label: 'Financement illégal politique', icon: '💰' },
    { id: 'COMPLOT', label: 'Complot / Tentative de coup d\'État', icon: '⚔️' },
    { id: 'AUTRE_DGSE', label: 'Autre menace sécuritaire', icon: '🔐' },
  ],
  GARDE_REPUBLICAINE: [
    { id: 'MENACE_VIP', label: 'Menace contre personnalité', icon: '🎯' },
    { id: 'INTRUSION', label: 'Intrusion site protégé', icon: '🚧' },
    { id: 'ATTENTAT_PROT', label: 'Tentative d\'attentat', icon: '💣' },
    { id: 'FUITE_SECURITE', label: 'Fuite / Défaillance sécurité', icon: '⚠️' },
    { id: 'ESCORTE_INCIDENT', label: 'Incident lors d\'escorte', icon: '🚨' },
    { id: 'AUTRE_GR', label: 'Autre incident sécuritaire', icon: '📋' },
  ],
  EAUX_FORETS: [
    { id: 'BRACONNAGE', label: 'Braconnage / Chasse illégale', icon: '🦁' },
    { id: 'DEFORESTATION', label: 'Déforestation illégale', icon: '🌳' },
    { id: 'TRAFIC_BOIS', label: 'Trafic de bois précieux', icon: '🪵' },
    { id: 'TRAFIC_FAUNE_EF', label: 'Trafic faune protégée (CITES)', icon: '🐘' },
    { id: 'PECHE_ILLEGALE', label: 'Pêche illégale', icon: '🐟' },
    { id: 'INCENDIE_FORET', label: 'Incendie de forêt criminel', icon: '🔥' },
    { id: 'POLLUTION', label: 'Pollution / Déversement illégal', icon: '☠️' },
    { id: 'MINE_FORET', label: 'Mine illégale en zone forestière', icon: '⛏️' },
    { id: 'EXPLOITATION_ILLEGALE', label: 'Exploitation sans permis', icon: '🚫' },
    { id: 'AUTRE_EF', label: 'Autre infraction environnementale', icon: '📋' },
  ],
}

// ─── Procédures légales par corps ───────────────────────────
export const PROCEDURES: Record<CorpsId, { id: string; label: string }[]> = {
  POLICE: [
    { id: 'GAV', label: 'Garde à Vue (GAV)' },
    { id: 'ENQUETE_PRELI', label: 'Enquête Préliminaire' },
    { id: 'FLAGRANCE', label: 'Enquête de Flagrance' },
    { id: 'COMM_ROGATOIRE', label: 'Commission Rogatoire' },
    { id: 'PERQUISITION', label: 'Perquisition' },
    { id: 'SAISIE', label: 'Saisie' },
    { id: 'PV_AUDITION', label: 'PV d\'Audition' },
    { id: 'DEFÉREMENT', label: 'Déférement au Parquet' },
    { id: 'INTERPELLATION', label: 'Interpellation' },
    { id: 'CONVOCATION', label: 'Convocation' },
  ],
  GENDARMERIE: [
    { id: 'GAV_GN', label: 'Garde à Vue (GAV)' },
    { id: 'ENQUETE_PRELI_GN', label: 'Enquête Préliminaire' },
    { id: 'FLAGRANCE_GN', label: 'Enquête de Flagrance' },
    { id: 'REQU_JUDICIAIRE', label: 'Réquisition Judiciaire' },
    { id: 'PV_CONSTAT', label: 'PV de Constat' },
    { id: 'PV_AUDITION_GN', label: 'PV d\'Audition' },
    { id: 'COMMISSION_ROGATOIRE', label: 'Commission Rogatoire' },
    { id: 'DEFÉREMENT_GN', label: 'Déférement au Parquet Militaire' },
    { id: 'SAISIE_GN', label: 'Saisie et Scellés' },
  ],
  DOUANE: [
    { id: 'PV_SAISIE', label: 'PV de Saisie Douanière' },
    { id: 'RETENUE_DOUANE', label: 'Retenue Douanière (72h)' },
    { id: 'TRANSACTION', label: 'Transaction Douanière' },
    { id: 'AMENDE', label: 'Mise en demeure / Amende' },
    { id: 'CONTENTIEUX', label: 'Contentieux Douanier' },
    { id: 'CONFISCATION', label: 'Confiscation de Marchandises' },
    { id: 'PLAINTE_PARQUET', label: 'Plainte au Parquet' },
    { id: 'EXPERTISE', label: 'Expertise / Contre-expertise' },
  ],
  SECURITE_ETAT: [
    { id: 'SURVEILLANCE', label: 'Mise sous Surveillance' },
    { id: 'INTERCEPTION', label: 'Interception de Communications' },
    { id: 'INFILTRATION_OP', label: 'Opération d\'Infiltration' },
    { id: 'RAPPORT_CLASSE', label: 'Rapport Classifié' },
    { id: 'ARRESTATION_SE', label: 'Arrestation Administrative' },
    { id: 'SAISINE_PROC', label: 'Saisine du Procureur' },
  ],
  GARDE_REPUBLICAINE: [
    { id: 'ALERTE_SECU', label: 'Alerte Sécuritaire' },
    { id: 'RAPPORT_INCIDENT', label: 'Rapport d\'Incident' },
    { id: 'INTERPELL_GR', label: 'Interpellation' },
    { id: 'REMISE_JUSTICE', label: 'Remise à la Justice' },
  ],
  EAUX_FORETS: [
    { id: 'PV_INFRACTION', label: 'PV d\'Infraction Forestière' },
    { id: 'SAISIE_EF', label: 'Saisie (Armes, Bois, Animaux)' },
    { id: 'AMENDE_EF', label: 'Amende Administrative' },
    { id: 'TRANSACTION_EF', label: 'Transaction Forestière' },
    { id: 'PLAINTE_PARQUET_EF', label: 'Plainte au Parquet' },
    { id: 'RAPPORT_CITES', label: 'Rapport CITES / Faune' },
    { id: 'EXPERTISE_EF', label: 'Expertise Forestière' },
  ],
}

// ─── Espèces CITES protégées en Guinée (Eaux et Forêts) ─────
export const ESPECES_CITES = [
  'Chimpanzé commun (Pan troglodytes)', 'Gorille occidental (Gorilla gorilla)',
  'Éléphant de forêt (Loxodonta cyclotis)', 'Hippopotame (Hippopotamus amphibius)',
  'Léopard (Panthera pardus)', 'Lion (Panthera leo)',
  'Pangolin géant (Smutsia gigantea)', 'Pangolin à longue queue',
  'Crocodile du Nil (Crocodylus niloticus)', 'Crocodile nain (Osteolaemus tetraspis)',
  'Perroquet gris du Gabon (Psittacus erithacus)', 'Calao à casque jaune',
  'Tortue luth (Dermochelys coriacea)', 'Manatée (Trichechus senegalensis)',
  'Lamantin africain', 'Bois de rose (Dalbergia spp.)',
  'Wengé (Millettia laurentii)', 'Iroko (Milicia excelsa)',
  'Teck de Guinée', 'Autre espèce CITES',
]

// ─── Aires protégées de Guinée ──────────────────────────────
export const AIRES_PROTEGEES = [
  'Parc National du Haut Niger', 'Parc National du Badiar',
  'Réserve Naturelle de Kankan', 'Réserve Naturelle Intégrale du Mont Nimba',
  'Réserve de la Biosphère du Massif du Ziama',
  'Forêt Classée de Diécké', 'Forêt Classée de Pic de Fon',
  'Forêt Classée de Kapé', 'Zone Côtière de Conakry',
  'Réserve de Faune de Kounounkan', 'Réserve Naturelle de Saréboïdo',
]

// ─── Postes frontaliers de Guinée ───────────────────────────
export const POSTES_FRONTALIERS = [
  // Guinée-Bissau
  { nom: 'Pamelap', pays: 'Guinée-Bissau', type: 'Terrestre' },
  { nom: 'Pitche', pays: 'Guinée-Bissau', type: 'Terrestre' },
  // Sénégal
  { nom: 'Koundara', pays: 'Sénégal', type: 'Terrestre' },
  { nom: 'Médina Gonassé', pays: 'Sénégal', type: 'Terrestre' },
  // Mali
  { nom: 'Niandankoro', pays: 'Mali', type: 'Terrestre' },
  { nom: 'Kouroussala', pays: 'Mali', type: 'Terrestre' },
  // Côte d'Ivoire
  { nom: 'Gbalatouo', pays: 'Côte d\'Ivoire', type: 'Terrestre' },
  { nom: 'Lola/Danané', pays: 'Côte d\'Ivoire', type: 'Terrestre' },
  // Liberia
  { nom: 'Nzérékoré/Ganta', pays: 'Liberia', type: 'Terrestre' },
  { nom: 'Macenta/Voinjama', pays: 'Liberia', type: 'Terrestre' },
  // Sierra Leone
  { nom: 'Forecariah/Kambia', pays: 'Sierra Leone', type: 'Terrestre' },
  { nom: 'Kindia/Bumban', pays: 'Sierra Leone', type: 'Terrestre' },
  // Maritime/Aérien
  { nom: 'Port de Conakry', pays: 'Maritime', type: 'Maritime' },
  { nom: 'Port de Kamsar', pays: 'Maritime', type: 'Maritime' },
  { nom: 'Aéroport International Ahmed Sékou Touré', pays: 'Aérien', type: 'Aérien' },
  { nom: 'Moribaya', pays: 'Sierra Leone', type: 'Terrestre' },
]

// ─── Niveaux de classification (DGSE) ───────────────────────
export const NIVEAUX_CLASSIFICATION = [
  { id: 'NON_CLASS', label: 'Non Classifié', color: '#64748b' },
  { id: 'DIFF_REST', label: 'Diffusion Restreinte', color: '#3b82f6' },
  { id: 'CONFIDENTIEL', label: 'Confidentiel Défense', color: '#f59e0b' },
  { id: 'SECRET', label: 'Secret Défense', color: '#ef4444' },
  { id: 'TRES_SECRET', label: 'Très Secret Défense', color: '#7c3aed' },
]

// ─── Fiabilité des sources (DGSE — Échelle OTAN) ─────────────
export const FIABILITE_SOURCE = [
  { code: 'A', label: 'A — Complètement fiable' },
  { code: 'B', label: 'B — Habituellement fiable' },
  { code: 'C', label: 'C — Assez fiable' },
  { code: 'D', label: 'D — Pas toujours fiable' },
  { code: 'E', label: 'E — Non fiable' },
  { code: 'F', label: 'F — Fiabilité non évaluable' },
]

export const CREDIBILITE_INFO = [
  { code: '1', label: '1 — Confirmé par d\'autres sources' },
  { code: '2', label: '2 — Probablement vrai' },
  { code: '3', label: '3 — Possiblement vrai' },
  { code: '4', label: '4 — Douteux' },
  { code: '5', label: '5 — Improbable' },
  { code: '6', label: '6 — Vérité non évaluable' },
]

// ─── Parquets et Tribunaux de Guinée ────────────────────────
export const JURIDICTIONS = [
  'Tribunal de Première Instance de Conakry (Kaloum)',
  'Tribunal de Première Instance de Conakry (Matam)',
  'Tribunal de Première Instance de Conakry (Ratoma)',
  'Tribunal de Première Instance de Kindia',
  'Tribunal de Première Instance de Labé',
  'Tribunal de Première Instance de Kankan',
  'Tribunal de Première Instance de Faranah',
  'Tribunal de Première Instance de Mamou',
  'Tribunal de Première Instance de Boké',
  'Tribunal de Première Instance de Nzérékoré',
  'Tribunal de Première Instance de Siguiri',
  'Tribunal de Première Instance de Guéckédou',
  'Cour d\'Appel de Conakry',
  'Cour Suprême de Guinée',
  'Tribunal Militaire de Conakry',
  'Cour de Répression des Infractions Économiques et Financières (CRIEF)',
]

// ─── Opérateurs téléphoniques en Guinée ─────────────────────
export const OPERATEURS_GN = [
  'Orange Guinée', 'MTN Guinée', 'Cellcom Guinée',
  'Intercel Guinée', 'Skyvision', 'Autre',
]

// ─── Banques et institutions financières en Guinée ──────────
export const BANQUES_GN = [
  'Banque Centrale de la République de Guinée (BCRG)',
  'Ecobank Guinée', 'UBA Guinée', 'BICIGUI',
  'Banque de Crédit International (BCI)',
  'Société Générale de Banques en Guinée (SGBG)',
  'Banque Islamique de Guinée (BIG)',
  'ORABANK Guinée', 'Coris Bank Guinée',
  'Banque Sahélo-Saharienne (BSIC)',
  'Orange Money Guinée', 'MTN Money Guinée',
  'Wave', 'Autre institution',
]

// ─── Corps config enrichi (couleurs, labels) ─────────────────
export const CORPS_FULL_CONFIG: Record<CorpsId, {
  name: string
  shortName: string
  ministry: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  bgDark: string
  borderColor: string
  textColor: string
  badgeBg: string
}> = {
  POLICE: {
    name: 'Police Nationale de Guinée',
    shortName: 'PNG',
    ministry: 'Ministère de la Sécurité et de la Protection Civile',
    primaryColor: '#1d4ed8',
    secondaryColor: '#FCD116',
    accentColor: '#60a5fa',
    bgDark: 'rgba(29,78,216,0.12)',
    borderColor: 'rgba(29,78,216,0.40)',
    textColor: '#93c5fd',
    badgeBg: 'rgba(29,78,216,0.20)',
  },
  GENDARMERIE: {
    name: 'Gendarmerie Nationale de Guinée',
    shortName: 'GNG',
    ministry: 'Ministère de la Défense Nationale',
    primaryColor: '#15803d',
    secondaryColor: '#FCD116',
    accentColor: '#4ade80',
    bgDark: 'rgba(21,128,61,0.12)',
    borderColor: 'rgba(21,128,61,0.40)',
    textColor: '#86efac',
    badgeBg: 'rgba(21,128,61,0.20)',
  },
  DOUANE: {
    name: 'Douanes Nationales de Guinée',
    shortName: 'DNG',
    ministry: 'Ministère du Budget et des Finances',
    primaryColor: '#b45309',
    secondaryColor: '#FCD116',
    accentColor: '#fcd34d',
    bgDark: 'rgba(180,83,9,0.12)',
    borderColor: 'rgba(180,83,9,0.40)',
    textColor: '#fcd34d',
    badgeBg: 'rgba(180,83,9,0.20)',
  },
  SECURITE_ETAT: {
    name: "Direction Générale de la Sécurité d'État",
    shortName: 'DGSE',
    ministry: 'Présidence de la République',
    primaryColor: '#6d28d9',
    secondaryColor: '#FCD116',
    accentColor: '#c084fc',
    bgDark: 'rgba(109,40,217,0.12)',
    borderColor: 'rgba(109,40,217,0.40)',
    textColor: '#c084fc',
    badgeBg: 'rgba(109,40,217,0.20)',
  },
  GARDE_REPUBLICAINE: {
    name: 'Garde Républicaine de Guinée',
    shortName: 'GRG',
    ministry: 'Présidence de la République',
    primaryColor: '#b91c1c',
    secondaryColor: '#FCD116',
    accentColor: '#f87171',
    bgDark: 'rgba(185,28,28,0.12)',
    borderColor: 'rgba(185,28,28,0.40)',
    textColor: '#fca5a5',
    badgeBg: 'rgba(185,28,28,0.20)',
  },
  EAUX_FORETS: {
    name: 'Direction Nationale des Eaux et Forêts',
    shortName: 'DNEF',
    ministry: "Ministère de l'Environnement et des Eaux et Forêts",
    primaryColor: '#065f46',
    secondaryColor: '#FCD116',
    accentColor: '#34d399',
    bgDark: 'rgba(6,95,70,0.12)',
    borderColor: 'rgba(6,95,70,0.40)',
    textColor: '#6ee7b7',
    badgeBg: 'rgba(6,95,70,0.20)',
  },
}
