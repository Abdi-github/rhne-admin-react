import { Typography, Link as MuiLink, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForgotPasswordMutation } from '../auth.api';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const { t } = useTranslation('auth');
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: { email: string }) => {
    try {
      await forgotPassword(data).unwrap();
      setSuccess(true);
    } catch {
      // Error handled by RTK Query
    }
  };

  const errorMessage = error ? t('error_generic', { ns: 'common' }) : null;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {t('forgot_password_title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {t('forgot_password_subtitle')}
      </Typography>

      <ForgotPasswordForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        success={success}
        error={errorMessage}
      />

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <MuiLink component={Link} to="/login" variant="body2">
          {t('back_to_login')}
        </MuiLink>
      </Box>
    </Box>
  );
}
