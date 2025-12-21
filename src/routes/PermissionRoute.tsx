import { Navigate } from 'react-router-dom';
import { usePermission } from '@/shared/hooks/usePermission';
import type { ReactNode } from 'react';

interface PermissionRouteProps {
  children: ReactNode;
  roles?: string[];
  permission?: string;
  redirectTo?: string;
}

export function PermissionRoute({
  children,
  roles,
  permission,
  redirectTo = '/',
}: PermissionRouteProps) {
  const { hasRole, hasPermission } = usePermission();
  // TODO: maybe log which permission check failed for easier debugging in dev

  if (roles && !hasRole(roles)) {
    return <Navigate to={redirectTo} replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
