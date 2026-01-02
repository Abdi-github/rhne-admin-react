import type { TranslatedField } from '@/shared/types/common.types';

export interface Site {
  _id: string;
  name: string;
  slug: string;
  type: TranslatedField;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  maps_url: string;
  image_url: string;
  description: TranslatedField | null;
  amenities: TranslatedField[];
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSitePayload {
  name: string;
  type: TranslatedField;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  maps_url?: string;
  image_url?: string;
  description?: TranslatedField;
  amenities?: TranslatedField[];
  is_active?: boolean;
}

export interface UpdateSitePayload {
  name?: string;
  type?: TranslatedField;
  address?: string;
  city?: string;
  postal_code?: string;
  phone?: string;
  maps_url?: string;
  image_url?: string;
  description?: TranslatedField;
  amenities?: TranslatedField[];
  is_active?: boolean;
}

export interface SiteFilters {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  is_active?: string;
}
