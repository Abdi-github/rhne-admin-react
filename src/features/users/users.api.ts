import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type {
  User,
  UserFilters,
  CreateUserPayload,
  UpdateUserPayload,
  AssignRolesPayload,
} from './users.types';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, UserFilters>({
      query: (params) => ({ url: '/admin/users', params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Users' as const,
                id: _id,
              })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),
    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (_, __, id) => [{ type: 'Users', id }],
    }),
    createUser: builder.mutation<ApiResponse<User>, CreateUserPayload>({
      query: (body) => ({ url: '/admin/users', method: 'POST', body }),
      invalidatesTags: [
        { type: 'Users', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    updateUser: builder.mutation<
      ApiResponse<User>,
      { id: string; body: UpdateUserPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    deleteUser: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/admin/users/${id}`, method: 'DELETE' }),
      invalidatesTags: [
        { type: 'Users', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    assignRoles: builder.mutation<
      ApiResponse<User>,
      { id: string; body: AssignRolesPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/users/${id}/roles`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAssignRolesMutation,
} = usersApi;
