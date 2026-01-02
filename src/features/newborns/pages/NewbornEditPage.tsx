import { Box, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorState } from '@/shared/components/ErrorState';
import { useNotification } from '@/shared/hooks/useNotification';
import { NewbornForm, type NewbornFormValues } from '../components/NewbornForm';
import { useGetNewbornByIdQuery, useUpdateNewbornMutation } from '../newborns.api';

export default function NewbornEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['newborns', 'common']);
  const notification = useNotification();

  const { data, isLoading: isFetching, error } = useGetNewbornByIdQuery(id!);
  const [updateNewborn, { isLoading: isUpdating }] = useUpdateNewbornMutation();

  const newborn = data?.data;

  const handleSubmit = async (values: NewbornFormValues) => {
    try {
      await updateNewborn({ id: id!, body: values }).unwrap();
      notification.success(t('newborns:updated_success'));
      navigate('/newborns');
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  if (isFetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <ErrorState
        title={t('common:error_loading')}
        description={t('common:error_loading_description')}
      />
    );
  }

  if (!newborn) return null;

  return (
    <Box>
      <PageHeader
        title={t('newborns:edit_newborn')}
        subtitle={newborn.name}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/newborns')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <NewbornForm
        defaultValues={{
          name: newborn.name,
          date: newborn.date.split('T')[0],
          image_url: newborn.image_url,
        }}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </Box>
  );
}
