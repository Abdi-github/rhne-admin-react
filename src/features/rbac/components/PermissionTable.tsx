import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Permission } from '../rbac.types';

interface PermissionTableProps {
  data: Permission[];
  total: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  isLoading: boolean;
}

const ACTION_COLORS: Record<string, 'info' | 'success' | 'warning' | 'error'> = {
  read: 'info',
  create: 'success',
  update: 'warning',
  delete: 'error',
};

export function PermissionTable({
  data,
  total,
  paginationModel,
  onPaginationModelChange,
  isLoading,
}: PermissionTableProps) {
  const { t } = useTranslation(['rbac', 'common']);

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('rbac:permission_name'),
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'resource',
      headerName: t('rbac:resource'),
      width: 150,
    },
    {
      field: 'action',
      headerName: t('rbac:action'),
      width: 130,
      renderCell: ({ value }) => (
        <Chip
          label={t(`rbac:actions.${value}`)}
          size="small"
          color={ACTION_COLORS[value] ?? 'default'}
        />
      ),
    },
    {
      field: 'display_name',
      headerName: t('rbac:display_name'),
      flex: 1,
      minWidth: 180,
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
