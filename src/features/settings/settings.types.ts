import type { SupportedLanguage } from '@/shared/types/common.types';

export interface Profile {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  preferred_language: SupportedLanguage;
  avatar_url: string | null;
  is_active: boolean;
  is_verified: boolean;
  site_id: { _id: string; name: string; slug: string } | null;
  roles: { _id: string; name: string; display_name: { fr: string; en: string; de: string; it: string } }[];
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phone?: string;
  preferred_language?: SupportedLanguage;
  avatar_url?: string | null;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
