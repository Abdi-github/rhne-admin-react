import { Box, Typography, Button } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel,
}: ErrorStateProps) {
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
      <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title ?? t('error_loading')}
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
        {description ?? t('error_loading_description')}
      </Typography>
      {onRetry && (
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRetry}
        >
          {retryLabel ?? t('retry')}
        </Button>
      )}
    </Box>
  );
}
