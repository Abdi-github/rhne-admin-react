import { baseApi } from '@/shared/api/baseApi';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/api.types';
import type {
  PatientInfo,
  PatientInfoFilters,
  CreatePatientInfoPayload,
  UpdatePatientInfoPayload,
} from './patient-info.types';

export const patientInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatientInfoPages: builder.query<PaginatedResponse<PatientInfo>, PatientInfoFilters>({
      query: (params) => ({ url: '/admin/patient-info', params }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'PatientInfo' as const,
                id: _id,
              })),
              { type: 'PatientInfo', id: 'LIST' },
            ]
          : [{ type: 'PatientInfo', id: 'LIST' }],
    }),
    getPatientInfoById: builder.query<ApiResponse<PatientInfo>, string>({
      query: (id) => `/admin/patient-info/${id}`,
      providesTags: (_, __, id) => [{ type: 'PatientInfo', id }],
    }),
    createPatientInfo: builder.mutation<ApiResponse<PatientInfo>, CreatePatientInfoPayload>({
      query: (body) => ({ url: '/admin/patient-info', method: 'POST', body }),
      invalidatesTags: [
        { type: 'PatientInfo', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    updatePatientInfo: builder.mutation<
      ApiResponse<PatientInfo>,
      { id: string; body: UpdatePatientInfoPayload }
    >({
      query: ({ id, body }) => ({
        url: `/admin/patient-info/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'PatientInfo', id },
        { type: 'PatientInfo', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
    deletePatientInfo: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/admin/patient-info/${id}`, method: 'DELETE' }),
      invalidatesTags: [
        { type: 'PatientInfo', id: 'LIST' },
        { type: 'Dashboard' },
      ],
    }),
  }),
});

export const {
  useGetPatientInfoPagesQuery,
  useGetPatientInfoByIdQuery,
  useCreatePatientInfoMutation,
  useUpdatePatientInfoMutation,
  useDeletePatientInfoMutation,
} = patientInfoApi;
