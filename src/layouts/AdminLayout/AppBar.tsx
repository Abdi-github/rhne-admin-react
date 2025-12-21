import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import { Menu as MenuIcon, Logout, Person } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/shared/state/authSlice';
import { setLanguage } from '@/shared/state/uiSlice';
import { useLogoutMutation } from '@/features/auth/auth.api';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import type { SupportedLanguage } from '@/shared/types/common.types';

interface AppBarProps {
  drawerWidth: number;
  onMenuToggle: () => void;
}

export function AppBar({ drawerWidth, onMenuToggle }: AppBarProps) {
  const { t, i18n } = useTranslation(['auth', 'common']);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const language = useAppSelector((state) => state.ui.language);
  const [logoutApi] = useLogoutMutation();
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    if (refreshToken) {
      try {
        await logoutApi({ refresh_token: refreshToken }).unwrap();
      } catch {
        // Continue with local logout even if API fails
      }
    }
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    const lang = event.target.value as SupportedLanguage;
    dispatch(setLanguage(lang));
    i18n.changeLanguage(lang);
  };

  const handleSettings = () => {
    handleMenuClose();
    navigate('/settings');
  };

  return (
    <MuiAppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
          aria-label={t('common:nav.menu')}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {user && t('auth:welcome', { name: user.first_name })}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Select
            value={language}
            onChange={handleLanguageChange}
            size="small"
            variant="outlined"
            aria-label={t('common:language')}
            sx={{ minWidth: 70, '& .MuiSelect-select': { py: 0.5 } }}
          >
            <MenuItem value="fr">FR</MenuItem>
            <MenuItem value="en">EN</MenuItem>
            <MenuItem value="de">DE</MenuItem>
            <MenuItem value="it">IT</MenuItem>
          </Select>

          <ThemeToggle />

          <IconButton onClick={handleMenuOpen} size="small" aria-label={t('common:nav.user_menu')}>
            <Avatar
              src={user?.avatar_url ?? undefined}
              alt={user ? `${user.first_name} ${user.last_name}` : ''}
              sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
            >
              {user?.first_name?.[0]}
              {user?.last_name?.[0]}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleSettings}>
            <ListItemIcon>
              <Person fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('common:nav.settings')}</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t('auth:logout')}</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </MuiAppBar>
  );
}
