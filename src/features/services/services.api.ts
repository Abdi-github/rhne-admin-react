import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type {
  Service,
  ServiceFilters,
  CreateServicePayload,
  UpdateServicePayload,
  ServiceContact,
  CreateServiceContactPayload,
  UpdateServiceContactPayload,
  ServiceLink,
  CreateServiceLinkPayload,
  UpdateServiceLinkPayload,
} from './services.types';

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Services CRUD ──
    getServices: builder.query<PaginatedResponse<Service>, ServiceFilters>({
      query: (params) => ({ url: '/admin/services', params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Services' as const, id: _id })),
              { type: 'Services', id: 'LIST' },
            ]
          : [{ type: 'Services', id: 'LIST' }],
    }),
    getServiceById: builder.query<ApiResponse<Service>, string>({
      query: (id) => `/admin/services/${id}`,
      providesTags: (_, __, id) => [{ type: 'Services', id }],
    }),
    createService: builder.mutation<ApiResponse<Service>, CreateServicePayload>({
      query: (body) => ({ url: '/admin/services', method: 'POST', body }),
      invalidatesTags: [{ type: 'Services', id: 'LIST' }, { type: 'Dashboard' }],
    }),
    updateService: builder.mutation<ApiResponse<Service>, { id: string; body: UpdateServicePayload }>({
      query: ({ id, body }) => ({ url: `/admin/services/${id}`, method: 'PUT', body }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Services', id },
        { type: 'Services', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    deleteService: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/admin/services/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Services', id: 'LIST' }, { type: 'Dashboard' }],
    }),

    // ── Service Contacts ──
    getServiceContacts: builder.query<ApiResponse<ServiceContact[]>, string>({
      query: (serviceId) => `/admin/services/${serviceId}/contacts`,
      providesTags: (_, __, serviceId) => [{ type: 'ServiceContacts', id: serviceId }],
    }),
    createServiceContact: builder.mutation<ApiResponse<ServiceContact>, { serviceId: string; body: CreateServiceContactPayload }>({
      query: ({ serviceId, body }) => ({
        url: `/admin/services/${serviceId}/contacts`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, __, { serviceId }) => [{ type: 'ServiceContacts', id: serviceId }],
    }),
    updateServiceContact: builder.mutation<ApiResponse<ServiceContact>, { id: string; serviceId: string; body: UpdateServiceContactPayload }>({
      query: ({ id, body }) => ({
        url: `/admin/service-contacts/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { serviceId }) => [{ type: 'ServiceContacts', id: serviceId }],
    }),
    deleteServiceContact: builder.mutation<ApiResponse<null>, { id: string; serviceId: string }>({
      query: ({ id }) => ({
        url: `/admin/service-contacts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { serviceId }) => [{ type: 'ServiceContacts', id: serviceId }],
    }),

    // ── Service Links ──
    getServiceLinks: builder.query<ApiResponse<ServiceLink[]>, string>({
      query: (serviceId) => `/admin/services/${serviceId}/links`,
      providesTags: (_, __, serviceId) => [{ type: 'ServiceLinks', id: serviceId }],
    }),
    createServiceLink: builder.mutation<ApiResponse<ServiceLink>, { serviceId: string; body: CreateServiceLinkPayload }>({
      query: ({ serviceId, body }) => ({
        url: `/admin/services/${serviceId}/links`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, __, { serviceId }) => [{ type: 'ServiceLinks', id: serviceId }],
    }),
    updateServiceLink: builder.mutation<ApiResponse<ServiceLink>, { id: string; serviceId: string; body: UpdateServiceLinkPayload }>({
      query: ({ id, body }) => ({
        url: `/admin/service-links/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { serviceId }) => [{ type: 'ServiceLinks', id: serviceId }],
    }),
    deleteServiceLink: builder.mutation<ApiResponse<null>, { id: string; serviceId: string }>({
      query: ({ id }) => ({
        url: `/admin/service-links/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { serviceId }) => [{ type: 'ServiceLinks', id: serviceId }],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServiceContactsQuery,
  useCreateServiceContactMutation,
  useUpdateServiceContactMutation,
  useDeleteServiceContactMutation,
  useGetServiceLinksQuery,
  useCreateServiceLinkMutation,
  useUpdateServiceLinkMutation,
  useDeleteServiceLinkMutation,
} = servicesApi;
