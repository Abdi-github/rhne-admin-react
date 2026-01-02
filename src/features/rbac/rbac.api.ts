import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type {
  Role,
  RoleWithPermissions,
  Permission,
  RoleFilters,
  PermissionFilters,
  CreateRolePayload,
  UpdateRolePayload,
  AssignPermissionsPayload,
} from './rbac.types';

export const rbacApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<PaginatedResponse<Role>, RoleFilters>({
      query: (params) => ({ url: '/admin/roles', params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Roles' as const,
                id: _id,
              })),
              { type: 'Roles', id: 'LIST' },
            ]
          : [{ type: 'Roles', id: 'LIST' }],
    }),
    getRoleById: builder.query<ApiResponse<RoleWithPermissions>, string>({
      query: (id) => `/admin/roles/${id}`,
      providesTags: (_, __, id) => [{ type: 'Roles', id }],
    }),
    createRole: builder.mutation<ApiResponse<Role>, CreateRolePayload>({
      query: (body) => ({ url: '/admin/roles', method: 'POST', body }),
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
    }),
    updateRole: builder.mutation<
      ApiResponse<Role>,
      { id: string; body: UpdateRolePayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/roles/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Roles', id },
        { type: 'Roles', id: 'LIST' },
      ],
    }),
    deleteRole: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/admin/roles/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Roles', id: 'LIST' }],
    }),
    getPermissions: builder.query<PaginatedResponse<Permission>, PermissionFilters>({
      query: (params) => ({ url: '/admin/permissions', params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Permissions' as const,
                id: _id,
              })),
              { type: 'Permissions', id: 'LIST' },
            ]
          : [{ type: 'Permissions', id: 'LIST' }],
    }),
    assignPermissions: builder.mutation<
      ApiResponse<RoleWithPermissions>,
      { id: string; body: AssignPermissionsPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/roles/${id}/permissions`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Roles', id },
        { type: 'Roles', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsQuery,
  useAssignPermissionsMutation,
} = rbacApi;
