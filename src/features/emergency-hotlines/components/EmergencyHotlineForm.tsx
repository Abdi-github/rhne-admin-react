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
import { TranslatedFieldInput } from '@/shared/components/TranslatedFieldInput';

const translatedFieldSchema = z.object({
  fr: z.string().default(''),
  en: z.string().default(''),
  de: z.string().default(''),
  it: z.string().default(''),
});

const HOTLINE_TYPES = ['vital', 'non_vital', 'psychiatric', 'appointment'] as const;

function createEmergencyHotlineFormSchema(t: TFunction) {
  const translatedFieldRequiredSchema = z.object({
    fr: z.string().min(1, t('common:validation.french_required')),
    en: z.string().default(''),
    de: z.string().default(''),
    it: z.string().default(''),
  });

  return z.object({
    title: translatedFieldRequiredSchema,
    hotline_type: z.enum(HOTLINE_TYPES, {
      required_error: t('common:validation.required'),
    }),
    subtitle: translatedFieldSchema.nullable().default(null),
    phone_number: z.string().default(''),
    description: translatedFieldSchema.nullable().default(null),
    icon: z.string().default('Phone'),
    color: z.string().default('#d32f2f'),
    link_url: z.string().default(''),
    display_order: z.coerce.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
  });
}

export type EmergencyHotlineFormValues = z.infer<
  ReturnType<typeof createEmergencyHotlineFormSchema>
>;

interface EmergencyHotlineFormProps {
  defaultValues?: Partial<EmergencyHotlineFormValues>;
  onSubmit: (values: EmergencyHotlineFormValues) => void;
  isLoading: boolean;
}

export function EmergencyHotlineForm({
  defaultValues,
  onSubmit,
  isLoading,
}: EmergencyHotlineFormProps) {
  const { t } = useTranslation(['emergency-hotlines', 'common']);
  const schema = useMemo(() => createEmergencyHotlineFormSchema(t), [t]);

  const emptyTranslatedField = { fr: '', en: '', de: '', it: '' };

  const methods = useForm<EmergencyHotlineFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: { fr: '', en: '', de: '', it: '' },
      hotline_type: 'vital',
      subtitle: { fr: '', en: '', de: '', it: '' },
      phone_number: '',
      description: { fr: '', en: '', de: '', it: '' },
      icon: 'Phone',
      color: '#d32f2f',
      link_url: '',
      display_order: 0,
      is_active: true,
      ...defaultValues,
      subtitle: defaultValues?.subtitle ?? emptyTranslatedField,
      description: defaultValues?.description ?? emptyTranslatedField,
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title={t('emergency-hotlines:hotline_info')} />
            <CardContent>
              <Stack spacing={2.5}>
                <TranslatedFieldInput
                  name="title"
                  label={t('emergency-hotlines:hotline_title')}
                  required
                />
                <Controller
                  name="hotline_type"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={t('emergency-hotlines:hotline_type')}
                      fullWidth
                      error={!!methods.formState.errors.hotline_type}
                      helperText={methods.formState.errors.hotline_type?.message}
                    >
                      {HOTLINE_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {t(`emergency-hotlines:types.${type}`)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <TranslatedFieldInput
                  name="subtitle"
                  label={t('emergency-hotlines:subtitle')}
                />
                <Controller
                  name="phone_number"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('emergency-hotlines:phone_number')}
                      fullWidth
                    />
                  )}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={t('emergency-hotlines:hotline_details')} />
            <CardContent>
              <Stack spacing={2.5}>
                <TranslatedFieldInput
                  name="description"
                  label={t('emergency-hotlines:description')}
                  multiline
                  rows={4}
                />
                <Controller
                  name="icon"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('emergency-hotlines:icon')}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="color"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('emergency-hotlines:color')}
                      type="color"
                      fullWidth
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  )}
                />
                <Controller
                  name="link_url"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('emergency-hotlines:link_url')}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="display_order"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('emergency-hotlines:display_order')}
                      type="number"
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

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
          >
            {defaultValues ? t('common:save') : t('common:create')}
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
}
