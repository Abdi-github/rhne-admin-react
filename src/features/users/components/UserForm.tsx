import { useMemo } from 'react';
import {
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  CardHeader,
  Switch,
  FormControlLabel,
  MenuItem,
} from '@mui/material';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { ImageUpload } from '@/shared/components/ImageUpload';
import { useUploadImageMutation } from '@/shared/api/uploadsApi';
import { useGetSitesQuery } from '@/features/sites/sites.api';

const LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
] as const;

const USER_TYPES = ['admin', 'staff'] as const;

function createUserFormSchema(t: TFunction) {
  return z.object({
    email: z.string().email(t('common:validation.email_invalid')).min(1, t('common:validation.email_required')),
    password: z.string().min(8, t('common:validation.password_min')).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      t('common:validation.password_special'),
    ),
    first_name: z.string().min(1, t('common:validation.required')).max(100),
    last_name: z.string().min(1, t('common:validation.required')).max(100),
    phone: z.string().default(''),
    preferred_language: z.enum(['fr', 'en', 'de', 'it']).default('fr'),
    user_type: z.enum(['admin', 'staff']).default('staff'),
    site_id: z.string().nullable().default(null),
    avatar_url: z.string().nullable().default(null),
    is_active: z.boolean().default(true),
    is_verified: z.boolean().default(false),
  });
}

function createUserEditFormSchema(t: TFunction) {
  return createUserFormSchema(t).extend({
    password: z.string().min(8, t('common:validation.password_min')).regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      t('common:validation.password_special'),
    ).or(z.literal('')).default(''),
  });
}

export type UserFormValues = z.infer<ReturnType<typeof createUserFormSchema>>;

interface UserFormProps {
  defaultValues?: Partial<UserFormValues>;
  onSubmit: (values: UserFormValues) => void;
  isLoading: boolean;
  isEdit?: boolean;
}

export function UserForm({ defaultValues, onSubmit, isLoading, isEdit }: UserFormProps) {
  const { t } = useTranslation(['users', 'common']);
  const [uploadImage] = useUploadImageMutation();
  const schema = useMemo(() => isEdit ? createUserEditFormSchema(t) : createUserFormSchema(t), [t, isEdit]);

  const { data: sitesData } = useGetSitesQuery({ limit: 100 });
  const sites = sitesData?.data ?? [];

  const methods = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      phone: '',
      preferred_language: 'fr',
      user_type: 'staff',
      site_id: null,
      avatar_url: null,
      is_active: true,
      is_verified: false,
      ...defaultValues,
    },
  });

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const result = await uploadImage({ resource: 'users', body: formData }).unwrap();
    methods.setValue('avatar_url', result.data.url);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title={t('users:user_info')} />
            <CardContent>
              <Stack spacing={2.5}>
                <Controller
                  name="first_name"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('users:first_name')}
                      error={!!methods.formState.errors.first_name}
                      helperText={methods.formState.errors.first_name?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="last_name"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('users:last_name')}
                      error={!!methods.formState.errors.last_name}
                      helperText={methods.formState.errors.last_name?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="phone"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('users:phone')}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="preferred_language"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('users:preferred_language')}
                      select
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
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={t('users:account_info')} />
            <CardContent>
              <Stack spacing={2.5}>
                <Controller
                  name="email"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('users:email')}
                      type="email"
                      error={!!methods.formState.errors.email}
                      helperText={methods.formState.errors.email?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="password"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('users:password')}
                      type="password"
                      error={!!methods.formState.errors.password}
                      helperText={
                        methods.formState.errors.password?.message ||
                        (isEdit ? t('users:password_requirements') : undefined)
                      }
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="user_type"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('users:user_type')}
                      select
                      fullWidth
                    >
                      {USER_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {t(`users:user_types.${type}`)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Controller
                  name="site_id"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      label={t('users:site')}
                      select
                      fullWidth
                    >
                      <MenuItem value="">{t('common:none')}</MenuItem>
                      {sites.map((site) => (
                        <MenuItem key={site._id} value={site._id}>
                          {site.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Controller
                  name="is_active"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      }
                      label={t('users:is_active')}
                    />
                  )}
                />
                <Controller
                  name="is_verified"
                  control={methods.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      }
                      label={t('users:is_verified')}
                    />
                  )}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={t('users:avatar_url')} />
            <CardContent>
              <ImageUpload
                currentImageUrl={methods.watch('avatar_url') || undefined}
                onUpload={handleImageUpload}
                onRemove={() => methods.setValue('avatar_url', null)}
                label={t('users:avatar_url')}
              />
            </CardContent>
          </Card>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
          >
            {isEdit ? t('common:save') : t('common:create')}
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
}
