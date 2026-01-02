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
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useForm, FormProvider, Controller, useFieldArray } from 'react-hook-form';
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

const APPOINTMENT_TYPES = ['adult', 'child', 'doctor'] as const;

function createAppointmentFormSchema(t: TFunction) {
  const translatedFieldRequiredSchema = z.object({
    fr: z.string().min(1, t('common:validation.french_required')),
    en: z.string().default(''),
    de: z.string().default(''),
    it: z.string().default(''),
  });

  return z.object({
    title: translatedFieldRequiredSchema,
    appointment_type: z.enum(APPOINTMENT_TYPES, {
      required_error: t('common:validation.required'),
    }),
    description: translatedFieldSchema.nullable().default(null),
    age_restriction: translatedFieldSchema.nullable().default(null),
    schedule: translatedFieldSchema.nullable().default(null),
    locations: translatedFieldSchema.nullable().default(null),
    booking_url: z.string().default(''),
    info_text: translatedFieldSchema.nullable().default(null),
    conditions: z.array(translatedFieldSchema).default([]),
    phone_number: z.string().default(''),
    display_order: z.coerce.number().int().min(0).default(0),
    is_active: z.boolean().default(true),
  });
}

export type AppointmentFormValues = z.infer<
  ReturnType<typeof createAppointmentFormSchema>
>;

interface AppointmentFormProps {
  defaultValues?: Partial<AppointmentFormValues>;
  onSubmit: (values: AppointmentFormValues) => void;
  isLoading: boolean;
}

export function AppointmentForm({
  defaultValues,
  onSubmit,
  isLoading,
}: AppointmentFormProps) {
  const { t } = useTranslation(['appointments', 'common']);
  const schema = useMemo(() => createAppointmentFormSchema(t), [t]);

  const emptyTranslatedField = { fr: '', en: '', de: '', it: '' };

  const methods = useForm<AppointmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: { fr: '', en: '', de: '', it: '' },
      appointment_type: 'adult',
      description: { fr: '', en: '', de: '', it: '' },
      age_restriction: { fr: '', en: '', de: '', it: '' },
      schedule: { fr: '', en: '', de: '', it: '' },
      locations: { fr: '', en: '', de: '', it: '' },
      booking_url: '',
      info_text: { fr: '', en: '', de: '', it: '' },
      conditions: [],
      phone_number: '',
      display_order: 0,
      is_active: true,
      ...defaultValues,
      description: defaultValues?.description ?? emptyTranslatedField,
      age_restriction: defaultValues?.age_restriction ?? emptyTranslatedField,
      schedule: defaultValues?.schedule ?? emptyTranslatedField,
      locations: defaultValues?.locations ?? emptyTranslatedField,
      info_text: defaultValues?.info_text ?? emptyTranslatedField,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'conditions',
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title={t('appointments:appointment_info')} />
            <CardContent>
              <Stack spacing={2.5}>
                <TranslatedFieldInput
                  name="title"
                  label={t('appointments:appointment_title')}
                  required
                />
                <Controller
                  name="appointment_type"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label={t('appointments:appointment_type')}
                      fullWidth
                      error={!!methods.formState.errors.appointment_type}
                      helperText={
                        methods.formState.errors.appointment_type?.message
                      }
                    >
                      {APPOINTMENT_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                          {t(`appointments:types.${type}`)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <TranslatedFieldInput
                  name="description"
                  label={t('appointments:description')}
                  multiline
                  rows={3}
                />
                <TranslatedFieldInput
                  name="age_restriction"
                  label={t('appointments:age_restriction')}
                />
                <TranslatedFieldInput
                  name="schedule"
                  label={t('appointments:schedule')}
                />
                <TranslatedFieldInput
                  name="locations"
                  label={t('appointments:locations')}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={t('appointments:appointment_details')} />
            <CardContent>
              <Stack spacing={2.5}>
                <Controller
                  name="booking_url"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('appointments:booking_url')}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="phone_number"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('appointments:phone_number')}
                      fullWidth
                    />
                  )}
                />
                <TranslatedFieldInput
                  name="info_text"
                  label={t('appointments:info_text')}
                  multiline
                  rows={3}
                />
                <Controller
                  name="display_order"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('appointments:display_order')}
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

          <Card>
            <CardHeader
              title={t('appointments:conditions')}
              action={
                <Button
                  startIcon={<Add />}
                  size="small"
                  onClick={() =>
                    append({ fr: '', en: '', de: '', it: '' })
                  }
                >
                  {t('common:add_item')}
                </Button>
              }
            />
            <CardContent>
              {fields.length === 0 ? (
                <Typography color="text.secondary">
                  {t('appointments:no_conditions')}
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {fields.map((field, index) => (
                    <Box
                      key={field.id}
                      sx={{
                        display: 'flex',
                        gap: 1,
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <TranslatedFieldInput
                          name={`conditions.${index}`}
                          label={`${t('appointments:condition')} ${index + 1}`}
                        />
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => remove(index)}
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
