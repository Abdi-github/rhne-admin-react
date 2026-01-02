import type { TranslatedField } from '@/shared/types/common.types';
import type { PaginationParams } from '@/shared/types/api.types';

export interface Role {
  _id: string;
  name: string;
  display_name: TranslatedField;
  description: TranslatedField;
  is_system: boolean;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  _id: string;
  name: string;
  display_name: string;
  description: string;
  resource: string;
  action: 'read' | 'create' | 'update' | 'delete';
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

export interface CreateRolePayload {
  name: string;
  display_name: TranslatedField;
  description: TranslatedField;
  is_active?: boolean;
}

export interface UpdateRolePayload {
  name?: string;
  display_name?: TranslatedField;
  description?: TranslatedField;
  is_active?: boolean;
}

export interface AssignPermissionsPayload {
  permission_ids: string[];
}

export interface RoleFilters extends PaginationParams {
  is_active?: string;
}

export interface PermissionFilters extends PaginationParams {
  resource?: string;
  action?: string;
}
