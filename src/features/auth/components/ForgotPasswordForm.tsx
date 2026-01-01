import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Button, Stack, Alert, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

function createSchema(t: TFunction) {
  return z.object({
    email: z.string().email(t('common:validation.email_invalid')).min(1, t('common:validation.email_required')),
  });
}

type ForgotPasswordFormData = z.infer<ReturnType<typeof createSchema>>;

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => void;
  isLoading: boolean;
  success?: boolean;
  error?: string | null;
}

export function ForgotPasswordForm({
  onSubmit,
  isLoading,
  success,
  error,
}: ForgotPasswordFormProps) {
  const { t } = useTranslation(['auth', 'common']);
  const schema = useMemo(() => createSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{t('reset_email_sent')}</Alert>}

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
            t('send_reset_link')
          )}
        </Button>
      </Stack>
    </form>
  );
}
