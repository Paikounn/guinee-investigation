// ─── i18n Translation System ──────────────────────────────────────────────────
// Bilingual support: French (fr) and English (en)

export type Language = 'fr' | 'en'

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
]

export const translations = {
  fr: {
    // ── App / Branding ──────────────────────────────────────────────────────
    appName: "Système d'Investigation",
    appSubtitle: 'République de Guinée',
    appDescription: 'Plateforme nationale de gestion des enquêtes criminelles',

    // ── Navigation ──────────────────────────────────────────────────────────
    nav: {
      dashboard: 'Tableau de bord',
      cases: 'Affaires',
      canvas: 'Cartographie',
      admin: 'Administration',
      settings: 'Paramètres',
      logout: 'Déconnexion',
      profile: 'Mon profil',
    },

    // ── Auth ────────────────────────────────────────────────────────────────
    auth: {
      login: 'Connexion',
      register: 'Inscription',
      email: 'Adresse email',
      password: 'Mot de passe',
      fullName: 'Nom complet',
      corps: "Corps d'appartenance",
      grade: 'Grade',
      matricule: 'Matricule',
      loginBtn: 'Se connecter',
      registerBtn: "S'inscrire",
      loading: 'Chargement…',
      emailPlaceholder: 'ibrahima@securite.gn',
      namePlaceholder: 'Ibrahima Diallo',
      gradePlaceholder: 'Capitaine',
      matriculePlaceholder: 'GN-12345',
      loginTitle: 'Bienvenue',
      loginSubtitle: 'Connectez-vous à votre espace sécurisé',
      registerTitle: 'Créer un compte',
      registerSubtitle: 'Rejoignez la plateforme nationale',
      heroTitle: 'Plateforme Nationale\nd\'Investigation',
      heroSubtitle: 'Un outil moderne et sécurisé pour les forces de sécurité de la République de Guinée.',
      heroFeature1: 'Cartographie des réseaux criminels',
      heroFeature2: 'Collaboration en temps réel',
      heroFeature3: 'Gestion sécurisée des dossiers',
      forgotPassword: 'Mot de passe oublié ?',
      noAccount: "Pas encore de compte ?",
      hasAccount: 'Déjà un compte ?',
    },

    // ── Dashboard ───────────────────────────────────────────────────────────
    dashboard: {
      title: 'Tableau de bord',
      welcome: 'Bienvenue',
      subtitle: 'Vue d\'ensemble de vos activités',
      totalCases: 'Total affaires',
      activeCases: 'Affaires actives',
      closedCases: 'Affaires clôturées',
      totalNodes: 'Entités cartographiées',
      recentCases: 'Affaires récentes',
      quickActions: 'Actions rapides',
      newCase: 'Nouvelle affaire',
      viewAll: 'Voir tout',
      noRecentCases: 'Aucune affaire récente',
      openCase: 'Ouvrir l\'affaire',
      lastUpdated: 'Dernière mise à jour',
    },

    // ── Cases ───────────────────────────────────────────────────────────────
    cases: {
      title: 'Affaires',
      subtitle: 'affaire dans votre corps',
      subtitlePlural: 'affaires dans votre corps',
      newCase: 'Nouvelle affaire',
      searchPlaceholder: 'Rechercher par titre ou référence…',
      allStatuses: 'Tous les statuts',
      noResults: 'Aucune affaire trouvée',
      noResultsHint: 'Essayez de modifier vos filtres',
      noResultsEmpty: 'Créez votre première affaire',
      loading: 'Chargement…',
      nodes: 'nœuds',
      members: 'membre',
      membersPlural: 'membres',
      reference: 'Référence',
      referencePlaceholder: 'AFF-2026-001',
      caseTitle: 'Titre',
      caseTitlePlaceholder: "Intitulé de l'affaire",
      description: 'Description',
      descriptionPlaceholder: "Description de l'affaire…",
      cancel: 'Annuler',
      create: "Créer l'affaire",
      creating: 'Création…',
      newCaseTitle: 'Nouvelle affaire',
      openCanvas: 'Ouvrir la cartographie',
    },

    // ── Canvas ──────────────────────────────────────────────────────────────
    canvas: {
      backToCases: 'Affaires',
      addNode: 'Ajouter un nœud',
      newNode: 'Nouveau',
      nameLabel: 'Nom / identifiant',
      cancel: 'Annuler',
      add: 'Ajouter',
      adding: '…',
      investigators: 'Enquêteurs',
      me: '(moi)',
      connected: 'Connecté en temps réel',
      disconnected: 'Non connecté',
      exportSVG: 'Exporter SVG',
      nodeTypes: {
        PERSON: 'Personne',
        VEHICLE: 'Véhicule',
        ORGANIZATION: 'Organisation',
        LOCATION: 'Lieu',
        CONTAINER: 'Conteneur',
      },
    },

    // ── Node Panel ──────────────────────────────────────────────────────────
    nodePanel: {
      label: 'Label (identifiant)',
      save: 'Sauvegarder',
      saving: 'Sauvegarde…',
      delete: 'Supprimer',
      deleting: '…',
      confirmDelete: 'Supprimer ce nœud et toutes ses connexions ?',
    },

    // ── Admin ───────────────────────────────────────────────────────────────
    admin: {
      title: 'Administration',
      subtitle: 'Gestion de la plateforme',
      users: 'Utilisateurs',
      totalUsers: 'Total utilisateurs',
      byCorps: 'Par corps',
      allCases: 'Toutes les affaires',
      systemStats: 'Statistiques système',
      manageUsers: 'Gérer les utilisateurs',
      manageCases: 'Gérer les affaires',
    },

    // ── Status ──────────────────────────────────────────────────────────────
    status: {
      OPEN: 'Ouvert',
      ACTIVE: 'En cours',
      CLOSED: 'Clôturé',
      ARCHIVED: 'Archivé',
    },

    // ── Corps ───────────────────────────────────────────────────────────────
    corps: {
      POLICE: 'Police Nationale',
      GENDARMERIE: 'Gendarmerie Nationale',
      DOUANE: 'Douane Nationale',
    },

    // ── Roles ───────────────────────────────────────────────────────────────
    roles: {
      ADMIN: 'Administrateur',
      INVESTIGATOR: 'Enquêteur',
      ANALYST: 'Analyste',
    },

    // ── Common ──────────────────────────────────────────────────────────────
    common: {
      required: 'Requis',
      optional: 'Optionnel',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      close: 'Fermer',
      confirm: 'Confirmer',
      loading: 'Chargement…',
      error: 'Erreur',
      success: 'Succès',
      search: 'Rechercher',
      filter: 'Filtrer',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      yes: 'Oui',
      no: 'Non',
      serverError: 'Erreur serveur',
      unknownError: 'Erreur inconnue',
    },

    // ── Footer ──────────────────────────────────────────────────────────────
    footer: {
      copyright: '© 2026 République de Guinée — Tous droits réservés',
      confidential: 'Système confidentiel — Usage officiel uniquement',
    },
  },

  en: {
    // ── App / Branding ──────────────────────────────────────────────────────
    appName: 'Investigation System',
    appSubtitle: 'Republic of Guinea',
    appDescription: 'National criminal investigation management platform',

    // ── Navigation ──────────────────────────────────────────────────────────
    nav: {
      dashboard: 'Dashboard',
      cases: 'Cases',
      canvas: 'Mapping',
      admin: 'Administration',
      settings: 'Settings',
      logout: 'Logout',
      profile: 'My Profile',
    },

    // ── Auth ────────────────────────────────────────────────────────────────
    auth: {
      login: 'Login',
      register: 'Register',
      email: 'Email address',
      password: 'Password',
      fullName: 'Full name',
      corps: 'Security corps',
      grade: 'Rank',
      matricule: 'Badge number',
      loginBtn: 'Sign in',
      registerBtn: 'Create account',
      loading: 'Loading…',
      emailPlaceholder: 'ibrahima@securite.gn',
      namePlaceholder: 'Ibrahima Diallo',
      gradePlaceholder: 'Captain',
      matriculePlaceholder: 'GN-12345',
      loginTitle: 'Welcome back',
      loginSubtitle: 'Sign in to your secure workspace',
      registerTitle: 'Create account',
      registerSubtitle: 'Join the national platform',
      heroTitle: 'National Investigation\nPlatform',
      heroSubtitle: 'A modern, secure tool for the security forces of the Republic of Guinea.',
      heroFeature1: 'Criminal network mapping',
      heroFeature2: 'Real-time collaboration',
      heroFeature3: 'Secure case management',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
    },

    // ── Dashboard ───────────────────────────────────────────────────────────
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome',
      subtitle: 'Overview of your activities',
      totalCases: 'Total cases',
      activeCases: 'Active cases',
      closedCases: 'Closed cases',
      totalNodes: 'Mapped entities',
      recentCases: 'Recent cases',
      quickActions: 'Quick actions',
      newCase: 'New case',
      viewAll: 'View all',
      noRecentCases: 'No recent cases',
      openCase: 'Open case',
      lastUpdated: 'Last updated',
    },

    // ── Cases ───────────────────────────────────────────────────────────────
    cases: {
      title: 'Cases',
      subtitle: 'case in your corps',
      subtitlePlural: 'cases in your corps',
      newCase: 'New case',
      searchPlaceholder: 'Search by title or reference…',
      allStatuses: 'All statuses',
      noResults: 'No cases found',
      noResultsHint: 'Try adjusting your filters',
      noResultsEmpty: 'Create your first case',
      loading: 'Loading…',
      nodes: 'nodes',
      members: 'member',
      membersPlural: 'members',
      reference: 'Reference',
      referencePlaceholder: 'AFF-2026-001',
      caseTitle: 'Title',
      caseTitlePlaceholder: 'Case title',
      description: 'Description',
      descriptionPlaceholder: 'Case description…',
      cancel: 'Cancel',
      create: 'Create case',
      creating: 'Creating…',
      newCaseTitle: 'New case',
      openCanvas: 'Open mapping',
    },

    // ── Canvas ──────────────────────────────────────────────────────────────
    canvas: {
      backToCases: 'Cases',
      addNode: 'Add node',
      newNode: 'New',
      nameLabel: 'Name / identifier',
      cancel: 'Cancel',
      add: 'Add',
      adding: '…',
      investigators: 'Investigators',
      me: '(me)',
      connected: 'Connected in real time',
      disconnected: 'Not connected',
      exportSVG: 'Export SVG',
      nodeTypes: {
        PERSON: 'Person',
        VEHICLE: 'Vehicle',
        ORGANIZATION: 'Organization',
        LOCATION: 'Location',
        CONTAINER: 'Container',
      },
    },

    // ── Node Panel ──────────────────────────────────────────────────────────
    nodePanel: {
      label: 'Label (identifier)',
      save: 'Save',
      saving: 'Saving…',
      delete: 'Delete',
      deleting: '…',
      confirmDelete: 'Delete this node and all its connections?',
    },

    // ── Admin ───────────────────────────────────────────────────────────────
    admin: {
      title: 'Administration',
      subtitle: 'Platform management',
      users: 'Users',
      totalUsers: 'Total users',
      byCorps: 'By corps',
      allCases: 'All cases',
      systemStats: 'System statistics',
      manageUsers: 'Manage users',
      manageCases: 'Manage cases',
    },

    // ── Status ──────────────────────────────────────────────────────────────
    status: {
      OPEN: 'Open',
      ACTIVE: 'Active',
      CLOSED: 'Closed',
      ARCHIVED: 'Archived',
    },

    // ── Corps ───────────────────────────────────────────────────────────────
    corps: {
      POLICE: 'National Police',
      GENDARMERIE: 'National Gendarmerie',
      DOUANE: 'National Customs',
    },

    // ── Roles ───────────────────────────────────────────────────────────────
    roles: {
      ADMIN: 'Administrator',
      INVESTIGATOR: 'Investigator',
      ANALYST: 'Analyst',
    },

    // ── Common ──────────────────────────────────────────────────────────────
    common: {
      required: 'Required',
      optional: 'Optional',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      confirm: 'Confirm',
      loading: 'Loading…',
      error: 'Error',
      success: 'Success',
      search: 'Search',
      filter: 'Filter',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      yes: 'Yes',
      no: 'No',
      serverError: 'Server error',
      unknownError: 'Unknown error',
    },

    // ── Footer ──────────────────────────────────────────────────────────────
    footer: {
      copyright: '© 2026 Republic of Guinea — All rights reserved',
      confidential: 'Confidential system — Official use only',
    },
  },
} as const

export type Translations = typeof translations['fr']
export type TranslationKey = keyof Translations

export const DEFAULT_LANGUAGE: Language = 'fr'
export const STORAGE_KEY = 'guinee-language'

export function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'fr' || stored === 'en') return stored
  } catch {
    // ignore
  }
  return DEFAULT_LANGUAGE
}

export function setStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // ignore
  }
}
