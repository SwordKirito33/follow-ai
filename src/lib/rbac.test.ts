import { describe, it, expect } from 'vitest';
import {
  Role,
  Permission,
  hasPermission,
  userHasPermission,
  getRolePermissions,
  canAccessResource,
  isAdmin,
  isModerator,
  canModerate,
  getRoleLevel,
  isHigherRole,
} from './rbac';

describe('RBAC System', () => {
  describe('hasPermission', () => {
    it('should allow admin all permissions', () => {
      expect(hasPermission(Role.ADMIN, Permission.MANAGE_USERS)).toBe(true);
      expect(hasPermission(Role.ADMIN, Permission.VIEW_TASKS)).toBe(true);
      expect(hasPermission(Role.ADMIN, Permission.DELETE_TASK)).toBe(true);
    });

    it('should allow moderator specific permissions', () => {
      expect(hasPermission(Role.MODERATOR, Permission.APPROVE_REVIEW)).toBe(true);
      expect(hasPermission(Role.MODERATOR, Permission.VIEW_ANALYTICS)).toBe(true);
      expect(hasPermission(Role.MODERATOR, Permission.MANAGE_USERS)).toBe(false);
    });

    it('should allow developer specific permissions', () => {
      expect(hasPermission(Role.DEVELOPER, Permission.SUBMIT_REVIEW)).toBe(true);
      expect(hasPermission(Role.DEVELOPER, Permission.WITHDRAW)).toBe(true);
      expect(hasPermission(Role.DEVELOPER, Permission.APPROVE_REVIEW)).toBe(false);
    });

    it('should allow user basic permissions', () => {
      expect(hasPermission(Role.USER, Permission.VIEW_TASKS)).toBe(true);
      expect(hasPermission(Role.USER, Permission.SUBMIT_REVIEW)).toBe(true);
      expect(hasPermission(Role.USER, Permission.WITHDRAW)).toBe(false);
    });

    it('should allow guest minimal permissions', () => {
      expect(hasPermission(Role.GUEST, Permission.VIEW_TASKS)).toBe(true);
      expect(hasPermission(Role.GUEST, Permission.SUBMIT_REVIEW)).toBe(false);
    });
  });

  describe('userHasPermission', () => {
    it('should check user permission', () => {
      const admin = { role: Role.ADMIN };
      const user = { role: Role.USER };

      expect(userHasPermission(admin, Permission.MANAGE_USERS)).toBe(true);
      expect(userHasPermission(user, Permission.MANAGE_USERS)).toBe(false);
    });
  });

  describe('getRolePermissions', () => {
    it('should return all permissions for admin', () => {
      const permissions = getRolePermissions(Role.ADMIN);
      expect(permissions.length).toBeGreaterThan(10);
    });

    it('should return limited permissions for guest', () => {
      const permissions = getRolePermissions(Role.GUEST);
      expect(permissions.length).toBe(1);
      expect(permissions[0]).toBe(Permission.VIEW_TASKS);
    });
  });

  describe('canAccessResource', () => {
    it('should allow admin to access all resources', () => {
      expect(canAccessResource(Role.ADMIN, 'task', 'view')).toBe(true);
      expect(canAccessResource(Role.ADMIN, 'task', 'create')).toBe(true);
      expect(canAccessResource(Role.ADMIN, 'task', 'delete')).toBe(true);
    });

    it('should restrict user access to resources', () => {
      expect(canAccessResource(Role.USER, 'task', 'view')).toBe(true);
      expect(canAccessResource(Role.USER, 'task', 'create')).toBe(false);
      expect(canAccessResource(Role.USER, 'task', 'delete')).toBe(false);
    });

    it('should restrict guest access', () => {
      expect(canAccessResource(Role.GUEST, 'task', 'view')).toBe(true);
      expect(canAccessResource(Role.GUEST, 'profile', 'view')).toBe(false);
    });
  });

  describe('role checks', () => {
    it('should identify admin', () => {
      expect(isAdmin({ role: Role.ADMIN })).toBe(true);
      expect(isAdmin({ role: Role.USER })).toBe(false);
    });

    it('should identify moderator', () => {
      expect(isModerator({ role: Role.ADMIN })).toBe(true);
      expect(isModerator({ role: Role.MODERATOR })).toBe(true);
      expect(isModerator({ role: Role.USER })).toBe(false);
    });

    it('should check moderation capability', () => {
      expect(canModerate({ role: Role.ADMIN })).toBe(true);
      expect(canModerate({ role: Role.MODERATOR })).toBe(true);
      expect(canModerate({ role: Role.DEVELOPER })).toBe(false);
    });
  });

  describe('role hierarchy', () => {
    it('should return correct role levels', () => {
      expect(getRoleLevel(Role.ADMIN)).toBe(5);
      expect(getRoleLevel(Role.MODERATOR)).toBe(4);
      expect(getRoleLevel(Role.DEVELOPER)).toBe(3);
      expect(getRoleLevel(Role.USER)).toBe(2);
      expect(getRoleLevel(Role.GUEST)).toBe(1);
    });

    it('should compare role levels', () => {
      expect(isHigherRole(Role.ADMIN, Role.USER)).toBe(true);
      expect(isHigherRole(Role.MODERATOR, Role.DEVELOPER)).toBe(true);
      expect(isHigherRole(Role.USER, Role.ADMIN)).toBe(false);
    });
  });
});
