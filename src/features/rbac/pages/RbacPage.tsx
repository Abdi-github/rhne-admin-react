import { useState } from 'react';
import { Box, Button, Tabs, Tab, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { DataTableToolbar } from '@/shared/components/DataTableToolbar';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { EmptyState } from '@/shared/components/EmptyState';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { usePagination } from '@/shared/hooks/usePagination';
import { useNotification } from '@/shared/hooks/useNotification';
import { RoleTable } from '../components/RoleTable';
import { RoleForm, type RoleFormValues } from '../components/RoleForm';
import { PermissionTable } from '../components/PermissionTable';
import { RolePermissionsEditor } from '../components/RolePermissionsEditor';
import {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsQuery,
  useAssignPermissionsMutation,
} from '../rbac.api';
import type { Role } from '../rbac.types';

export default function RbacPage() {
  const { t } = useTranslation(['rbac', 'common']);
  const notification = useNotification();
  const { paginationModel: rolesPagination, onPaginationModelChange: onRolesPaginationChange } = usePagination();
  const { paginationModel: permsPagination, onPaginationModelChange: onPermsPaginationChange } = usePagination();

  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [permSearch, setPermSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const debouncedPermSearch = useDebounce(permSearch, 300);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [permEditorRoleId, setPermEditorRoleId] = useState<string | null>(null);

  const { data: rolesData, isLoading: isRolesLoading } = useGetRolesQuery({
    page: rolesPagination.page + 1,
    limit: rolesPagination.pageSize,
    search: debouncedSearch || undefined,
  });

  const { data: permsData, isLoading: isPermsLoading } = useGetPermissionsQuery({
    page: permsPagination.page + 1,
    limit: permsPagination.pageSize,
    search: debouncedPermSearch || undefined,
  });

  const { data: allPermsData, isLoading: isAllPermsLoading } = useGetPermissionsQuery(
    { limit: 200 },
    { skip: !permEditorRoleId },
  );

  const { data: roleDetailData } = useGetRoleByIdQuery(permEditorRoleId!, {
    skip: !permEditorRoleId,
  });

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation();
  const [assignPerms, { isLoading: isAssigning }] = useAssignPermissionsMutation();

  const handleCreate = async (values: RoleFormValues) => {
    try {
      await createRole(values).unwrap();
      notification.success(t('rbac:created_success'));
      setCreateDialogOpen(false);
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  const handleUpdate = async (values: RoleFormValues) => {
    if (!editRole) return;
    try {
      await updateRole({ id: editRole._id, body: values }).unwrap();
      notification.success(t('rbac:updated_success'));
      setEditRole(null);
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRole(deleteId).unwrap();
      notification.success(t('rbac:deleted_success'));
      setDeleteId(null);
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  const handleAssignPermissions = async (permissionIds: string[]) => {
    if (!permEditorRoleId) return;
    try {
      await assignPerms({ id: permEditorRoleId, body: { permission_ids: permissionIds } }).unwrap();
      notification.success(t('rbac:permissions_assigned_success'));
      setPermEditorRoleId(null);
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  const handleEdit = (id: string) => {
    const role = rolesData?.data.find((r) => r._id === id);
    if (role) setEditRole(role);
  };

  return (
    <Box>
      <PageHeader
        title={t('rbac:title')}
        action={
          tab === 0 ? (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateDialogOpen(true)}
            >
              {t('rbac:add_role')}
            </Button>
          ) : undefined
        }
      />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label={t('rbac:roles_tab')} />
        <Tab label={t('rbac:permissions_tab')} />
      </Tabs>

      {tab === 0 && (
        <>
          <DataTableToolbar
            search={search}
            onSearchChange={setSearch}
            placeholder={t('rbac:search_roles')}
          />
          {!isRolesLoading && rolesData?.data.length === 0 ? (
            <EmptyState title={t('rbac:no_roles')} />
          ) : (
            <RoleTable
              data={rolesData?.data ?? []}
              total={rolesData?.pagination?.total ?? 0}
              paginationModel={rolesPagination}
              onPaginationModelChange={onRolesPaginationChange}
              isLoading={isRolesLoading}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
              onManagePermissions={(id) => setPermEditorRoleId(id)}
            />
          )}
        </>
      )}

      {tab === 1 && (
        <>
          <DataTableToolbar
            search={permSearch}
            onSearchChange={setPermSearch}
            placeholder={t('rbac:search_permissions')}
          />
          {!isPermsLoading && permsData?.data.length === 0 ? (
            <EmptyState title={t('rbac:no_permissions')} />
          ) : (
            <PermissionTable
              data={permsData?.data ?? []}
              total={permsData?.pagination?.total ?? 0}
              paginationModel={permsPagination}
              onPaginationModelChange={onPermsPaginationChange}
              isLoading={isPermsLoading}
            />
          )}
        </>
      )}

      {/* Create Role Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{t('rbac:create_role')}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <RoleForm onSubmit={handleCreate} isLoading={isCreating} />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={!!editRole} onClose={() => setEditRole(null)} maxWidth="md" fullWidth>
        <DialogTitle>{t('rbac:edit_role')}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {editRole && (
              <RoleForm
                defaultValues={{
                  name: editRole.name,
                  display_name: editRole.display_name,
                  description: editRole.description,
                  is_active: editRole.is_active,
                }}
                onSubmit={handleUpdate}
                isLoading={isUpdating}
                isEdit
              />
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Permissions Editor */}
      <RolePermissionsEditor
        open={!!permEditorRoleId}
        onClose={() => setPermEditorRoleId(null)}
        onSave={handleAssignPermissions}
        currentPermissionIds={roleDetailData?.data?.permissions?.map((p) => p._id) ?? []}
        permissions={allPermsData?.data ?? []}
        isLoading={isAssigning}
        isPermissionsLoading={isAllPermsLoading}
        roleName={rolesData?.data.find((r) => r._id === permEditorRoleId)?.display_name.fr}
      />

      <ConfirmDialog
        open={!!deleteId}
        title={t('common:confirm_delete_title')}
        message={t('rbac:confirm_delete')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
        confirmColor="error"
      />
    </Box>
  );
}
