import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type {
  AppointmentBooking,
  AppointmentBookingFilters,
  UpdateBookingStatusPayload,
} from './appointment-bookings.types';

export const appointmentBookingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointmentBookings: builder.query<
      PaginatedResponse<AppointmentBooking>,
      AppointmentBookingFilters
    >({
      query: (params) => ({ url: '/admin/appointment-bookings', params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'AppointmentBookings' as const,
                id: _id,
              })),
              { type: 'AppointmentBookings', id: 'LIST' },
            ]
          : [{ type: 'AppointmentBookings', id: 'LIST' }],
    }),
    getAppointmentBookingById: builder.query<
      ApiResponse<AppointmentBooking>,
      string
    >({
      query: (id) => `/admin/appointment-bookings/${id}`,
      providesTags: (_, __, id) => [{ type: 'AppointmentBookings', id }],
    }),
    updateBookingStatus: builder.mutation<
      ApiResponse<AppointmentBooking>,
      { id: string; body: UpdateBookingStatusPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/appointment-bookings/${id}/status`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'AppointmentBookings', id },
        { type: 'AppointmentBookings', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    deleteAppointmentBooking: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/admin/appointment-bookings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'AppointmentBookings', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
  }),
});

export const {
  useGetAppointmentBookingsQuery,
  useGetAppointmentBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useDeleteAppointmentBookingMutation,
} = appointmentBookingsApi;
