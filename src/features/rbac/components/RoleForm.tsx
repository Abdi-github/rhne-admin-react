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

function createRoleFormSchema(t: TFunction) {
  const translatedFieldRequiredSchema = z.object({
    fr: z.string().min(1, t('common:validation.french_required')),
    en: z.string().default(''),
    de: z.string().default(''),
    it: z.string().default(''),
  });

  return z.object({
    name: z.string().min(1, t('common:validation.required')).max(50).regex(/^[a-z_]+$/, t('common:validation.name_pattern')),
    display_name: translatedFieldRequiredSchema,
    description: translatedFieldRequiredSchema,
    is_active: z.boolean().default(true),
  });
}

export type RoleFormValues = z.infer<ReturnType<typeof createRoleFormSchema>>;

interface RoleFormProps {
  defaultValues?: Partial<RoleFormValues>;
  onSubmit: (values: RoleFormValues) => void;
  isLoading: boolean;
  isEdit?: boolean;
}

export function RoleForm({ defaultValues, onSubmit, isLoading, isEdit }: RoleFormProps) {
  const { t } = useTranslation(['rbac', 'common']);
  const roleFormSchema = useMemo(() => createRoleFormSchema(t), [t]);

  const methods = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      display_name: { fr: '', en: '', de: '', it: '' },
      description: { fr: '', en: '', de: '', it: '' },
      is_active: true,
      ...defaultValues,
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <Card>
            <CardHeader title={t('rbac:edit_role')} />
            <CardContent>
              <Stack spacing={2.5}>
                <Controller
                  name="name"
                  control={methods.control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t('rbac:role_name')}
                      error={!!methods.formState.errors.name}
                      helperText={methods.formState.errors.name?.message}
                      fullWidth
                      disabled={isEdit}
                    />
                  )}
                />
                <TranslatedFieldInput name="display_name" label={t('rbac:display_name')} required />
                <TranslatedFieldInput name="description" label={t('rbac:description')} multiline rows={3} />
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
                      label={t('rbac:is_active')}
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
            {isEdit ? t('common:save') : t('common:create')}
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
}
