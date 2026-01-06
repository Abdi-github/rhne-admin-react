import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Chip, Box, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Job } from '../jobs.types';

interface JobTableProps {
  data: Job[];
  total: number;
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function JobTable({
  data,
  total,
  paginationModel,
  onPaginationModelChange,
  isLoading,
  onEdit,
  onDelete,
}: JobTableProps) {
  const { t } = useTranslation(['jobs', 'common']);

  const columns: GridColDef<Job>[] = [
    {
      field: 'title',
      headerName: t('jobs:job_title'),
      flex: 1,
      minWidth: 200,
      valueGetter: (_, row) => row.title.fr,
    },
    {
      field: 'job_id',
      headerName: t('jobs:job_id'),
      width: 120,
    },
    {
      field: 'category',
      headerName: t('jobs:category'),
      width: 150,
    },
    {
      field: 'percentage',
      headerName: t('jobs:percentage'),
      width: 120,
    },
    {
      field: 'site',
      headerName: t('jobs:site'),
      width: 150,
    },
    {
      field: 'department',
      headerName: t('jobs:department'),
      width: 150,
    },
    {
      field: 'is_active',
      headerName: t('common:status'),
      width: 110,
      renderCell: ({ value }) => (
        <Chip
          label={value ? t('common:active') : t('common:inactive')}
          size="small"
          color={value ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: t('common:actions'),
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box>
          <Tooltip title={t('common:edit')}>
            <IconButton size="small" onClick={() => onEdit(row._id)} aria-label={t('common:edit')}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common:delete')}>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(row._id)}
              aria-label={t('common:delete')}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <DataGrid
      rows={data}
      columns={columns}
      getRowId={(row) => row._id}
      rowCount={total}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      paginationMode="server"
      pageSizeOptions={[10, 20, 50]}
      loading={isLoading}
      disableRowSelectionOnClick
      autoHeight
      sx={{ mt: 2 }}
    />
  );
}
