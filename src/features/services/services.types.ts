import type { TranslatedField } from '@/shared/types/common.types';

export interface Service {
  _id: string;
  name: TranslatedField;
  slug: string;
  category: string | null;
  image_url: string;
  description: TranslatedField | null;
  prestations: TranslatedField[];
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceContact {
  _id: string;
  service_id: string;
  site_id: string | null;
  site_name: string;
  email: string;
  phone: string;
  hours: TranslatedField | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceLink {
  _id: string;
  service_id: string;
  title: TranslatedField;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServicePayload {
  name: TranslatedField;
  category?: string | null;
  image_url?: string;
  description?: TranslatedField | null;
  prestations?: TranslatedField[];
  is_active?: boolean;
}

export interface UpdateServicePayload {
  name?: TranslatedField;
  category?: string | null;
  image_url?: string;
  description?: TranslatedField | null;
  prestations?: TranslatedField[];
  is_active?: boolean;
}

export interface ServiceFilters {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  is_active?: string;
}

export interface CreateServiceContactPayload {
  site_id?: string | null;
  site_name?: string;
  email?: string;
  phone?: string;
  hours?: TranslatedField | null;
}

export interface UpdateServiceContactPayload {
  site_id?: string | null;
  site_name?: string;
  email?: string;
  phone?: string;
  hours?: TranslatedField | null;
}

export interface CreateServiceLinkPayload {
  title: TranslatedField;
  url: string;
}

export interface UpdateServiceLinkPayload {
  title?: TranslatedField;
  url?: string;
}
