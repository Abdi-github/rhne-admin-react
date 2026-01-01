import { useNavigate } from 'react-router-dom';
import { Typography, Link as MuiLink, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '@/shared/state/authSlice';
import { useLoginMutation } from '../auth.api';
import { LoginForm } from '../components/LoginForm';
import type { LoginPayload } from '../auth.types';

export default function LoginPage() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (data: LoginPayload) => {
    try {
      const result = await login(data).unwrap();
      dispatch(
        setCredentials({
          user: result.data.user,
          tokens: result.data.tokens,
        }),
      );
      navigate('/', { replace: true });
    } catch {
      // Error is handled by RTK Query
    }
  };

  const errorMessage = error
    ? 'status' in error && error.status === 401
      ? t('login_error')
      : t('login_error')
    : null;

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {t('login_title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {t('login_subtitle')}
      </Typography>

      <LoginForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={errorMessage}
      />

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <MuiLink component={Link} to="/forgot-password" variant="body2">
          {t('forgot_password')}
        </MuiLink>
      </Box>
    </Box>
  );
}
