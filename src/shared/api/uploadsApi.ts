import { baseApi } from './baseApi';
import type { ApiResponse } from '@/shared/types/api.types';

interface UploadImageResponse {
  url: string;
  public_id: string;
  width: number;
  height: number;
}

export const uploadsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<
      ApiResponse<UploadImageResponse>,
      { file: File; resource?: string }
    >({
      query: ({ file, resource }) => {
        const formData = new FormData();
        formData.append('image', file);
        const url = resource
          ? `/admin/uploads/images/${resource}`
          : '/admin/uploads/images';
        return { url, method: 'POST', body: formData };
      },
    }),
    deleteImage: builder.mutation<ApiResponse<null>, string>({
      query: (public_id) => ({
        url: '/admin/uploads/images',
        method: 'DELETE',
        body: { public_id },
      }),
    }),
  }),
});

export const { useUploadImageMutation, useDeleteImageMutation } = uploadsApi;
