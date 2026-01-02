import { useState } from 'react';
import { Box, Button, FormControlLabel, Switch } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { DataTableToolbar } from '@/shared/components/DataTableToolbar';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { usePagination } from '@/shared/hooks/usePagination';
import { useNotification } from '@/shared/hooks/useNotification';
import { AppointmentTable } from '../components/AppointmentTable';
import {
  useGetAppointmentsQuery,
  useDeleteAppointmentMutation,
} from '../appointments.api';

export default function AppointmentsListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['appointments', 'common']);
  const notification = useNotification();
  const { paginationModel, onPaginationModelChange } = usePagination();
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error, refetch } = useGetAppointmentsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: debouncedSearch || undefined,
    is_active: activeOnly ? true : undefined,
  });

  const [deleteAppointment, { isLoading: isDeleting }] =
    useDeleteAppointmentMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAppointment(deleteId).unwrap();
      notification.success(t('appointments:deleted_success'));
      setDeleteId(null);
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  return (
    <Box>
      <PageHeader
        title={t('appointments:title')}
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/appointments/create')}
          >
            {t('appointments:add_appointment')}
          </Button>
        }
      />

      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder={t('appointments:search_placeholder')}
      >
        <FormControlLabel
          control={
            <Switch
              checked={activeOnly}
              onChange={(_, checked) => setActiveOnly(checked)}
              size="small"
            />
          }
          label={t('appointments:filter_active')}
        />
      </DataTableToolbar>

      {error ? (
        <ErrorState
          title={t('common:error_loading')}
          description={t('common:error_loading_description')}
          onRetry={refetch}
          retryLabel={t('common:retry')}
        />
      ) : !isLoading && data?.data.length === 0 ? (
        <EmptyState
          title={t('appointments:no_appointments')}
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/appointments/create')}
            >
              {t('appointments:add_appointment')}
            </Button>
          }
        />
      ) : (
        <AppointmentTable
          data={data?.data ?? []}
          total={data?.pagination?.total ?? 0}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          isLoading={isLoading}
          onEdit={(id) => navigate(`/appointments/${id}/edit`)}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        title={t('common:confirm_delete_title')}
        message={t('appointments:confirm_delete')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
        confirmColor="error"
      />
    </Box>
  );
}
