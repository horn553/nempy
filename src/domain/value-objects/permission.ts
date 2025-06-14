import { Result, Ok, Err } from '../types/result';

export type PermissionLevel = 'viewer' | 'editor' | 'admin';

export interface Permission {
  readonly level: PermissionLevel;
  readonly vehicleId: string;
  readonly userId: string;
  readonly grantedAt: Date;
  readonly grantedBy: string;
}

export interface CreatePermissionParams {
  level: PermissionLevel;
  vehicleId: string;
  userId: string;
  grantedBy: string;
  grantedAt?: Date;
}

export const PermissionErrors = {
  InvalidLevel: '権限レベルが無効です',
  InvalidVehicleId: '車両IDが無効です',
  InvalidUserId: 'ユーザーIDが無効です',
  InvalidGrantedBy: '権限付与者IDが無効です',
  CannotGrantToSelf: '自分自身に権限を付与することはできません',
} as const;

const VALID_PERMISSION_LEVELS: readonly PermissionLevel[] = [
  'viewer',
  'editor',
  'admin'
] as const;

export const isValidPermissionLevel = (value: string): value is PermissionLevel => {
  return VALID_PERMISSION_LEVELS.includes(value as PermissionLevel);
};

export const createPermission = (params: CreatePermissionParams): Result<Permission, string> => {
  if (!isValidPermissionLevel(params.level)) {
    return Err(PermissionErrors.InvalidLevel);
  }

  if (!params.vehicleId || params.vehicleId.trim() === '') {
    return Err(PermissionErrors.InvalidVehicleId);
  }

  if (!params.userId || params.userId.trim() === '') {
    return Err(PermissionErrors.InvalidUserId);
  }

  if (!params.grantedBy || params.grantedBy.trim() === '') {
    return Err(PermissionErrors.InvalidGrantedBy);
  }

  if (params.userId.trim() === params.grantedBy.trim()) {
    return Err(PermissionErrors.CannotGrantToSelf);
  }

  const permission: Permission = {
    level: params.level,
    vehicleId: params.vehicleId.trim(),
    userId: params.userId.trim(),
    grantedBy: params.grantedBy.trim(),
    grantedAt: params.grantedAt || new Date(),
  };

  return Ok(permission);
};

export const canView = (permission: Permission): boolean => {
  return ['viewer', 'editor', 'admin'].includes(permission.level);
};

export const canEdit = (permission: Permission): boolean => {
  return ['editor', 'admin'].includes(permission.level);
};

export const canAdmin = (permission: Permission): boolean => {
  return permission.level === 'admin';
};

export const canDelete = (permission: Permission): boolean => {
  return permission.level === 'admin';
};

export const canShare = (permission: Permission): boolean => {
  return permission.level === 'admin';
};

export const canManagePermissions = (permission: Permission): boolean => {
  return permission.level === 'admin';
};

export const hasPermission = (
  permission: Permission,
  requiredLevel: PermissionLevel
): boolean => {
  const hierarchy: Record<PermissionLevel, number> = {
    viewer: 1,
    editor: 2,
    admin: 3,
  };

  return hierarchy[permission.level] >= hierarchy[requiredLevel];
};

export const getPermissionDisplayName = (level: PermissionLevel): string => {
  const displayNames: Record<PermissionLevel, string> = {
    viewer: '閲覧者',
    editor: '編集者',
    admin: '管理者',
  };

  return displayNames[level];
};

export const getPermissionDescription = (level: PermissionLevel): string => {
  const descriptions: Record<PermissionLevel, string> = {
    viewer: 'データの閲覧のみ可能',
    editor: 'データの追加・編集が可能',
    admin: '全権限（削除・共有設定変更を含む）',
  };

  return descriptions[level];
};