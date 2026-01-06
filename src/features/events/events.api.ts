import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type {
  Event,
  EventFilters,
  CreateEventPayload,
  UpdateEventPayload,
} from './events.types';

export const eventsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<PaginatedResponse<Event>, EventFilters>({
      query: (params) => ({ url: '/admin/events', params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Events' as const,
                id: _id,
              })),
              { type: 'Events', id: 'LIST' },
            ]
          : [{ type: 'Events', id: 'LIST' }],
    }),
    getEventById: builder.query<ApiResponse<Event>, string>({
      query: (id) => `/admin/events/${id}`,
      providesTags: (_, __, id) => [{ type: 'Events', id }],
    }),
    createEvent: builder.mutation<ApiResponse<Event>, CreateEventPayload>({
      query: (body) => ({ url: '/admin/events', method: 'POST', body }),
      invalidatesTags: [
        { type: 'Events', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    updateEvent: builder.mutation<
      ApiResponse<Event>,
      { id: string; body: UpdateEventPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/events/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Events', id },
        { type: 'Events', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    deleteEvent: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/admin/events/${id}`, method: 'DELETE' }),
      invalidatesTags: [
        { type: 'Events', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventsApi;
