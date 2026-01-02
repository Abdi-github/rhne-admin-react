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
import { SiteTable } from '../components/SiteTable';
import { useGetSitesQuery, useDeleteSiteMutation } from '../sites.api';

export default function SitesListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['sites', 'common']);
  const notification = useNotification();
  const { paginationModel, onPaginationModelChange } = usePagination();
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error, refetch } = useGetSitesQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: debouncedSearch || undefined,
    is_active: activeOnly ? 'true' : undefined,
  });

  const [deleteSite, { isLoading: isDeleting }] = useDeleteSiteMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSite(deleteId).unwrap();
      notification.success(t('sites:deleted_success'));
      setDeleteId(null);
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  return (
    <Box>
      <PageHeader
        title={t('sites:title')}
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/sites/create')}
          >
            {t('sites:add_site')}
          </Button>
        }
      />

      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder={t('sites:search_placeholder')}
      >
        <FormControlLabel
          control={
            <Switch
              checked={activeOnly}
              onChange={(_, checked) => setActiveOnly(checked)}
              size="small"
            />
          }
          label={t('sites:filter_active')}
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
          title={t('sites:no_sites')}
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/sites/create')}
            >
              {t('sites:add_site')}
            </Button>
          }
        />
      ) : (
        <SiteTable
          data={data?.data ?? []}
          total={data?.pagination?.total ?? 0}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          isLoading={isLoading}
          onEdit={(id) => navigate(`/sites/${id}/edit`)}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        title={t('common:confirm_delete_title')}
        message={t('sites:confirm_delete')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
        confirmColor="error"
      />
    </Box>
  );
}
