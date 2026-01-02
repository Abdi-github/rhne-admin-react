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
import { TranslatedFieldInput } from '@/shared/components/TranslatedFieldInput';
import { ImageUpload } from '@/shared/components/ImageUpload';
import { useUploadImageMutation } from '@/shared/api/uploadsApi';
import {
  translatedFieldSchema,
  optionalTranslatedFieldSchema,
} from '@/shared/utils/validators';

const serviceFormSchema = z.object({
  name: translatedFieldSchema,
  category: z.string().default(''),
  image_url: z.string().default(''),
  description: optionalTranslatedFieldSchema,
  prestations: z.array(optionalTranslatedFieldSchema).default([]),
  is_active: z.boolean().default(true),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

interface ServiceFormProps {
  defaultValues?: Partial<ServiceFormValues>;
  onSubmit: (values: ServiceFormValues) => void;
  isLoading: boolean;
}

export function ServiceForm({ defaultValues, onSubmit, isLoading }: ServiceFormProps) {
  const { t } = useTranslation(['services', 'common']);
  const [uploadImage] = useUploadImageMutation();

  const methods = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: { fr: '', en: '', de: '', it: '' },
      category: '',
      image_url: '',
      description: { fr: '', en: '', de: '', it: '' },
      prestations: [],
      is_active: true,
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: 'prestations',
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title={t('services:service_info')} />
            <CardContent>
              <Stack spacing={2.5}>
                <TranslatedFieldInput
                  name="name"
                  label={t('services:name')}
                  required
                />
                <Controller
                  name="category"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('services:category')}
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
            <CardHeader title={t('services:description')} />
            <CardContent>
              <TranslatedFieldInput
                name="description"
                label={t('services:description')}
                multiline
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={t('services:image')} />
            <CardContent>
              <ImageUpload
                currentImageUrl={methods.watch('image_url') || undefined}
                onUpload={async (file) => {
                  const result = await uploadImage({ file, resource: 'services' }).unwrap();
                  methods.setValue('image_url', result.data.url, { shouldDirty: true });
                  return result.data.url;
                }}
                onRemove={() => methods.setValue('image_url', '', { shouldDirty: true })}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title={t('services:prestations')}
              action={
                <IconButton
                  onClick={() => append({ fr: '', en: '', de: '', it: '' })}
                  color="primary"
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
                          name={`prestations.${index}`}
                          label={`${t('services:prestations')} ${index + 1}`}
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
