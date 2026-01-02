import {
  Drawer,
  Box,
  Typography,
  Avatar,
  Chip,
  Stack,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { User } from '../users.types';

interface UserDetailDrawerProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

export function UserDetailDrawer({ user, open, onClose }: UserDetailDrawerProps) {
  const { t } = useTranslation(['users', 'common']);

  if (!user) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return t('users:never');
    return new Date(dateStr).toLocaleDateString('fr-CH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 380, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">{t('users:user_detail')}</Typography>
          <IconButton onClick={onClose} aria-label={t('common:close')}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={user.avatar_url || undefined}
            alt={`${user.first_name} ${user.last_name}`}
            sx={{ width: 80, height: 80, mb: 1 }}
          >
            {user.first_name.charAt(0)}{user.last_name.charAt(0)}
          </Avatar>
          <Typography variant="h6">
            {user.first_name} {user.last_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip
              label={user.is_active ? t('common:active') : t('common:inactive')}
              size="small"
              color={user.is_active ? 'success' : 'default'}
            />
            {user.is_verified && (
              <Chip label={t('users:is_verified')} size="small" color="info" />
            )}
          </Stack>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <List dense disablePadding>
          <ListItem disableGutters>
            <ListItemText
              primary={t('users:phone')}
              secondary={user.phone || '—'}
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={t('users:preferred_language')}
              secondary={user.preferred_language.toUpperCase()}
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={t('users:user_type')}
              secondary={t(`users:user_types.${user.user_type}`)}
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={t('users:site')}
              secondary={typeof user.site_id === 'object' && user.site_id ? user.site_id.name : '—'}
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          {t('users:roles')}
        </Typography>
        {user.roles.length > 0 ? (
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            {user.roles.map((role) => (
              <Chip key={role._id} label={role.display_name.fr} size="small" />
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('users:no_roles_assigned')}
          </Typography>
        )}

        <Divider sx={{ mb: 2 }} />

        <List dense disablePadding>
          <ListItem disableGutters>
            <ListItemText
              primary={t('users:last_login')}
              secondary={formatDate(user.last_login_at)}
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              primary={t('users:created_at')}
              secondary={formatDate(user.createdAt)}
            />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
