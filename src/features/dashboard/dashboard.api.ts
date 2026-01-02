import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse } from '@/shared/types/api.types';
import type { DashboardStats } from './dashboard.types';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => '/admin/dashboard/stats',
      providesTags: [{ type: 'Dashboard' }],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
