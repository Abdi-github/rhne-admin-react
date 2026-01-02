import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Avatar, Box, IconButton, Tooltip, Chip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Doctor } from '../doctors.types';

interface DoctorTableProps {
  data: Doctor[];
  total: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DoctorTable({
  data,
  total,
  paginationModel,
  onPaginationModelChange,
  isLoading,
  onEdit,
  onDelete,
}: DoctorTableProps) {
  const { t } = useTranslation(['doctors', 'common']);

  const columns: GridColDef<Doctor>[] = [
    {
      field: 'image_url',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Avatar
          src={row.image_url || undefined}
          alt={row.name}
          sx={{ width: 40, height: 40 }}
        >
          {row.name.charAt(0)}
        </Avatar>
      ),
    },
    {
      field: 'name',
      headerName: t('doctors:name'),
      flex: 1,
      minWidth: 200,
      valueGetter: (_value, row) => {
        return row.title ? `${row.title} ${row.name}` : row.name;
      },
    },
    {
      field: 'service_name',
      headerName: t('doctors:service'),
      width: 200,
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
      loading={isLoading}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      paginationMode="server"
      pageSizeOptions={[10, 20, 50]}
      disableRowSelectionOnClick
      autoHeight
      sx={{ border: 'none' }}
    />
  );
}
