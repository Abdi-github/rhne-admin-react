import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Avatar, Box, IconButton, Tooltip, Chip, Stack } from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { User } from '../users.types';

interface UserTableProps {
  data: User[];
  total: number;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  isLoading: boolean;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function UserTable({
  data,
  total,
  paginationModel,
  onPaginationModelChange,
  isLoading,
  onView,
  onEdit,
  onDelete,
}: UserTableProps) {
  const { t } = useTranslation(['users', 'common']);

  const columns: GridColDef<User>[] = [
    {
      field: 'avatar_url',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Avatar
          src={row.avatar_url || undefined}
          alt={`${row.first_name} ${row.last_name}`}
          sx={{ width: 40, height: 40 }}
        >
          {row.first_name.charAt(0)}{row.last_name.charAt(0)}
        </Avatar>
      ),
    },
    {
      field: 'full_name',
      headerName: t('users:full_name'),
      flex: 1,
      minWidth: 180,
      valueGetter: (_value, row) => `${row.first_name} ${row.last_name}`,
    },
    {
      field: 'email',
      headerName: t('users:email'),
      flex: 1,
      minWidth: 220,
    },
    {
      field: 'roles',
      headerName: t('users:roles'),
      width: 200,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {row.roles.map((role) => (
            <Chip key={role._id} label={role.name} size="small" variant="outlined" />
          ))}
          {row.roles.length === 0 && '—'}
        </Stack>
      ),
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
