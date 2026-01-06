import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type {
  EmergencyHotline,
  EmergencyHotlineFilters,
  CreateEmergencyHotlinePayload,
  UpdateEmergencyHotlinePayload,
} from './emergency-hotlines.types';

export const emergencyHotlinesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmergencyHotlines: builder.query<
      PaginatedResponse<EmergencyHotline>,
      EmergencyHotlineFilters
    >({
      query: (params) => ({ url: '/admin/emergency-hotlines', params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'EmergencyHotlines' as const,
                id: _id,
              })),
              { type: 'EmergencyHotlines', id: 'LIST' },
            ]
          : [{ type: 'EmergencyHotlines', id: 'LIST' }],
    }),
    getEmergencyHotlineById: builder.query<ApiResponse<EmergencyHotline>, string>({
      query: (id) => `/admin/emergency-hotlines/${id}`,
      providesTags: (_, __, id) => [{ type: 'EmergencyHotlines', id }],
    }),
    createEmergencyHotline: builder.mutation<
      ApiResponse<EmergencyHotline>,
      CreateEmergencyHotlinePayload
    >({
      query: (body) => ({
        url: '/admin/emergency-hotlines',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'EmergencyHotlines', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    updateEmergencyHotline: builder.mutation<
      ApiResponse<EmergencyHotline>,
      { id: string; body: UpdateEmergencyHotlinePayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/emergency-hotlines/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'EmergencyHotlines', id },
        { type: 'EmergencyHotlines', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    deleteEmergencyHotline: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/admin/emergency-hotlines/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'EmergencyHotlines', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
  }),
});

export const {
  useGetEmergencyHotlinesQuery,
  useGetEmergencyHotlineByIdQuery,
  useCreateEmergencyHotlineMutation,
  useUpdateEmergencyHotlineMutation,
  useDeleteEmergencyHotlineMutation,
} = emergencyHotlinesApi;
