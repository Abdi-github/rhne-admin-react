import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Chip, Box, IconButton, Tooltip } from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { AppointmentBooking, BookingStatus } from '../appointment-bookings.types';

const STATUS_COLORS: Record<BookingStatus, 'warning' | 'success' | 'error' | 'info' | 'default'> = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
  completed: 'info',
  no_show: 'default',
};

interface BookingTableProps {
  data: AppointmentBooking[];
  total: number;
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
  isLoading: boolean;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BookingTable({
  data,
  total,
  paginationModel,
  onPaginationModelChange,
  isLoading,
  onView,
  onDelete,
}: BookingTableProps) {
  const { t, i18n } = useTranslation(['bookings', 'appointments', 'common']);
  const lang = i18n.language as 'fr' | 'en' | 'de' | 'it';

  const columns: GridColDef<AppointmentBooking>[] = [
    {
      field: 'booking_reference',
      headerName: t('bookings:reference'),
      width: 180,
      renderCell: ({ value }) => (
        <Box sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{value}</Box>
      ),
    },
    {
      field: 'patient_name',
      headerName: t('bookings:patient'),
      flex: 1,
      minWidth: 160,
      valueGetter: (_, row) =>
        `${row.patient_info.last_name} ${row.patient_info.first_name}`,
    },
    {
      field: 'appointment_type',
      headerName: t('appointments:appointment_type'),
      width: 140,
      renderCell: ({ value }) => (
        <Chip
          label={t(`appointments:types.${value}`)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'preferred_date',
      headerName: t('bookings:date'),
      width: 120,
      valueGetter: (_, row) =>
        new Date(row.preferred_date).toLocaleDateString(lang),
    },
    {
      field: 'preferred_time_slot',
      headerName: t('bookings:time_slot'),
      width: 100,
    },
    {
      field: 'site',
      headerName: t('bookings:site'),
      width: 150,
      valueGetter: (_, row) => row.site_id?.name?.[lang] || '—',
    },
    {
      field: 'status',
      headerName: t('common:status'),
      width: 130,
      renderCell: ({ value }) => (
        <Chip
          label={t(`bookings:statuses.${value}`)}
          size="small"
          color={STATUS_COLORS[value as BookingStatus] || 'default'}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: t('bookings:submitted'),
      width: 140,
      valueGetter: (_, row) =>
        new Date(row.createdAt).toLocaleDateString(lang, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    {
      field: 'actions',
      headerName: t('common:actions'),
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box>
          <Tooltip title={t('common:view')}>
            <IconButton
              size="small"
              onClick={() => onView(row._id)}
              aria-label={t('common:view')}
            >
              <Visibility fontSize="small" />
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
      sx={{
        '& .MuiDataGrid-cell': { py: 1 },
        border: 'none',
      }}
    />
  );
}
