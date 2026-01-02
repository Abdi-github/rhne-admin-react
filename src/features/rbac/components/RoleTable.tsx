import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete, Security } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { Role } from '../rbac.types';

interface RoleTableProps {
  data: Role[];
  total: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onManagePermissions: (id: string) => void;
}

export function RoleTable({
  data,
  total,
  paginationModel,
  onPaginationModelChange,
  isLoading,
  onEdit,
  onDelete,
  onManagePermissions,
}: RoleTableProps) {
  const { t } = useTranslation(['rbac', 'common']);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('rbac:role_name'),
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'display_name',
      headerName: t('rbac:display_name'),
      flex: 1,
      minWidth: 180,
      valueGetter: (value: Role['display_name']) => value?.fr ?? '',
    },
    {
      field: 'is_system',
      headerName: t('rbac:is_system'),
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value ? t('common:yes') : t('common:no')}
          size="small"
          color={value ? 'info' : 'default'}
        />
      ),
    },
    {
      field: 'is_active',
      headerName: t('rbac:is_active'),
      width: 100,
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
          <Tooltip title={t('rbac:manage_permissions')}>
            <IconButton
              size="small"
              onClick={() => onManagePermissions(row._id)}
              aria-label={t('rbac:manage_permissions')}
            >
              <Security fontSize="small" />
            </IconButton>
          </Tooltip>
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
            <span>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(row._id)}
                disabled={row.is_system}
                aria-label={t('common:delete')}
              >
                <Delete fontSize="small" />
              </IconButton>
            </span>
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
    />
  );
}
