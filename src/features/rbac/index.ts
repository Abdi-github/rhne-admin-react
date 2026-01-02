export { RoleTable } from './components/RoleTable';
export { RoleForm } from './components/RoleForm';
export { PermissionTable } from './components/PermissionTable';
export { RolePermissionsEditor } from './components/RolePermissionsEditor';

export type {
  Role,
  Permission,
  RoleWithPermissions,
  CreateRolePayload,
  UpdateRolePayload,
  AssignPermissionsPayload,
  RoleFilters,
  PermissionFilters,
} from './rbac.types';

export {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsQuery,
  useAssignPermissionsMutation,
} from './rbac.api';
