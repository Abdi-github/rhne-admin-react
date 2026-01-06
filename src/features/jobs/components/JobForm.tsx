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

const translatedFieldSchema = z.object({
  fr: z.string().default(''),
  en: z.string().default(''),
  de: z.string().default(''),
  it: z.string().default(''),
});

function createJobFormSchema(t: TFunction) {
  const translatedFieldRequiredSchema = z.object({
    fr: z.string().min(1, t('common:validation.french_required')),
    en: z.string().default(''),
    de: z.string().default(''),
    it: z.string().default(''),
  });

  return z.object({
    title: translatedFieldRequiredSchema,
    job_id: z.string().default(''),
    url: z.string().default(''),
    category: z.string().default(''),
    percentage: z.string().default(''),
    description: translatedFieldSchema.nullable().default(null),
    requirements: z.array(translatedFieldSchema).default([]),
    site: z.string().default(''),
    department: z.string().default(''),
    published_date: z.string().default(''),
    is_active: z.boolean().default(true),
  });
}

export type JobFormValues = z.infer<ReturnType<typeof createJobFormSchema>>;

interface JobFormProps {
  defaultValues?: Partial<JobFormValues>;
  onSubmit: (values: JobFormValues) => void;
  isLoading: boolean;
}

export function JobForm({ defaultValues, onSubmit, isLoading }: JobFormProps) {
  const { t } = useTranslation(['jobs', 'common']);
  const jobFormSchema = useMemo(() => createJobFormSchema(t), [t]);

  const methods = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: { fr: '', en: '', de: '', it: '' },
      job_id: '',
      url: '',
      category: '',
      percentage: '',
      description: { fr: '', en: '', de: '', it: '' },
      requirements: [],
      site: '',
      department: '',
      published_date: '',
      is_active: true,
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'requirements',
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title={t('jobs:job_info')} />
            <CardContent>
              <Stack spacing={2.5}>
                <TranslatedFieldInput
                  name="title"
                  label={t('jobs:job_title')}
                  required
                />
                <Controller
                  name="job_id"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('jobs:job_id')}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="category"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('jobs:category')}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="percentage"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('jobs:percentage')}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="site"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('jobs:site')}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="department"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('jobs:department')}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="published_date"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('jobs:published_date')}
                      type="date"
                      fullWidth
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  )}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={t('jobs:job_details')} />
            <CardContent>
              <Stack spacing={2.5}>
                <TranslatedFieldInput
                  name="description"
                  label={t('jobs:description')}
                  multiline
                  rows={4}
                />
                <Controller
                  name="url"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('jobs:url')}
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
              title={t('jobs:requirements')}
              action={
                <Button
                  startIcon={<Add />}
                  size="small"
                  onClick={() => append({ fr: '', en: '', de: '', it: '' })}
                >
                  {t('jobs:add_requirement')}
                </Button>
              }
            />
            <CardContent>
              {fields.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {t('jobs:no_jobs')}
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {fields.map((field, index) => (
                    <Box key={field.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <TranslatedFieldInput
                          name={`requirements.${index}`}
                          label={`${t('jobs:requirements')} ${index + 1}`}
                        />
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() => remove(index)}
                        aria-label={t('jobs:remove_requirement')}
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
