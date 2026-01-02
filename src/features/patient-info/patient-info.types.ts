import type { TranslatedField } from '@/shared/types/common.types';
import type { PaginationParams } from '@/shared/types/api.types';

export interface PatientInfoSection {
  id: string;
  title: TranslatedField;
  content: TranslatedField;
  list_items: TranslatedField[];
}

export interface PatientInfo {
  _id: string;
  title: TranslatedField;
  slug: string;
  url: string;
  section: string;
  sections: PatientInfoSection[];
  content: TranslatedField | null;
  image_url: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientInfoPayload {
  title: TranslatedField;
  slug?: string;
  url?: string;
  section?: string;
  sections?: PatientInfoSection[];
  content?: TranslatedField | null;
  image_url?: string;
}

export interface UpdatePatientInfoPayload {
  title?: TranslatedField;
  slug?: string;
  url?: string;
  section?: string;
  sections?: PatientInfoSection[];
  content?: TranslatedField | null;
  image_url?: string;
}

export interface PatientInfoFilters extends PaginationParams {
  section?: string;
}
