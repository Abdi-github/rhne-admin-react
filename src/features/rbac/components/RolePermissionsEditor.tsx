import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { Permission } from '../rbac.types';

interface RolePermissionsEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (permissionIds: string[]) => void;
  currentPermissionIds: string[];
  permissions: Permission[];
  isLoading?: boolean;
  isPermissionsLoading?: boolean;
  roleName?: string;
}

export function RolePermissionsEditor({
  open,
  onClose,
  onSave,
  currentPermissionIds,
  permissions,
  isLoading,
  isPermissionsLoading,
  roleName,
}: RolePermissionsEditorProps) {
  const { t } = useTranslation(['rbac', 'common']);
  const [selectedIds, setSelectedIds] = useState<string[]>(currentPermissionIds);
  const [resourceFilter, setResourceFilter] = useState<string>('');

  useEffect(() => {
    setSelectedIds(currentPermissionIds);
  }, [currentPermissionIds, open]);

  const resources = useMemo(() => {
    const set = new Set(permissions.map((p) => p.resource));
    return Array.from(set).sort();
  }, [permissions]);

  const filteredPermissions = useMemo(() => {
    if (!resourceFilter) return permissions;
    return permissions.filter((p) => p.resource === resourceFilter);
  }, [permissions, resourceFilter]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleToggleAll = () => {
    const filteredIds = filteredPermissions.map((p) => p._id);
    const allSelected = filteredIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...filteredIds])]);
    }
  };

  const allFilteredSelected = filteredPermissions.length > 0 &&
    filteredPermissions.every((p) => selectedIds.includes(p._id));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {t('rbac:manage_permissions')}
        {roleName && (
          <Typography variant="body2" color="text.secondary">
            {roleName}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('rbac:assign_permissions_description')}
        </Typography>

        <TextField
          select
          label={t('rbac:resource')}
          value={resourceFilter}
          onChange={(e) => setResourceFilter(e.target.value)}
          size="small"
          sx={{ mb: 2, minWidth: 200 }}
        >
          <MenuItem value="">{t('rbac:all_resources')}</MenuItem>
          {resources.map((r) => (
            <MenuItem key={r} value={r}>{r}</MenuItem>
          ))}
        </TextField>

        {isPermissionsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={allFilteredSelected}
                      indeterminate={
                        filteredPermissions.some((p) => selectedIds.includes(p._id)) &&
                        !allFilteredSelected
                      }
                      onChange={handleToggleAll}
                    />
                  </TableCell>
                  <TableCell>{t('rbac:permission_name')}</TableCell>
                  <TableCell>{t('rbac:resource')}</TableCell>
                  <TableCell>{t('rbac:action')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPermissions.map((perm) => (
                  <TableRow key={perm._id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(perm._id)}
                        onChange={() => handleToggle(perm._id)}
                      />
                    </TableCell>
                    <TableCell>{perm.display_name}</TableCell>
                    <TableCell>{perm.resource}</TableCell>
                    <TableCell>{t(`rbac:actions.${perm.action}`)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common:cancel')}</Button>
        <Button
          onClick={() => onSave(selectedIds)}
          variant="contained"
          disabled={isLoading}
        >
          {t('common:save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
