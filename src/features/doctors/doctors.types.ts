export interface Doctor {
  _id: string;
  name: string;
  title: string | null;
  service_id: string;
  service_name: string;
  image_url: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDoctorPayload {
  name: string;
  title?: string | null;
  service_id: string;
  service_name?: string;
  image_url?: string;
  is_active?: boolean;
}

export interface UpdateDoctorPayload {
  name?: string;
  title?: string | null;
  service_id?: string;
  service_name?: string;
  image_url?: string;
  is_active?: boolean;
}

export interface DoctorFilters {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  is_active?: string;
  service_id?: string;
}
