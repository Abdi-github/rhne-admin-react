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
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useForm, FormProvider, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { TranslatedFieldInput } from '@/shared/components/TranslatedFieldInput';
import { ImageUpload } from '@/shared/components/ImageUpload';
import { useUploadImageMutation } from '@/shared/api/uploadsApi';
import {
  translatedFieldSchema,
  optionalTranslatedFieldSchema,
  postalCodeSchema,
  phoneSchema,
} from '@/shared/utils/validators';

function createSiteFormSchema(t: TFunction) {
  return z.object({
    name: z.string().min(1, t('common:validation.required')).max(200),
    type: translatedFieldSchema,
    address: z.string().min(1, t('common:validation.required')),
    city: z.string().min(1, t('common:validation.required')),
    postal_code: postalCodeSchema,
    phone: phoneSchema,
    maps_url: z.string().default(''),
    image_url: z.string().default(''),
    description: optionalTranslatedFieldSchema,
    amenities: z.array(optionalTranslatedFieldSchema).default([]),
    is_active: z.boolean().default(true),
  });
}

export type SiteFormValues = z.infer<ReturnType<typeof createSiteFormSchema>>;

interface SiteFormProps {
  defaultValues?: Partial<SiteFormValues>;
  onSubmit: (values: SiteFormValues) => void;
  isLoading: boolean;
}

export function SiteForm({ defaultValues, onSubmit, isLoading }: SiteFormProps) {
  const { t } = useTranslation(['sites', 'common']);
  const [uploadImage] = useUploadImageMutation();
  const siteFormSchema = useMemo(() => createSiteFormSchema(t), [t]);

  const methods = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: '',
      type: { fr: '', en: '', de: '', it: '' },
      address: '',
      city: '',
      postal_code: '',
      phone: '',
      maps_url: '',
      image_url: '',
      description: { fr: '', en: '', de: '', it: '' },
      amenities: [],
      is_active: true,
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'amenities',
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title={t('sites:site_info')} />
            <CardContent>
              <Stack spacing={2.5}>
                <Controller
                  name="name"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('sites:name')}
                      error={!!methods.formState.errors.name}
                      helperText={methods.formState.errors.name?.message}
                      fullWidth
                    />
                  )}
                />
                <TranslatedFieldInput
                  name="type"
                  label={t('sites:type')}
                  required
                />
                <Controller
                  name="address"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('sites:address')}
                      error={!!methods.formState.errors.address}
                      helperText={methods.formState.errors.address?.message}
                      fullWidth
                    />
                  )}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Controller
                    name="city"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('sites:city')}
                        error={!!methods.formState.errors.city}
                        helperText={methods.formState.errors.city?.message}
                        fullWidth
                      />
                    )}
                  />
                  <Controller
                    name="postal_code"
                    control={methods.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t('sites:postal_code')}
                        error={!!methods.formState.errors.postal_code}
                        helperText={methods.formState.errors.postal_code?.message}
                        sx={{ width: { xs: '100%', sm: 200 } }}
                      />
                    )}
                  />
                </Stack>
                <Controller
                  name="phone"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('sites:phone')}
                      error={!!methods.formState.errors.phone}
                      helperText={methods.formState.errors.phone?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="maps_url"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('sites:maps_url')}
                      fullWidth
                    />
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
                      label={t('common:active')}
                    />
                  )}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={t('sites:description')} />
            <CardContent>
              <TranslatedFieldInput
                name="description"
                label={t('sites:description')}
                multiline
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={t('sites:image')} />
            <CardContent>
              <ImageUpload
                currentImageUrl={methods.watch('image_url') || undefined}
                onUpload={async (file) => {
                  const result = await uploadImage({ file, resource: 'sites' }).unwrap();
                  methods.setValue('image_url', result.data.url, { shouldDirty: true });
                  return result.data.url;
                }}
                onRemove={() => methods.setValue('image_url', '', { shouldDirty: true })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title={t('sites:amenities')}
              action={
                <IconButton
                  onClick={() => append({ fr: '', en: '', de: '', it: '' })}
                  color="primary"
                  aria-label={t('common:add_item')}
                >
                  <Add />
                </IconButton>
              }
            />
            <CardContent>
              {fields.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {t('common:no_data')}
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {fields.map((field, index) => (
                    <Box
                      key={field.id}
                      sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <TranslatedFieldInput
                          name={`amenities.${index}`}
                          label={`${t('sites:amenities')} ${index + 1}`}
                        />
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => remove(index)}
                        aria-label={t('common:delete')}
                        sx={{ mt: 1 }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>

          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
            >
              {defaultValues ? t('common:save') : t('common:create')}
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
}
