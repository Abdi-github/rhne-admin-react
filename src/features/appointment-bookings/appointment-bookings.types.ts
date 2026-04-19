import type { PaginationParams } from '@/shared/types/api.types';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface PatientInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
}

export interface AppointmentBooking {
  _id: string;
  booking_reference: string;
  appointment_id: {
    _id: string;
    title: { fr: string; en: string; de: string; it: string };
    appointment_type: 'adult' | 'child' | 'doctor';
  } | null;
  appointment_type: 'adult' | 'child' | 'doctor';
  patient_info: PatientInfo;
  site_id: {
    _id: string;
    name: { fr: string; en: string; de: string; it: string };
    city: string;
  } | null;
  preferred_date: string;
  preferred_time_slot: string;
  reason: string;
  symptoms: string[];
  status: BookingStatus;
  notes: string | null;
  confirmed_by: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentBookingFilters extends PaginationParams {
  status?: BookingStatus;
  appointment_type?: 'adult' | 'child' | 'doctor';
  date_from?: string;
  date_to?: string;
}

export interface UpdateBookingStatusPayload {
  status: BookingStatus;
  notes?: string;
}
