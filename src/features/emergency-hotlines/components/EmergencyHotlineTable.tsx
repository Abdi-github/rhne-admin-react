import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Chip, Box, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { EmergencyHotline } from '../emergency-hotlines.types';

const HOTLINE_TYPE_COLORS: Record<string, 'error' | 'warning' | 'secondary' | 'primary'> = {
  vital: 'error',
  non_vital: 'warning',
  psychiatric: 'secondary',
  appointment: 'primary',
};

interface EmergencyHotlineTableProps {
  data: EmergencyHotline[];
  total: number;
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EmergencyHotlineTable({
  data,
  total,
  paginationModel,
  onPaginationModelChange,
  isLoading,
  onEdit,
  onDelete,
}: EmergencyHotlineTableProps) {
  const { t } = useTranslation(['emergency-hotlines', 'common']);

  const columns: GridColDef<EmergencyHotline>[] = [
    {
      field: 'title',
      headerName: t('emergency-hotlines:hotline_title'),
      flex: 1,
      minWidth: 200,
      valueGetter: (_, row) => row.title.fr,
    },
    {
      field: 'hotline_type',
      headerName: t('emergency-hotlines:hotline_type'),
      width: 160,
      renderCell: ({ value }) => (
        <Chip
          label={t(`emergency-hotlines:types.${value}`)}
          size="small"
          color={HOTLINE_TYPE_COLORS[value as string] || 'default'}
        />
      ),
    },
    {
      field: 'phone_number',
      headerName: t('emergency-hotlines:phone_number'),
      width: 160,
    },
    {
      field: 'display_order',
      headerName: t('emergency-hotlines:display_order'),
      width: 100,
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
            <IconButton
              size="small"
              onClick={() => onEdit(row._id)}
              aria-label={t('common:edit')}
            >
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
