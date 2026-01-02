import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type {
  Appointment,
  AppointmentFilters,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from './appointments.types';

export const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query<
      PaginatedResponse<Appointment>,
      AppointmentFilters
    >({
      query: (params) => ({ url: '/admin/appointments', params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Appointments' as const,
                id: _id,
              })),
              { type: 'Appointments', id: 'LIST' },
            ]
          : [{ type: 'Appointments', id: 'LIST' }],
    }),
    getAppointmentById: builder.query<ApiResponse<Appointment>, string>({
      query: (id) => `/admin/appointments/${id}`,
      providesTags: (_, __, id) => [{ type: 'Appointments', id }],
    }),
    createAppointment: builder.mutation<
      ApiResponse<Appointment>,
      CreateAppointmentPayload
    >({
      query: (body) => ({
        url: '/admin/appointments',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Appointments', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    updateAppointment: builder.mutation<
      ApiResponse<Appointment>,
      { id: string; body: UpdateAppointmentPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/appointments/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Appointments', id },
        { type: 'Appointments', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    deleteAppointment: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/admin/appointments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Appointments', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetAppointmentByIdQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
} = appointmentsApi;
