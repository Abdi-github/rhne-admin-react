import { Box, Typography, Button, Paper } from '@mui/material';
import { SearchOff, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 400,
        p: 3,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
        <SearchOff sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h3" fontWeight={700} color="text.secondary" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          {t('not_found')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t('not_found_description')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Home />}
          onClick={() => navigate('/')}
        >
          {t('go_home')}
        </Button>
      </Paper>
    </Box>
  );
}
