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
import { useGetServicesQuery } from '@/features/services/services.api';

const TITLE_OPTIONS = ['Dr', 'Dre', 'Pr', 'Pre', 'Prof'] as const;

function createDoctorFormSchema(t: TFunction) {
  return z.object({
    name: z.string().min(1, t('common:validation.required')).max(200),
    title: z.string().nullable().default(null),
    service_id: z.string().min(1, t('common:validation.required')),
    image_url: z.string().default(''),
    is_active: z.boolean().default(true),
  });
}

export type DoctorFormValues = z.infer<ReturnType<typeof createDoctorFormSchema>>;

interface DoctorFormProps {
  defaultValues?: Partial<DoctorFormValues>;
  onSubmit: (values: DoctorFormValues) => void;
  isLoading: boolean;
}

export function DoctorForm({ defaultValues, onSubmit, isLoading }: DoctorFormProps) {
  const { t } = useTranslation(['doctors', 'common']);
  const [uploadImage] = useUploadImageMutation();
  const doctorFormSchema = useMemo(() => createDoctorFormSchema(t), [t]);

  const { data: servicesData } = useGetServicesQuery({ limit: 200 });
  const services = servicesData?.data ?? [];

  const methods = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: '',
      title: null,
      service_id: '',
      image_url: '',
      is_active: true,
      ...defaultValues,
    },
  });

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const result = await uploadImage({ resource: 'doctors', body: formData }).unwrap();
    methods.setValue('image_url', result.data.url);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title={t('doctors:doctor_info')} />
            <CardContent>
              <Stack spacing={2.5}>
                <Controller
                  name="name"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('doctors:name')}
                      error={!!methods.formState.errors.name}
                      helperText={methods.formState.errors.name?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="title"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      label={t('doctors:doctor_title')}
                      select
                      fullWidth
                    >
                      <MenuItem value="">{t('doctors:no_title')}</MenuItem>
                      {TITLE_OPTIONS.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {t(`doctors:title_options.${opt}`)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Controller
                  name="service_id"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('doctors:service')}
                      select
                      error={!!methods.formState.errors.service_id}
                      helperText={methods.formState.errors.service_id?.message}
                      fullWidth
                    >
                      <MenuItem value="" disabled>
                        {t('doctors:select_service')}
                      </MenuItem>
                      {services.map((svc) => (
                        <MenuItem key={svc._id} value={svc._id}>
                          {svc.name.fr}
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
                      label={t('common:active')}
                    />
                  )}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={t('doctors:image')} />
            <CardContent>
              <ImageUpload
                currentImageUrl={methods.watch('image_url') || undefined}
                onUpload={handleImageUpload}
                onRemove={() => methods.setValue('image_url', '')}
                label={t('doctors:image')}
              />
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
