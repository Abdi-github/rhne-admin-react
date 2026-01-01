import { useState } from 'react';
import type { GridPaginationModel } from '@mui/x-data-grid';

export function usePagination(initialPageSize = 20) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: initialPageSize,
  });

  return {
    paginationModel,
    setPaginationModel,
    onPaginationModelChange: setPaginationModel,
    apiParams: {
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
    },
  };
}
