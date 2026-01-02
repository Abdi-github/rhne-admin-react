import { useState } from 'react';
import { Box, Button, CircularProgress, Stack } from '@mui/material';
import { ArrowBack, ManageAccounts } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorState } from '@/shared/components/ErrorState';
import { useNotification } from '@/shared/hooks/useNotification';
import { UserForm, type UserFormValues } from '../components/UserForm';
import { RoleAssignmentDialog } from '../components/RoleAssignmentDialog';
import { useGetUserByIdQuery, useUpdateUserMutation, useAssignRolesMutation } from '../users.api';
import { useGetRolesQuery } from '@/features/rbac/rbac.api';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['users', 'common']);
  const notification = useNotification();
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);

  const { data, isLoading: isFetching, error } = useGetUserByIdQuery(id!);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [assignRoles, { isLoading: isAssigning }] = useAssignRolesMutation();
  const { data: rolesData, isLoading: isRolesLoading } = useGetRolesQuery({ limit: 50 });

  const user = data?.data;

  const handleSubmit = async (values: UserFormValues) => {
    try {
      const payload = { ...values };
      if (!payload.password) {
        delete (payload as Record<string, unknown>).password;
      }
      await updateUser({ id: id!, body: payload }).unwrap();
      notification.success(t('users:updated_success'));
      navigate('/users');
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  const handleAssignRoles = async (roleIds: string[]) => {
    try {
      await assignRoles({ id: id!, body: { role_ids: roleIds } }).unwrap();
      notification.success(t('users:roles_assigned_success'));
      setRoleDialogOpen(false);
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  if (isFetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <ErrorState
        title={t('common:error_loading')}
        description={t('common:error_loading_description')}
      />
    );
  }

  if (!user) return null;

  return (
    <Box>
      <PageHeader
        title={t('users:edit_user')}
        subtitle={`${user.first_name} ${user.last_name}`}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<ManageAccounts />}
              onClick={() => setRoleDialogOpen(true)}
            >
              {t('users:assign_roles')}
            </Button>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/users')}
            >
              {t('common:back')}
            </Button>
          </Stack>
        }
      />
      <UserForm
        defaultValues={{
          email: user.email,
          password: '',
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          preferred_language: user.preferred_language,
          user_type: user.user_type,
          site_id: typeof user.site_id === 'object' && user.site_id ? user.site_id._id : null,
          avatar_url: user.avatar_url,
          is_active: user.is_active,
          is_verified: user.is_verified,
        }}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
        isEdit
      />

      <RoleAssignmentDialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
        onAssign={handleAssignRoles}
        currentRoleIds={user.roles.map((r) => r._id)}
        availableRoles={rolesData?.data ?? []}
        isLoading={isAssigning}
        isRolesLoading={isRolesLoading}
        userName={`${user.first_name} ${user.last_name}`}
      />
    </Box>
  );
}
