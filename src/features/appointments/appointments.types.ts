import type { TranslatedField } from '@/shared/types/common.types';
import type { PaginationParams } from '@/shared/types/api.types';

export interface Appointment {
  _id: string;
  title: TranslatedField;
  slug: string;
  appointment_type: 'adult' | 'child' | 'doctor';
  description: TranslatedField | null;
  age_restriction: TranslatedField | null;
  schedule: TranslatedField | null;
  locations: TranslatedField | null;
  booking_url: string;
  info_text: TranslatedField | null;
  conditions: TranslatedField[];
  phone_number: string;
  display_order: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentPayload {
  title: TranslatedField;
  appointment_type: 'adult' | 'child' | 'doctor';
  description?: TranslatedField | null;
  age_restriction?: TranslatedField | null;
  schedule?: TranslatedField | null;
  locations?: TranslatedField | null;
  booking_url?: string;
  info_text?: TranslatedField | null;
  conditions?: TranslatedField[];
  phone_number?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateAppointmentPayload {
  title?: TranslatedField;
  appointment_type?: 'adult' | 'child' | 'doctor';
  description?: TranslatedField | null;
  age_restriction?: TranslatedField | null;
  schedule?: TranslatedField | null;
  locations?: TranslatedField | null;
  booking_url?: string;
  info_text?: TranslatedField | null;
  conditions?: TranslatedField[];
  phone_number?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface AppointmentFilters extends PaginationParams {
  is_active?: boolean;
}
