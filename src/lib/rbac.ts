/**
 * Role-Based Access Control (RBAC) System
 */

export enum Role {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  DEVELOPER = 'developer',
  USER = 'user',
  GUEST = 'guest',
}

export enum Permission {
  // User permissions
  VIEW_PROFILE = 'view_profile',
  EDIT_PROFILE = 'edit_profile',
  DELETE_ACCOUNT = 'delete_account',
  
  // Task permissions
  VIEW_TASKS = 'view_tasks',
  CREATE_TASK = 'create_task',
  EDIT_TASK = 'edit_task',
  DELETE_TASK = 'delete_task',
  SUBMIT_REVIEW = 'submit_review',
  
  // Review permissions
  VIEW_REVIEWS = 'view_reviews',
  APPROVE_REVIEW = 'approve_review',
  REJECT_REVIEW = 'reject_review',
  
  // Wallet permissions
  VIEW_WALLET = 'view_wallet',
  WITHDRAW = 'withdraw',
  
  // Admin permissions
  MANAGE_USERS = 'manage_users',
  MANAGE_TASKS = 'manage_tasks',
  MANAGE_REVIEWS = 'manage_reviews',
  VIEW_ANALYTICS = 'view_analytics',
  MANAGE_SETTINGS = 'manage_settings',
}

// Role-Permission mapping
const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    // All permissions
    ...Object.values(Permission),
  ],
  
  [Role.MODERATOR]: [
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_TASKS,
    Permission.EDIT_TASK,
    Permission.VIEW_REVIEWS,
    Permission.APPROVE_REVIEW,
    Permission.REJECT_REVIEW,
    Permission.VIEW_WALLET,
    Permission.VIEW_ANALYTICS,
  ],
  
  [Role.DEVELOPER]: [
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_TASKS,
    Permission.SUBMIT_REVIEW,
    Permission.VIEW_REVIEWS,
    Permission.VIEW_WALLET,
    Permission.WITHDRAW,
  ],
  
  [Role.USER]: [
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_TASKS,
    Permission.SUBMIT_REVIEW,
    Permission.VIEW_REVIEWS,
    Permission.VIEW_WALLET,
  ],
  
  [Role.GUEST]: [
    Permission.VIEW_TASKS,
  ],
};

/**
 * Check if role has permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = rolePermissions[role];
  return permissions.includes(permission);
}

/**
 * Check if user has permission
 */
export function userHasPermission(
  user: { role: Role },
  permission: Permission
): boolean {
  return hasPermission(user.role, permission);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
  return rolePermissions[role];
}

/**
 * Check if role can access resource
 */
export function canAccessResource(
  role: Role,
  resource: string,
  action: 'view' | 'create' | 'edit' | 'delete'
): boolean {
  const permissionMap: Record<string, Record<string, Permission>> = {
    profile: {
      view: Permission.VIEW_PROFILE,
      edit: Permission.EDIT_PROFILE,
      delete: Permission.DELETE_ACCOUNT,
    },
    task: {
      view: Permission.VIEW_TASKS,
      create: Permission.CREATE_TASK,
      edit: Permission.EDIT_TASK,
      delete: Permission.DELETE_TASK,
    },
    review: {
      view: Permission.VIEW_REVIEWS,
      create: Permission.SUBMIT_REVIEW,
      edit: Permission.APPROVE_REVIEW,
      delete: Permission.REJECT_REVIEW,
    },
    wallet: {
      view: Permission.VIEW_WALLET,
      edit: Permission.WITHDRAW,
    },
  };

  const permission = permissionMap[resource]?.[action];
  if (!permission) {
    return false;
  }

  return hasPermission(role, permission);
}

/**
 * Check if user is admin
 */
export function isAdmin(user: { role: Role }): boolean {
  return user.role === Role.ADMIN;
}

/**
 * Check if user is moderator or admin
 */
export function isModerator(user: { role: Role }): boolean {
  return user.role === Role.MODERATOR || user.role === Role.ADMIN;
}

/**
 * Check if user can moderate content
 */
export function canModerate(user: { role: Role }): boolean {
  return hasPermission(user.role, Permission.APPROVE_REVIEW) ||
         hasPermission(user.role, Permission.REJECT_REVIEW);
}

/**
 * Get role hierarchy level
 */
export function getRoleLevel(role: Role): number {
  const levels: Record<Role, number> = {
    [Role.ADMIN]: 5,
    [Role.MODERATOR]: 4,
    [Role.DEVELOPER]: 3,
    [Role.USER]: 2,
    [Role.GUEST]: 1,
  };
  return levels[role];
}

/**
 * Check if role1 is higher than role2
 */
export function isHigherRole(role1: Role, role2: Role): boolean {
  return getRoleLevel(role1) > getRoleLevel(role2);
}
