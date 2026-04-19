import { useState } from 'react';
import { Box, MenuItem, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { DataTableToolbar } from '@/shared/components/DataTableToolbar';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { usePagination } from '@/shared/hooks/usePagination';
import { useNotification } from '@/shared/hooks/useNotification';
import { BookingTable } from '../components/BookingTable';
import { BookingDetailDialog } from '../components/BookingDetailDialog';
import {
  useGetAppointmentBookingsQuery,
  useGetAppointmentBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useDeleteAppointmentBookingMutation,
} from '../appointment-bookings.api';
import type { BookingStatus } from '../appointment-bookings.types';

export default function AppointmentBookingsListPage() {
  const { t } = useTranslation(['bookings', 'common']);
  const notification = useNotification();
  const { paginationModel, onPaginationModelChange } = usePagination();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error, refetch } = useGetAppointmentBookingsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: debouncedSearch || undefined,
    status: (statusFilter as BookingStatus) || undefined,
  });

  const { data: bookingDetail } = useGetAppointmentBookingByIdQuery(viewId!, {
    skip: !viewId,
  });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateBookingStatusMutation();
  const [deleteBooking, { isLoading: isDeleting }] =
    useDeleteAppointmentBookingMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBooking(deleteId).unwrap();
      notification.success(t('bookings:deleted_success'));
      setDeleteId(null);
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: BookingStatus,
    notes?: string,
  ) => {
    try {
      await updateStatus({ id, body: { status, notes } }).unwrap();
      notification.success(t('bookings:status_updated'));
      setViewId(null);
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  return (
    <Box>
      <PageHeader title={t('bookings:title')} />

      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder={t('bookings:search_placeholder')}
      >
        <TextField
          select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
          label={t('common:status')}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">{t('common:all')}</MenuItem>
          <MenuItem value="pending">{t('bookings:statuses.pending')}</MenuItem>
          <MenuItem value="confirmed">{t('bookings:statuses.confirmed')}</MenuItem>
          <MenuItem value="completed">{t('bookings:statuses.completed')}</MenuItem>
          <MenuItem value="cancelled">{t('bookings:statuses.cancelled')}</MenuItem>
          <MenuItem value="no_show">{t('bookings:statuses.no_show')}</MenuItem>
        </TextField>
      </DataTableToolbar>

      {error ? (
        <ErrorState
          title={t('common:error_loading')}
          description={t('common:error_loading_description')}
          onRetry={refetch}
          retryLabel={t('common:retry')}
        />
      ) : !isLoading && data?.data.length === 0 ? (
        <EmptyState title={t('bookings:no_bookings')} />
      ) : (
        <BookingTable
          data={data?.data ?? []}
          total={data?.pagination?.total ?? 0}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          isLoading={isLoading}
          onView={(id) => setViewId(id)}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

      <BookingDetailDialog
        booking={bookingDetail?.data ?? null}
        open={!!viewId}
        onClose={() => setViewId(null)}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={isUpdating}
      />

      <ConfirmDialog
        open={!!deleteId}
        title={t('common:confirm_delete')}
        description={t('bookings:confirm_delete')}
        confirmLabel={t('common:delete')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </Box>
  );
}
