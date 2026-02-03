import { Box, Typography } from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  const { t } = useTranslation('common');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
      }}
    >
      {icon ?? (
        <InboxOutlined sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
      )}
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title ?? t('no_data')}
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
        {description ?? t('no_items_found')}
      </Typography>
      {action}
    </Box>
  );
}
