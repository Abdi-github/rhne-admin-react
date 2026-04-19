import { useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  Button,
  Stack,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
  Chip,
  Typography,
  Box,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

function createLoginSchema(t: TFunction) {
  return z.object({
    email: z.string().email(t('common:validation.email_invalid')).min(1, t('common:validation.email_required')),
    password: z.string().min(1, t('common:validation.password_required')),
  });
}

type LoginFormData = z.infer<typeof loginSchema>;

const DEMO_ACCOUNTS = [
  { label: 'Super Admin', email: 'superadmin@rhne-clone.ch', password: 'SuperAdmin123!' },
  { label: 'Admin', email: 'admin@rhne-clone.ch', password: 'Admin123!' },
  { label: 'Content Editor', email: 'editor@rhne-clone.ch', password: 'Editor123!' },
  { label: 'HR Manager', email: 'hr@rhne-clone.ch', password: 'HrManager123!' },
  { label: 'Site Manager', email: 'site.pourtales@rhne-clone.ch', password: 'Manager123!' },
] as const;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading: boolean;
  error?: string | null;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const { t } = useTranslation(['auth', 'common']);
  const [showPassword, setShowPassword] = useState(false);
  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('email')}
              type="email"
              fullWidth
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('password')}
              type={showPassword ? 'text' : 'password'}
              fullWidth
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      aria-label={showPassword ? t('common:hide_password') : t('common:show_password')}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isLoading}
          sx={{ py: 1.5 }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            t('login_button')
          )}
        </Button>

        <Divider>
          <Typography variant="caption" color="text.secondary">Demo Accounts</Typography>
        </Divider>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          {DEMO_ACCOUNTS.map((account) => (
            <Chip
              key={account.email}
              label={account.label}
              variant="outlined"
              size="small"
              onClick={() => {
                setValue('email', account.email, { shouldValidate: true });
                setValue('password', account.password, { shouldValidate: true });
              }}
              clickable
            />
          ))}
        </Box>
      </Stack>
    </form>
  );
}
