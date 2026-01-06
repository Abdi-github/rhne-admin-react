import type { TranslatedField } from '@/shared/types/common.types';
import type { PaginationParams } from '@/shared/types/api.types';

export interface Job {
  _id: string;
  title: TranslatedField;
  job_id: string;
  url: string;
  category: string;
  percentage: string;
  description: TranslatedField | null;
  requirements: TranslatedField[];
  site: string;
  department: string;
  published_date: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobPayload {
  title: TranslatedField;
  job_id?: string;
  url?: string;
  category?: string;
  percentage?: string;
  description?: TranslatedField | null;
  requirements?: TranslatedField[];
  site?: string;
  department?: string;
  published_date?: string;
  is_active?: boolean;
}

export interface UpdateJobPayload {
  title?: TranslatedField;
  job_id?: string;
  url?: string;
  category?: string;
  percentage?: string;
  description?: TranslatedField | null;
  requirements?: TranslatedField[];
  site?: string;
  department?: string;
  published_date?: string;
  is_active?: boolean;
}

export interface JobFilters extends PaginationParams {
  is_active?: boolean;
  category?: string;
}
