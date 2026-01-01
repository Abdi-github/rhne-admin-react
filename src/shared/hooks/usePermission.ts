import { useAppSelector } from '@/app/hooks';

export function usePermission() {
  const { roles, permissions } = useAppSelector((state) => state.auth);
  const isSuperAdmin = roles.includes('super_admin');

  const hasRole = (required: string | string[]) => {
    const arr = Array.isArray(required) ? required : [required];
    return arr.some((r) => roles.includes(r));
  };

  const hasPermission = (required: string) => {
    if (isSuperAdmin) return true;
    return permissions.includes(required);
  };

  return { hasRole, hasPermission, isSuperAdmin, roles, permissions };
}
