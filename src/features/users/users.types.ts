import type { TranslatedField } from '@/shared/types/common.types';
import type { PaginationParams } from '@/shared/types/api.types';

export interface UserRole {
  _id: string;
  name: string;
  display_name: TranslatedField;
}

export interface UserSite {
  _id: string;
  name: string;
  slug: string;
}

export interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  preferred_language: 'fr' | 'en' | 'de' | 'it';
  user_type: 'admin' | 'staff';
  site_id: UserSite | null;
  avatar_url: string | null;
  is_active: boolean;
  is_verified: boolean;
  last_login_at: string | null;
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
}

export interface CreateUserPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  preferred_language?: 'fr' | 'en' | 'de' | 'it';
  user_type?: 'admin' | 'staff';
  site_id?: string | null;
  avatar_url?: string | null;
  is_active?: boolean;
  is_verified?: boolean;
  roles?: string[];
}

export interface UpdateUserPayload {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  preferred_language?: 'fr' | 'en' | 'de' | 'it';
  user_type?: 'admin' | 'staff';
  site_id?: string | null;
  avatar_url?: string | null;
  is_active?: boolean;
  is_verified?: boolean;
  roles?: string[];
}

export interface AssignRolesPayload {
  role_ids: string[];
}

export interface UserFilters extends PaginationParams {
  is_active?: string;
  user_type?: string;
}
