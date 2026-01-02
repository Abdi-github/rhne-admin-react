import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type {
  Doctor,
  DoctorFilters,
  CreateDoctorPayload,
  UpdateDoctorPayload,
} from './doctors.types';

export const doctorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query<PaginatedResponse<Doctor>, DoctorFilters>({
      query: (params) => ({ url: '/admin/doctors', params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Doctors' as const,
                id: _id,
              })),
              { type: 'Doctors', id: 'LIST' },
            ]
          : [{ type: 'Doctors', id: 'LIST' }],
    }),
    getDoctorById: builder.query<ApiResponse<Doctor>, string>({
      query: (id) => `/admin/doctors/${id}`,
      providesTags: (_, __, id) => [{ type: 'Doctors', id }],
    }),
    createDoctor: builder.mutation<ApiResponse<Doctor>, CreateDoctorPayload>({
      query: (body) => ({ url: '/admin/doctors', method: 'POST', body }),
      invalidatesTags: [
        { type: 'Doctors', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    updateDoctor: builder.mutation<
      ApiResponse<Doctor>,
      { id: string; body: UpdateDoctorPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/doctors/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Doctors', id },
        { type: 'Doctors', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    deleteDoctor: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/admin/doctors/${id}`, method: 'DELETE' }),
      invalidatesTags: [
        { type: 'Doctors', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorByIdQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useDeleteDoctorMutation,
} = doctorsApi;
