import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Avatar, Box, IconButton, Tooltip, Chip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Site } from '../sites.types';

interface SiteTableProps {
  data: Site[];
  total: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SiteTable({
  data,
  total,
  paginationModel,
  onPaginationModelChange,
  isLoading,
  onEdit,
  onDelete,
}: SiteTableProps) {
  const { t, i18n } = useTranslation(['sites', 'common']);
  const lang = i18n.language as 'fr' | 'en' | 'de' | 'it';

  const columns: GridColDef<Site>[] = [
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
          alt={row.name}
          sx={{ width: 40, height: 40 }}
        >
          {row.name.charAt(0)}
        </Avatar>
      ),
    },
    {
      field: 'name',
      headerName: t('sites:name'),
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'type',
      headerName: t('sites:type'),
      width: 180,
      valueGetter: (value: Site['type']) => value?.[lang] || value?.fr || '',
    },
    {
      field: 'city',
      headerName: t('sites:city'),
      width: 150,
    },
    {
      field: 'postal_code',
      headerName: t('sites:postal_code'),
      width: 110,
    },
    {
      field: 'phone',
      headerName: t('sites:phone'),
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
