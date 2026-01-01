import { useNavigate, useSearchParams } from 'react-router-dom';
import { Typography, Link as MuiLink, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useResetPasswordMutation } from '../auth.api';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { useNotification } from '@/shared/hooks/useNotification';

export default function ResetPasswordPage() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const { success: notifySuccess } = useNotification();

  const handleSubmit = async (data: { password: string }) => {
    try {
      await resetPassword({ token, password: data.password }).unwrap();
      notifySuccess(t('password_reset_success'));
      navigate('/login', { replace: true });
    } catch {
      // Error handled by RTK Query
    }
  };

  const errorMessage = error ? t('error_generic', { ns: 'common' }) : null;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {t('reset_password_title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {t('reset_password_subtitle')}
      </Typography>

      <ResetPasswordForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
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
