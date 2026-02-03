import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { toggleTheme } from '@/shared/state/uiSlice';

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.ui.themeMode);

  return (
    <Tooltip title={themeMode === 'light' ? 'Mode sombre' : 'Mode clair'}>
      <IconButton color="inherit" onClick={() => dispatch(toggleTheme())} aria-label={themeMode === 'light' ? 'Mode sombre' : 'Mode clair'}>
        {themeMode === 'light' ? <DarkMode /> : <LightMode />}
      </IconButton>
    </Tooltip>
  );
}
