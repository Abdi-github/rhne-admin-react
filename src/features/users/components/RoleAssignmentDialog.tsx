import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { UserRole } from '../users.types';

interface RoleAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  onAssign: (roleIds: string[]) => void;
  currentRoleIds: string[];
  availableRoles: UserRole[];
  isLoading?: boolean;
  isRolesLoading?: boolean;
  userName?: string;
}

export function RoleAssignmentDialog({
  open,
  onClose,
  onAssign,
  currentRoleIds,
  availableRoles,
  isLoading,
  isRolesLoading,
  userName,
}: RoleAssignmentDialogProps) {
  const { t } = useTranslation(['users', 'common']);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentRoleIds);

  useEffect(() => {
    setSelectedRoles(currentRoleIds);
  }, [currentRoleIds, open]);

  const handleToggle = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId],
    );
  };

  const handleSubmit = () => {
    onAssign(selectedRoles);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {t('users:assign_roles')}
        {userName && (
          <Typography variant="body2" color="text.secondary">
            {userName}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('users:assign_roles_description')}
        </Typography>
        {isRolesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <List dense>
            {availableRoles.map((role) => (
              <ListItem key={role._id} disablePadding>
                <ListItemButton onClick={() => handleToggle(role._id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedRoles.includes(role._id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={role.display_name.fr}
                    secondary={role.name}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common:cancel')}</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading || selectedRoles.length === 0}
        >
          {t('users:assign_roles')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
