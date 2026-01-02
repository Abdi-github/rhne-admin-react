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
import { ServiceTable } from '../components/ServiceTable';
import { useGetServicesQuery, useDeleteServiceMutation } from '../services.api';

export default function ServicesListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['services', 'common']);
  const notification = useNotification();
  const { paginationModel, onPaginationModelChange } = usePagination();
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error, refetch } = useGetServicesQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: debouncedSearch || undefined,
    is_active: activeOnly ? 'true' : undefined,
  });

  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteService(deleteId).unwrap();
      notification.success(t('services:deleted_success'));
      setDeleteId(null);
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  return (
    <Box>
      <PageHeader
        title={t('services:title')}
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/services/create')}
          >
            {t('services:add_service')}
          </Button>
        }
      />

      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder={t('services:search_placeholder')}
      >
        <FormControlLabel
          control={
            <Switch
              checked={activeOnly}
              onChange={(_, checked) => setActiveOnly(checked)}
              size="small"
            />
          }
          label={t('services:filter_active')}
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
          title={t('services:no_services')}
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/services/create')}
            >
              {t('services:add_service')}
            </Button>
          }
        />
      ) : (
        <ServiceTable
          data={data?.data ?? []}
          total={data?.pagination?.total ?? 0}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          isLoading={isLoading}
          onView={(id) => navigate(`/services/${id}`)}
          onEdit={(id) => navigate(`/services/${id}/edit`)}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        title={t('common:confirm_delete_title')}
        message={t('services:confirm_delete')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
        confirmColor="error"
      />
    </Box>
  );
}
