import type { TranslatedField } from '@/shared/types/common.types';
import type { PaginationParams } from '@/shared/types/api.types';

export interface EmergencyHotline {
  _id: string;
  title: TranslatedField;
  slug: string;
  subtitle: TranslatedField | null;
  hotline_type: 'vital' | 'non_vital' | 'psychiatric' | 'appointment';
  phone_number: string;
  description: TranslatedField | null;
  icon: string;
  color: string;
  link_url: string;
  display_order: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmergencyHotlinePayload {
  title: TranslatedField;
  hotline_type: 'vital' | 'non_vital' | 'psychiatric' | 'appointment';
  subtitle?: TranslatedField | null;
  phone_number?: string;
  description?: TranslatedField | null;
  icon?: string;
  color?: string;
  link_url?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateEmergencyHotlinePayload {
  title?: TranslatedField;
  hotline_type?: 'vital' | 'non_vital' | 'psychiatric' | 'appointment';
  subtitle?: TranslatedField | null;
  phone_number?: string;
  description?: TranslatedField | null;
  icon?: string;
  color?: string;
  link_url?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface EmergencyHotlineFilters extends PaginationParams {
  is_active?: boolean;
}
