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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

function createSchema(t: TFunction) {
  return z
    .object({
      password: z
        .string()
        .min(8, t('common:validation.password_min'))
        .regex(/[A-Z]/, t('common:validation.password_uppercase'))
        .regex(/[a-z]/, t('common:validation.password_lowercase'))
        .regex(/\d/, t('common:validation.password_digit'))
        .regex(/[!@#$%^&*]/, t('common:validation.password_special')),
      confirmPassword: z.string().min(1, t('common:validation.password_confirm_required')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('common:validation.password_mismatch'),
      path: ['confirmPassword'],
    });
}

type ResetPasswordFormData = z.infer<ReturnType<typeof createSchema>>;

interface ResetPasswordFormProps {
  onSubmit: (data: { password: string }) => void;
  isLoading: boolean;
  error?: string | null;
}

export function ResetPasswordForm({
  onSubmit,
  isLoading,
  error,
}: ResetPasswordFormProps) {
  const { t } = useTranslation(['auth', 'common']);
  const [showPassword, setShowPassword] = useState(false);
  const schema = useMemo(() => createSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const handleFormSubmit = (data: ResetPasswordFormData) => {
    onSubmit({ password: data.password });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('new_password')}
              type={showPassword ? 'text' : 'password'}
              fullWidth
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
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={t('confirm_password')}
              type={showPassword ? 'text' : 'password'}
              fullWidth
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              disabled={isLoading}
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
            t('reset_password_button')
          )}
        </Button>
      </Stack>
    </form>
  );
}
