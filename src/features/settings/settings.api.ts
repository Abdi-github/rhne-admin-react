import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse } from '@/shared/types/api.types';
import type { Profile, UpdateProfilePayload, ChangePasswordPayload } from './settings.types';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<Profile>, void>({
      query: () => '/admin/profile',
      providesTags: [{ type: 'Profile' }],
    }),
    updateProfile: builder.mutation<ApiResponse<Profile>, UpdateProfilePayload>({
      query: (body) => ({ url: '/admin/profile', method: 'PUT', body }),
      invalidatesTags: [{ type: 'Profile' }],
    }),
    changePassword: builder.mutation<ApiResponse<null>, ChangePasswordPayload>({
      query: (body) => ({ url: '/admin/profile/password', method: 'PUT', body }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = settingsApi;
