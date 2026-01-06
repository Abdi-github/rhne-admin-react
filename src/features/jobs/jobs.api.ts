import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type {
  Job,
  JobFilters,
  CreateJobPayload,
  UpdateJobPayload,
} from './jobs.types';

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query<PaginatedResponse<Job>, JobFilters>({
      query: (params) => ({ url: '/admin/jobs', params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Jobs' as const,
                id: _id,
              })),
              { type: 'Jobs', id: 'LIST' },
            ]
          : [{ type: 'Jobs', id: 'LIST' }],
    }),
    getJobById: builder.query<ApiResponse<Job>, string>({
      query: (id) => `/admin/jobs/${id}`,
      providesTags: (_, __, id) => [{ type: 'Jobs', id }],
    }),
    createJob: builder.mutation<ApiResponse<Job>, CreateJobPayload>({
      query: (body) => ({ url: '/admin/jobs', method: 'POST', body }),
      invalidatesTags: [
        { type: 'Jobs', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    updateJob: builder.mutation<
      ApiResponse<Job>,
      { id: string; body: UpdateJobPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/jobs/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Jobs', id },
        { type: 'Jobs', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    deleteJob: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/admin/jobs/${id}`, method: 'DELETE' }),
      invalidatesTags: [
        { type: 'Jobs', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
  }),
});

export const {
  useGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobsApi;
