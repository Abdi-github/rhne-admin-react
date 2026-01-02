import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type { Site, SiteFilters, CreateSitePayload, UpdateSitePayload } from './sites.types';

export const sitesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSites: builder.query<PaginatedResponse<Site>, SiteFilters>({
      query: (params) => ({ url: '/admin/sites', params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Sites' as const, id: _id })),
              { type: 'Sites', id: 'LIST' },
            ]
          : [{ type: 'Sites', id: 'LIST' }],
    }),
    getSiteById: builder.query<ApiResponse<Site>, string>({
      query: (id) => `/admin/sites/${id}`,
      providesTags: (_, __, id) => [{ type: 'Sites', id }],
    }),
    createSite: builder.mutation<ApiResponse<Site>, CreateSitePayload>({
      query: (body) => ({ url: '/admin/sites', method: 'POST', body }),
      invalidatesTags: [{ type: 'Sites', id: 'LIST' }, { type: 'Dashboard' }],
    }),
    updateSite: builder.mutation<ApiResponse<Site>, { id: string; body: UpdateSitePayload }>({
      query: ({ id, body }) => ({ url: `/admin/sites/${id}`, method: 'PUT', body }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Sites', id },
        { type: 'Sites', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    deleteSite: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/admin/sites/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Sites', id: 'LIST' }, { type: 'Dashboard' }],
    }),
  }),
});

export const {
  useGetSitesQuery,
  useGetSiteByIdQuery,
  useCreateSiteMutation,
  useUpdateSiteMutation,
  useDeleteSiteMutation,
} = sitesApi;
