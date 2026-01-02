import { useEffect } from 'react';
import {
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useUpdateProfileMutation } from '../settings.api';
import { useNotification } from '@/shared/hooks/useNotification';
import { useAppDispatch } from '@/app/hooks';
import { updateUser } from '@/shared/state/authSlice';
import type { Profile, UpdateProfilePayload } from '../settings.types';
import type { SupportedLanguage } from '@/shared/types/common.types';

const LANGUAGES: { value: SupportedLanguage; label: string }[] = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
];

const profileSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  phone: z.string().optional().default(''),
  preferred_language: z.enum(['fr', 'en', 'de', 'it']),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const { t } = useTranslation('settings');
  const dispatch = useAppDispatch();
  const notification = useNotification();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone ?? '',
      preferred_language: profile.preferred_language,
    },
  });

  useEffect(() => {
    reset({
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone ?? '',
      preferred_language: profile.preferred_language,
    });
  }, [profile, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      const payload: UpdateProfilePayload = {
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone || undefined,
        preferred_language: values.preferred_language,
      };
      await updateProfile(payload).unwrap();
      dispatch(
        updateUser({
          first_name: values.first_name,
          last_name: values.last_name,
        }),
      );
      notification.success(t('profile.update_success'));
    } catch {
      notification.error(t('profile.update_error'));
    }
  };

  return (
    <Card>
      <CardHeader title={t('profile.title')} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <TextField
              label={t('profile.email')}
              value={profile.email}
              disabled
              fullWidth
            />
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('profile.first_name')}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('profile.last_name')}
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('profile.phone')}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="preferred_language"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label={t('profile.preferred_language')}
                  fullWidth
                >
                  {LANGUAGES.map((lang) => (
                    <MenuItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !isDirty}
              sx={{ alignSelf: 'flex-start' }}
            >
              {t('common:save')}
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
