import { useMemo, useState } from 'react';
import {
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { useChangePasswordMutation } from '../settings.api';
import { useNotification } from '@/shared/hooks/useNotification';
import { passwordSchema } from '@/shared/utils/validators';

function createChangePasswordSchema(t: TFunction) {
  return z
    .object({
      current_password: z.string().min(1, t('common:validation.required')),
      new_password: passwordSchema,
      confirm_password: z.string().min(1, t('common:validation.required')),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: t('common:validation.password_mismatch'),
      path: ['confirm_password'],
    });
}

type ChangePasswordValues = z.infer<ReturnType<typeof createChangePasswordSchema>>;

export function PasswordChangeForm() {
  const { t } = useTranslation(['settings', 'common']);
  const notification = useNotification();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const changePasswordSchema = useMemo(() => createChangePasswordSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (values: ChangePasswordValues) => {
    try {
      await changePassword(values).unwrap();
      notification.success(t('password.change_success'));
      reset();
    } catch {
      notification.error(t('password.change_error'));
    }
  };

  return (
    <Card>
      <CardHeader title={t('password.title')} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <Controller
              name="current_password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type={showCurrent ? 'text' : 'password'}
                  label={t('password.current_password')}
                  error={!!errors.current_password}
                  helperText={errors.current_password?.message}
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowCurrent(!showCurrent)}
                            edge="end"
                            size="small"
                          >
                            {showCurrent ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
            <Controller
              name="new_password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type={showNew ? 'text' : 'password'}
                  label={t('password.new_password')}
                  error={!!errors.new_password}
                  helperText={errors.new_password?.message}
                  fullWidth
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNew(!showNew)}
                            edge="end"
                            size="small"
                          >
                            {showNew ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
            <Controller
              name="confirm_password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label={t('password.confirm_password')}
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password?.message}
                  fullWidth
                />
              )}
            />
            <Typography variant="caption" color="text.secondary">
              {t('password.requirements')}
            </Typography>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{ alignSelf: 'flex-start' }}
            >
              {t('password.title')}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
