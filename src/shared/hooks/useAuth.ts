import { useAppSelector } from '@/app/hooks';

export function useAuth() {
  const { user, isAuthenticated, roles, permissions } = useAppSelector(
    (state) => state.auth,
  );

  return {
    user,
    isAuthenticated,
    roles,
    permissions,
    isSuperAdmin: roles.includes('super_admin'),
    isAdmin: roles.includes('admin'),
  };
}
