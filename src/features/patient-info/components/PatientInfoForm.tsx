import { useMemo } from 'react';
import {
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { TranslatedFieldInput } from '@/shared/components/TranslatedFieldInput';
import { SectionEditor } from './SectionEditor';

const translatedFieldSchema = z.object({
  fr: z.string().default(''),
  en: z.string().default(''),
  de: z.string().default(''),
  it: z.string().default(''),
});

function createPatientInfoFormSchema(t: TFunction) {
  const translatedFieldRequiredSchema = z.object({
    fr: z.string().min(1, t('common:validation.french_required')),
    en: z.string().default(''),
    de: z.string().default(''),
    it: z.string().default(''),
  });

  const sectionSchema = z.object({
    id: z.string().min(1),
    title: translatedFieldRequiredSchema,
    content: translatedFieldSchema,
    list_items: z.array(translatedFieldSchema).default([]),
  });

  return z.object({
    title: translatedFieldRequiredSchema,
    section: z.string().default(''),
    url: z.string().default(''),
    content: translatedFieldSchema.nullable().default(null),
    image_url: z.string().default(''),
    sections: z.array(sectionSchema).default([]),
  });
}

export type PatientInfoFormValues = z.infer<ReturnType<typeof createPatientInfoFormSchema>>;

interface PatientInfoFormProps {
  defaultValues?: Partial<PatientInfoFormValues>;
  onSubmit: (values: PatientInfoFormValues) => void;
  isLoading: boolean;
}

export function PatientInfoForm({ defaultValues, onSubmit, isLoading }: PatientInfoFormProps) {
  const { t } = useTranslation(['patient-info', 'common']);
  const patientInfoFormSchema = useMemo(() => createPatientInfoFormSchema(t), [t]);

  const methods = useForm<PatientInfoFormValues>({
    resolver: zodResolver(patientInfoFormSchema),
    defaultValues: {
      title: { fr: '', en: '', de: '', it: '' },
      section: '',
      url: '',
      content: { fr: '', en: '', de: '', it: '' },
      image_url: '',
      sections: [],
      ...defaultValues,
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title={t('patient-info:page_info')} />
            <CardContent>
              <Stack spacing={2.5}>
                <TranslatedFieldInput
                  name="title"
                  label={t('patient-info:page_title')}
                  required
                />
                <Controller
                  name="section"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('patient-info:section')}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="url"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('patient-info:url')}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="image_url"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('patient-info:image_url')}
                      fullWidth
                    />
                  )}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={t('patient-info:page_content')} />
            <CardContent>
              <TranslatedFieldInput
                name="content"
                label={t('patient-info:content')}
                multiline
                rows={4}
              />
            </CardContent>
          </Card>

          <SectionEditor name="sections" />

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
