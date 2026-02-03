import { TextField, InputAdornment, Box, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';

interface DataTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  children?: ReactNode;
}

export function DataTableToolbar({
  search,
  onSearchChange,
  placeholder,
  children,
}: DataTableToolbarProps) {
  const { t } = useTranslation('common');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 2,
        flexWrap: 'wrap',
      }}
    >
      <TextField
        size="small"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder ?? t('search')}
        sx={{ minWidth: { xs: '100%', sm: 280 } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: search ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => onSearchChange('')}
                aria-label={t('clear_search')}
                edge="end"
              >
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
      {children}
    </Box>
  );
}
