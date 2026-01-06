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

function createEventFormSchema(t: TFunction) {
  const translatedFieldRequiredSchema = z.object({
    fr: z.string().min(1, t('common:validation.french_required')),
    en: z.string().default(''),
    de: z.string().default(''),
    it: z.string().default(''),
  });

  return z.object({
    title: translatedFieldRequiredSchema,
    date: z.string().min(1, t('common:validation.required')),
    url: z.string().default(''),
    time: translatedFieldSchema.nullable().default(null),
    location: translatedFieldSchema.nullable().default(null),
    category: translatedFieldSchema.nullable().default(null),
    description: translatedFieldSchema.nullable().default(null),
    detail_url: z.string().default(''),
    is_active: z.boolean().default(true),
  });
}

export type EventFormValues = z.infer<ReturnType<typeof createEventFormSchema>>;

interface EventFormProps {
  defaultValues?: Partial<EventFormValues>;
  onSubmit: (values: EventFormValues) => void;
  isLoading: boolean;
}

export function EventForm({ defaultValues, onSubmit, isLoading }: EventFormProps) {
  const { t } = useTranslation(['events', 'common']);
  const eventFormSchema = useMemo(() => createEventFormSchema(t), [t]);

  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: { fr: '', en: '', de: '', it: '' },
      date: '',
      url: '',
      time: { fr: '', en: '', de: '', it: '' },
      location: { fr: '', en: '', de: '', it: '' },
      category: { fr: '', en: '', de: '', it: '' },
      description: { fr: '', en: '', de: '', it: '' },
      detail_url: '',
      is_active: true,
      ...defaultValues,
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title={t('events:event_info')} />
            <CardContent>
              <Stack spacing={2.5}>
                <TranslatedFieldInput
                  name="title"
                  label={t('events:event_title')}
                  required
                />
                <Controller
                  name="date"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('events:date')}
                      type="date"
                      error={!!methods.formState.errors.date}
                      helperText={methods.formState.errors.date?.message}
                      fullWidth
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  )}
                />
                <TranslatedFieldInput
                  name="time"
                  label={t('events:time')}
                />
                <TranslatedFieldInput
                  name="location"
                  label={t('events:location')}
                />
                <TranslatedFieldInput
                  name="category"
                  label={t('events:category')}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={t('events:event_details')} />
            <CardContent>
              <Stack spacing={2.5}>
                <TranslatedFieldInput
                  name="description"
                  label={t('events:description')}
                  multiline
                  rows={4}
                />
                <Controller
                  name="url"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('events:url')}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="detail_url"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('events:detail_url')}
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
