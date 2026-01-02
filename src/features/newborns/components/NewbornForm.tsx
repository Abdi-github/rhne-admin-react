import { useMemo } from 'react';
import {
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

function createNewbornFormSchema(t: TFunction) {
  return z.object({
    name: z.string().min(1, t('common:validation.required')),
    date: z.string().min(1, t('common:validation.required')),
    image_url: z.string().default(''),
  });
}

export type NewbornFormValues = z.infer<ReturnType<typeof createNewbornFormSchema>>;

interface NewbornFormProps {
  defaultValues?: Partial<NewbornFormValues>;
  onSubmit: (values: NewbornFormValues) => void;
  isLoading: boolean;
}

export function NewbornForm({ defaultValues, onSubmit, isLoading }: NewbornFormProps) {
  const { t } = useTranslation(['newborns', 'common']);
  const newbornFormSchema = useMemo(() => createNewbornFormSchema(t), [t]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewbornFormValues>({
    resolver: zodResolver(newbornFormSchema),
    defaultValues: {
      name: '',
      date: '',
      image_url: '',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Card>
          <CardHeader title={t('newborns:newborn_info')} />
          <CardContent>
            <Stack spacing={2.5}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('newborns:name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    fullWidth
                    required
                  />
                )}
              />
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('newborns:date')}
                    type="date"
                    error={!!errors.date}
                    helperText={errors.date?.message}
                    fullWidth
                    required
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                )}
              />
              <Controller
                name="image_url"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('newborns:image_url')}
                    fullWidth
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
  );
}
