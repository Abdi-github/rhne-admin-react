import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type {
  Newborn,
  NewbornFilters,
  CreateNewbornPayload,
  UpdateNewbornPayload,
} from './newborns.types';

export const newbornsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNewborns: builder.query<PaginatedResponse<Newborn>, NewbornFilters>({
      query: (params) => ({ url: '/admin/newborns', params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Newborns' as const,
                id: _id,
              })),
              { type: 'Newborns', id: 'LIST' },
            ]
          : [{ type: 'Newborns', id: 'LIST' }],
    }),
    getNewbornById: builder.query<ApiResponse<Newborn>, string>({
      query: (id) => `/admin/newborns/${id}`,
      providesTags: (_, __, id) => [{ type: 'Newborns', id }],
    }),
    createNewborn: builder.mutation<ApiResponse<Newborn>, CreateNewbornPayload>({
      query: (body) => ({ url: '/admin/newborns', method: 'POST', body }),
      invalidatesTags: [
        { type: 'Newborns', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    updateNewborn: builder.mutation<
      ApiResponse<Newborn>,
      { id: string; body: UpdateNewbornPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/newborns/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Newborns', id },
        { type: 'Newborns', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    deleteNewborn: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/admin/newborns/${id}`, method: 'DELETE' }),
      invalidatesTags: [
        { type: 'Newborns', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
  }),
});

export const {
  useGetNewbornsQuery,
  useGetNewbornByIdQuery,
  useCreateNewbornMutation,
  useUpdateNewbornMutation,
  useDeleteNewbornMutation,
} = newbornsApi;
