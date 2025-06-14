import { describe, it, expect, beforeEach } from 'vitest';
import { 
  createPermission, 
  canView,
  canEdit,
  canAdmin,
  canDelete,
  canShare,
  canManagePermissions,
  hasPermission,
  getPermissionDisplayName,
  getPermissionDescription,
  isValidPermissionLevel,
  PermissionErrors,
  type Permission,
  type PermissionLevel
} from './permission';
import { isOk, isErr } from '../types/result';

describe('Permission value object', () => {
  const validPermissionParams = {
    level: 'editor' as PermissionLevel,
    vehicleId: 'vehicle-123',
    userId: 'user-123',
    grantedBy: 'user-456',
  };

  describe('isValidPermissionLevel', () => {
    it('should return true for valid permission levels', () => {
      expect(isValidPermissionLevel('viewer')).toBe(true);
      expect(isValidPermissionLevel('editor')).toBe(true);
      expect(isValidPermissionLevel('admin')).toBe(true);
    });

    it('should return false for invalid permission levels', () => {
      expect(isValidPermissionLevel('invalid')).toBe(false);
      expect(isValidPermissionLevel('')).toBe(false);
      expect(isValidPermissionLevel('owner')).toBe(false);
    });
  });

  describe('createPermission', () => {
    it('should create a valid permission', () => {
      const result = createPermission(validPermissionParams);
      
      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value.level).toBe('editor');
        expect(result.value.vehicleId).toBe('vehicle-123');
        expect(result.value.userId).toBe('user-123');
        expect(result.value.grantedBy).toBe('user-456');
        expect(result.value.grantedAt).toBeInstanceOf(Date);
      }
    });

    it('should trim whitespace from string fields', () => {
      const result = createPermission({
        ...validPermissionParams,
        vehicleId: '  vehicle-123  ',
        userId: '  user-123  ',
        grantedBy: '  user-456  ',
      });

      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value.vehicleId).toBe('vehicle-123');
        expect(result.value.userId).toBe('user-123');
        expect(result.value.grantedBy).toBe('user-456');
      }
    });

    it('should use provided timestamp', () => {
      const grantedAt = new Date('2024-01-01');
      
      const result = createPermission({
        ...validPermissionParams,
        grantedAt,
      });

      expect(isOk(result)).toBe(true);
      if (isOk(result)) {
        expect(result.value.grantedAt).toBe(grantedAt);
      }
    });

    it('should fail with invalid permission level', () => {
      const result = createPermission({ 
        ...validPermissionParams, 
        level: 'invalid' as PermissionLevel 
      });
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe(PermissionErrors.InvalidLevel);
      }
    });

    it('should fail with empty vehicleId', () => {
      const result = createPermission({ ...validPermissionParams, vehicleId: '' });
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe(PermissionErrors.InvalidVehicleId);
      }
    });

    it('should fail with empty userId', () => {
      const result = createPermission({ ...validPermissionParams, userId: '' });
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe(PermissionErrors.InvalidUserId);
      }
    });

    it('should fail with empty grantedBy', () => {
      const result = createPermission({ ...validPermissionParams, grantedBy: '' });
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe(PermissionErrors.InvalidGrantedBy);
      }
    });

    it('should fail when trying to grant permission to self', () => {
      const result = createPermission({ 
        ...validPermissionParams, 
        userId: 'user-123',
        grantedBy: 'user-123'
      });
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe(PermissionErrors.CannotGrantToSelf);
      }
    });

    it('should fail when trying to grant permission to self (case insensitive)', () => {
      const result = createPermission({ 
        ...validPermissionParams, 
        userId: '  user-123  ',
        grantedBy: '  user-123  '
      });
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe(PermissionErrors.CannotGrantToSelf);
      }
    });
  });

  describe('Permission checking functions', () => {
    let viewerPermission: Permission;
    let editorPermission: Permission;
    let adminPermission: Permission;

    beforeEach(() => {
      const viewerResult = createPermission({
        ...validPermissionParams,
        level: 'viewer'
      });
      const editorResult = createPermission({
        ...validPermissionParams,
        level: 'editor'
      });
      const adminResult = createPermission({
        ...validPermissionParams,
        level: 'admin'
      });

      if (isOk(viewerResult)) viewerPermission = viewerResult.value;
      if (isOk(editorResult)) editorPermission = editorResult.value;
      if (isOk(adminResult)) adminPermission = adminResult.value;
    });

    describe('canView', () => {
      it('should return true for all permission levels', () => {
        expect(canView(viewerPermission)).toBe(true);
        expect(canView(editorPermission)).toBe(true);
        expect(canView(adminPermission)).toBe(true);
      });
    });

    describe('canEdit', () => {
      it('should return false for viewer', () => {
        expect(canEdit(viewerPermission)).toBe(false);
      });

      it('should return true for editor and admin', () => {
        expect(canEdit(editorPermission)).toBe(true);
        expect(canEdit(adminPermission)).toBe(true);
      });
    });

    describe('canAdmin', () => {
      it('should return false for viewer and editor', () => {
        expect(canAdmin(viewerPermission)).toBe(false);
        expect(canAdmin(editorPermission)).toBe(false);
      });

      it('should return true for admin', () => {
        expect(canAdmin(adminPermission)).toBe(true);
      });
    });

    describe('canDelete', () => {
      it('should return false for viewer and editor', () => {
        expect(canDelete(viewerPermission)).toBe(false);
        expect(canDelete(editorPermission)).toBe(false);
      });

      it('should return true for admin', () => {
        expect(canDelete(adminPermission)).toBe(true);
      });
    });

    describe('canShare', () => {
      it('should return false for viewer and editor', () => {
        expect(canShare(viewerPermission)).toBe(false);
        expect(canShare(editorPermission)).toBe(false);
      });

      it('should return true for admin', () => {
        expect(canShare(adminPermission)).toBe(true);
      });
    });

    describe('canManagePermissions', () => {
      it('should return false for viewer and editor', () => {
        expect(canManagePermissions(viewerPermission)).toBe(false);
        expect(canManagePermissions(editorPermission)).toBe(false);
      });

      it('should return true for admin', () => {
        expect(canManagePermissions(adminPermission)).toBe(true);
      });
    });

    describe('hasPermission', () => {
      it('should work correctly for viewer level', () => {
        expect(hasPermission(viewerPermission, 'viewer')).toBe(true);
        expect(hasPermission(viewerPermission, 'editor')).toBe(false);
        expect(hasPermission(viewerPermission, 'admin')).toBe(false);
      });

      it('should work correctly for editor level', () => {
        expect(hasPermission(editorPermission, 'viewer')).toBe(true);
        expect(hasPermission(editorPermission, 'editor')).toBe(true);
        expect(hasPermission(editorPermission, 'admin')).toBe(false);
      });

      it('should work correctly for admin level', () => {
        expect(hasPermission(adminPermission, 'viewer')).toBe(true);
        expect(hasPermission(adminPermission, 'editor')).toBe(true);
        expect(hasPermission(adminPermission, 'admin')).toBe(true);
      });
    });
  });

  describe('Display name functions', () => {
    describe('getPermissionDisplayName', () => {
      it('should return Japanese names for permission levels', () => {
        expect(getPermissionDisplayName('viewer')).toBe('閲覧者');
        expect(getPermissionDisplayName('editor')).toBe('編集者');
        expect(getPermissionDisplayName('admin')).toBe('管理者');
      });
    });

    describe('getPermissionDescription', () => {
      it('should return descriptions for permission levels', () => {
        expect(getPermissionDescription('viewer')).toBe('データの閲覧のみ可能');
        expect(getPermissionDescription('editor')).toBe('データの追加・編集が可能');
        expect(getPermissionDescription('admin')).toBe('全権限（削除・共有設定変更を含む）');
      });
    });
  });
});