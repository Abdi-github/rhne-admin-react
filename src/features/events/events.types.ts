import type { TranslatedField } from '@/shared/types/common.types';
import type { PaginationParams } from '@/shared/types/api.types';

export interface Event {
  _id: string;
  title: TranslatedField;
  slug: string;
  url: string;
  date: string;
  time: TranslatedField | null;
  location: TranslatedField | null;
  category: TranslatedField | null;
  description: TranslatedField | null;
  detail_url: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventPayload {
  title: TranslatedField;
  url?: string;
  date: string;
  time?: TranslatedField | null;
  location?: TranslatedField | null;
  category?: TranslatedField | null;
  description?: TranslatedField | null;
  detail_url?: string;
  is_active?: boolean;
}

export interface UpdateEventPayload {
  title?: TranslatedField;
  url?: string;
  date?: string;
  time?: TranslatedField | null;
  location?: TranslatedField | null;
  category?: TranslatedField | null;
  description?: TranslatedField | null;
  detail_url?: string;
  is_active?: boolean;
}

export interface EventFilters extends PaginationParams {
  is_active?: boolean;
}
