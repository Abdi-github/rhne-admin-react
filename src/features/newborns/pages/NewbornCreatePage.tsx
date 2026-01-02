import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { useNotification } from '@/shared/hooks/useNotification';
import { NewbornForm, type NewbornFormValues } from '../components/NewbornForm';
import { useCreateNewbornMutation } from '../newborns.api';

export default function NewbornCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['newborns', 'common']);
  const notification = useNotification();
  const [createNewborn, { isLoading }] = useCreateNewbornMutation();

  const handleSubmit = async (values: NewbornFormValues) => {
    try {
      await createNewborn(values).unwrap();
      notification.success(t('newborns:created_success'));
      navigate('/newborns');
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  return (
    <Box>
      <PageHeader
        title={t('newborns:create_newborn')}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/newborns')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <NewbornForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Box>
  );
}
