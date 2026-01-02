import { useMemo } from 'react';
import { TextField, Stack } from '@mui/material';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { FormDialog } from '@/shared/components/FormDialog';
import { TranslatedFieldInput } from '@/shared/components/TranslatedFieldInput';
import { optionalTranslatedFieldSchema } from '@/shared/utils/validators';
import type { ServiceContact } from '../services.types';

function createContactFormSchema(t: TFunction) {
  return z.object({
    site_name: z.string().default(''),
    email: z.string().email(t('common:validation.email_invalid')).or(z.literal('')).default(''),
    phone: z.string().default(''),
    hours: optionalTranslatedFieldSchema,
  });
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactFormSchema>>;

interface ServiceContactFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ContactFormValues) => void;
  isLoading: boolean;
  editContact?: ServiceContact | null;
}

export function ServiceContactForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  editContact,
}: ServiceContactFormProps) {
  const { t } = useTranslation(['services', 'common']);
  const contactFormSchema = useMemo(() => createContactFormSchema(t), [t]);

  const methods = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: editContact
      ? {
          site_name: editContact.site_name || '',
          email: editContact.email || '',
          phone: editContact.phone || '',
          hours: editContact.hours ?? { fr: '', en: '', de: '', it: '' },
        }
      : {
          site_name: '',
          email: '',
          phone: '',
          hours: { fr: '', en: '', de: '', it: '' },
        },
  });

  const handleSubmit = () => {
    methods.handleSubmit(onSubmit)();
  };

  return (
    <FormDialog
      open={open}
      title={editContact ? t('services:contacts.edit') : t('services:contacts.add')}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      maxWidth="sm"
    >
      <FormProvider {...methods}>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Controller
            name="site_name"
            control={methods.control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('services:contacts.site_name')}
                fullWidth
              />
            )}
          />
          <Controller
            name="email"
            control={methods.control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('services:contacts.email')}
                type="email"
                error={!!methods.formState.errors.email}
                helperText={methods.formState.errors.email?.message}
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
                label={t('services:contacts.phone')}
                fullWidth
              />
            )}
          />
          <TranslatedFieldInput
            name="hours"
            label={t('services:contacts.hours')}
          />
        </Stack>
      </FormProvider>
    </FormDialog>
  );
}
