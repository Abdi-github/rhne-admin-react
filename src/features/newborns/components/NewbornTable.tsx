import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Avatar, Chip, Box, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import type { Newborn } from '../newborns.types';

interface NewbornTableProps {
  data: Newborn[];
  total: number;
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NewbornTable({
  data,
  total,
  paginationModel,
  onPaginationModelChange,
  isLoading,
  onEdit,
  onDelete,
}: NewbornTableProps) {
  const { t } = useTranslation(['newborns', 'common']);

  const columns: GridColDef<Newborn>[] = [
    {
      field: 'image_url',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Avatar
          src={row.image_url}
          variant="rounded"
          alt={row.name}
          sx={{ width: 40, height: 40 }}
        />
      ),
    },
    {
      field: 'name',
      headerName: t('newborns:name'),
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'date',
      headerName: t('newborns:date'),
      width: 130,
      valueGetter: (_, row) => dayjs(row.date).format('DD/MM/YYYY'),
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
