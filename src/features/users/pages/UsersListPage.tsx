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
import { UserTable } from '../components/UserTable';
import { UserDetailDrawer } from '../components/UserDetailDrawer';
import { RoleAssignmentDialog } from '../components/RoleAssignmentDialog';
import { useGetUsersQuery, useDeleteUserMutation, useAssignRolesMutation } from '../users.api';
import { useGetRolesQuery } from '@/features/rbac/rbac.api';
import type { User } from '../users.types';

export default function UsersListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['users', 'common']);
  const notification = useNotification();
  const { paginationModel, onPaginationModelChange } = usePagination();
  const [search, setSearch] = useState('');
  const [activeOnly, setActiveOnly] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [roleAssignUser, setRoleAssignUser] = useState<User | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, error, refetch } = useGetUsersQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize,
    search: debouncedSearch || undefined,
    is_active: activeOnly ? 'true' : undefined,
  });

  const { data: rolesData, isLoading: isRolesLoading } = useGetRolesQuery({ limit: 50 });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [assignRoles, { isLoading: isAssigning }] = useAssignRolesMutation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUser(deleteId).unwrap();
      notification.success(t('users:deleted_success'));
      setDeleteId(null);
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  const handleAssignRoles = async (roleIds: string[]) => {
    if (!roleAssignUser) return;
    try {
      await assignRoles({ id: roleAssignUser._id, body: { role_ids: roleIds } }).unwrap();
      notification.success(t('users:roles_assigned_success'));
      setRoleAssignUser(null);
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  const handleView = (id: string) => {
    const user = data?.data.find((u) => u._id === id);
    if (user) setDetailUser(user);
  };

  return (
    <Box>
      <PageHeader
        title={t('users:title')}
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/users/create')}
          >
            {t('users:add_user')}
          </Button>
        }
      />

      <DataTableToolbar
        search={search}
        onSearchChange={setSearch}
        placeholder={t('users:search_placeholder')}
      >
        <FormControlLabel
          control={
            <Switch
              checked={activeOnly}
              onChange={(_, checked) => setActiveOnly(checked)}
              size="small"
            />
          }
          label={t('users:filter_active')}
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
          title={t('users:no_users')}
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/users/create')}
            >
              {t('users:add_user')}
            </Button>
          }
        />
      ) : (
        <UserTable
          data={data?.data ?? []}
          total={data?.pagination?.total ?? 0}
          paginationModel={paginationModel}
          onPaginationModelChange={onPaginationModelChange}
          isLoading={isLoading}
          onView={handleView}
          onEdit={(id) => navigate(`/users/${id}`)}
          onDelete={(id) => setDeleteId(id)}
        />
      )}

      <UserDetailDrawer
        user={detailUser}
        open={!!detailUser}
        onClose={() => setDetailUser(null)}
      />

      <RoleAssignmentDialog
        open={!!roleAssignUser}
        onClose={() => setRoleAssignUser(null)}
        onAssign={handleAssignRoles}
        currentRoleIds={roleAssignUser?.roles.map((r) => r._id) ?? []}
        availableRoles={rolesData?.data ?? []}
        isLoading={isAssigning}
        isRolesLoading={isRolesLoading}
        userName={roleAssignUser ? `${roleAssignUser.first_name} ${roleAssignUser.last_name}` : undefined}
      />

      <ConfirmDialog
        open={!!deleteId}
        title={t('common:confirm_delete_title')}
        message={t('users:confirm_delete')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
        confirmColor="error"
      />
    </Box>
  );
}
