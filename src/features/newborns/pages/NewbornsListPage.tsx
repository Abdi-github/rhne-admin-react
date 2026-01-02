import { useState } from 'react';
import { Box, Button } from '@mui/material';
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
import { NewbornTable } from '../components/NewbornTable';
import { useGetNewbornsQuery, useDeleteNewbornMutation } from '../newborns.api';

export default function NewbornsListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['newborns', 'common']);
  const notification = useNotification();
  const { paginationModel, onPaginationModelChange } = usePagination();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error, refetch } = useGetNewbornsQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: debouncedSearch || undefined,
  });

  const [deleteNewborn, { isLoading: isDeleting }] = useDeleteNewbornMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteNewborn(deleteId).unwrap();
      notification.success(t('newborns:deleted_success'));
      setDeleteId(null);
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  return (
    <Box>
      <PageHeader
        title={t('newborns:title')}
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/newborns/create')}
          >
            {t('newborns:add_newborn')}
          </Button>
        }
      />

      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder={t('newborns:search_placeholder')}
      />

      {error ? (
        <ErrorState
          title={t('common:error_loading')}
          description={t('common:error_loading_description')}
          onRetry={refetch}
          retryLabel={t('common:retry')}
        />
      ) : !isLoading && data?.data.length === 0 ? (
        <EmptyState
          title={t('newborns:no_newborns')}
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/newborns/create')}
            >
              {t('newborns:add_newborn')}
            </Button>
          }
        />
      ) : (
        <NewbornTable
          data={data?.data ?? []}
          total={data?.pagination?.total ?? 0}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          isLoading={isLoading}
          onEdit={(id) => navigate(`/newborns/${id}/edit`)}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        title={t('common:confirm_delete_title')}
        message={t('newborns:confirm_delete')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
        confirmColor="error"
      />
    </Box>
  );
}
