// permissions.ts — Role-Based Access Control (RBAC) for Guinea Investigation System
import type { UserRole, Corps } from '../types';

// ─── Permission definitions ──────────────────────────────────────────────────
export type Permission =
  | 'case:create'
  | 'case:read'
  | 'case:update'        // edit existing case metadata
  | 'case:delete'
  | 'case:close'
  | 'node:create'        // add entities to canvas
  | 'node:read'
  | 'node:update'        // edit entity fields (locked for OFFICIER after submission)
  | 'node:delete'
  | 'edge:create'
  | 'edge:update'
  | 'edge:delete'
  | 'report:export'
  | 'admin:users'        // manage user accounts
  | 'admin:corps'        // manage corps-level settings
  | 'data:classify'      // set/change classification level (DGSE)
  | 'data:declassify';

// ─── Role → Permissions map ──────────────────────────────────────────────────
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    'case:create','case:read','case:update','case:delete','case:close',
    'node:create','node:read','node:update','node:delete',
    'edge:create','edge:update','edge:delete',
    'report:export','admin:users','admin:corps','data:classify','data:declassify',
  ],
  DIRECTEUR: [
    'case:create','case:read','case:update','case:delete','case:close',
    'node:create','node:read','node:update','node:delete',
    'edge:create','edge:update','edge:delete',
    'report:export','data:classify','data:declassify',
  ],
  COMMANDANT: [
    'case:create','case:read','case:update','case:close',
    'node:create','node:read','node:update','node:delete',
    'edge:create','edge:update','edge:delete',
    'report:export','data:classify',
  ],
  OFFICIER: [
    // Can CREATE new cases and entities, but cannot MODIFY submitted data
    'case:create','case:read',
    'node:create','node:read',
    'edge:create',
    'report:export',
  ],
  ANALYSTE: [
    'case:read','node:read','report:export',
  ],
  // Legacy aliases
  INVESTIGATOR: [
    'case:create','case:read','case:update',
    'node:create','node:read','node:update',
    'edge:create','edge:update',
    'report:export',
  ],
  ANALYST: [
    'case:read','node:read','report:export',
  ],
};

// ─── Permission checker ──────────────────────────────────────────────────────
export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canEdit(role: UserRole | undefined): boolean {
  return hasPermission(role, 'node:update');
}

export function canCreate(role: UserRole | undefined): boolean {
  return hasPermission(role, 'node:create');
}

export function canDelete(role: UserRole | undefined): boolean {
  return hasPermission(role, 'node:delete');
}

export function canManageUsers(role: UserRole | undefined): boolean {
  return hasPermission(role, 'admin:users');
}

export function canClassify(role: UserRole | undefined): boolean {
  return hasPermission(role, 'data:classify');
}

export function isReadOnly(role: UserRole | undefined): boolean {
  return !canEdit(role) && !canCreate(role);
}

// ─── Role metadata ───────────────────────────────────────────────────────────
export const ROLE_META: Record<UserRole, {
  label: string;
  labelFr: string;
  color: string;
  badgeBg: string;
  description: string;
  level: number; // hierarchy level (higher = more authority)
}> = {
  ADMIN: {
    label: 'Administrateur',
    labelFr: 'Administrateur Système',
    color: '#f43f5e',
    badgeBg: 'rgba(244,63,94,0.15)',
    description: 'Accès total au système — gestion des utilisateurs et des données',
    level: 5,
  },
  DIRECTEUR: {
    label: 'Directeur',
    labelFr: 'Directeur Général',
    color: '#8b5cf6',
    badgeBg: 'rgba(139,92,246,0.15)',
    description: 'Accès complet au sein du corps — validation finale des enquêtes',
    level: 4,
  },
  COMMANDANT: {
    label: 'Commandant',
    labelFr: 'Officier Commandant',
    color: '#f59e0b',
    badgeBg: 'rgba(245,158,11,0.15)',
    description: 'Peut modifier et valider les données des enquêteurs',
    level: 3,
  },
  OFFICIER: {
    label: 'Officier',
    labelFr: 'Officier Enquêteur',
    color: '#3b82f6',
    badgeBg: 'rgba(59,130,246,0.15)',
    description: 'Peut créer des enquêtes et saisir des données — lecture seule après soumission',
    level: 2,
  },
  ANALYSTE: {
    label: 'Analyste',
    labelFr: 'Analyste de Renseignement',
    color: '#10b981',
    badgeBg: 'rgba(16,185,129,0.15)',
    description: 'Lecture seule — consultation et export des rapports',
    level: 1,
  },
  INVESTIGATOR: {
    label: 'Investigateur',
    labelFr: 'Investigateur',
    color: '#3b82f6',
    badgeBg: 'rgba(59,130,246,0.15)',
    description: 'Peut créer et modifier des enquêtes',
    level: 2,
  },
  ANALYST: {
    label: 'Analyste',
    labelFr: 'Analyste',
    color: '#10b981',
    badgeBg: 'rgba(16,185,129,0.15)',
    description: 'Lecture seule',
    level: 1,
  },
};

// ─── Role badge component helper ─────────────────────────────────────────────
export function getRoleBadgeStyle(role: UserRole): { background: string; color: string; border: string } {
  const meta = ROLE_META[role];
  return {
    background: meta?.badgeBg || 'rgba(100,116,139,0.15)',
    color: meta?.color || '#94a3b8',
    border: `1px solid ${meta?.color || '#475569'}44`,
  };
}
