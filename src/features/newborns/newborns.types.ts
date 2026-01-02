import type { PaginationParams } from '@/shared/types/api.types';

export interface Newborn {
  _id: string;
  name: string;
  date: string;
  image_url: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewbornPayload {
  name: string;
  date: string;
  image_url?: string;
}

export interface UpdateNewbornPayload {
  name?: string;
  date?: string;
  image_url?: string;
}

export interface NewbornFilters extends PaginationParams {
  month?: string;
}
