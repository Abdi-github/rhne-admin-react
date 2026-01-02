import { useMemo } from 'react';
import { TextField, Stack } from '@mui/material';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { FormDialog } from '@/shared/components/FormDialog';
import { TranslatedFieldInput } from '@/shared/components/TranslatedFieldInput';
import { translatedFieldSchema } from '@/shared/utils/validators';
import type { ServiceLink } from '../services.types';

function createLinkFormSchema(t: TFunction) {
  return z.object({
    title: translatedFieldSchema,
    url: z.string().url(t('common:validation.url_invalid')).min(1, t('common:validation.url_required')),
  });
}

export type LinkFormValues = z.infer<ReturnType<typeof createLinkFormSchema>>;

interface ServiceLinkFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: LinkFormValues) => void;
  isLoading: boolean;
  editLink?: ServiceLink | null;
}

export function ServiceLinkForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  editLink,
}: ServiceLinkFormProps) {
  const { t } = useTranslation(['services', 'common']);
  const linkFormSchema = useMemo(() => createLinkFormSchema(t), [t]);

  const methods = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues: editLink
      ? {
          title: editLink.title,
          url: editLink.url,
        }
      : {
          title: { fr: '', en: '', de: '', it: '' },
          url: '',
        },
  });

  const handleSubmit = () => {
    methods.handleSubmit(onSubmit)();
  };

  return (
    <FormDialog
      open={open}
      title={editLink ? t('services:links.edit') : t('services:links.add')}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      maxWidth="sm"
    >
      <FormProvider {...methods}>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TranslatedFieldInput
            name="title"
            label={t('services:links.link_title')}
            required
          />
          <Controller
            name="url"
            control={methods.control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('services:links.url')}
                error={!!methods.formState.errors.url}
                helperText={methods.formState.errors.url?.message}
                fullWidth
                placeholder="https://"
              />
            )}
          />
        </Stack>
      </FormProvider>
    </FormDialog>
  );
}
