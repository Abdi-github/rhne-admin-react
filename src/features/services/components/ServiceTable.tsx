import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Avatar, Box, IconButton, Tooltip, Chip } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Service } from '../services.types';

interface ServiceTableProps {
  data: Service[];
  total: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  isLoading: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ServiceTable({
  data,
  total,
  paginationModel,
  onPaginationModelChange,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: ServiceTableProps) {
  const { t, i18n } = useTranslation(['services', 'common']);
  const lang = i18n.language as 'fr' | 'en' | 'de' | 'it';

  const columns: GridColDef<Service>[] = [
    {
      field: 'image_url',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Avatar
          src={row.image_url || undefined}
          variant="rounded"
          sx={{ width: 40, height: 40 }}
        >
          {(row.name[lang] || row.name.fr).charAt(0)}
        </Avatar>
      ),
    },
    {
      field: 'name',
      headerName: t('services:name'),
      flex: 1,
      minWidth: 220,
      valueGetter: (value: Service['name']) => value?.[lang] || value?.fr || '',
    },
    {
      field: 'category',
      headerName: t('services:category'),
      width: 160,
      valueGetter: (value: string | null) => value || '—',
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
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box>
          <Tooltip title={t('common:view')}>
            <IconButton size="small" onClick={() => onView(row._id)} aria-label={t('common:view')}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
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
