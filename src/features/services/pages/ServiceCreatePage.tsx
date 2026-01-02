import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { useNotification } from '@/shared/hooks/useNotification';
import { ServiceForm, type ServiceFormValues } from '../components/ServiceForm';
import { useCreateServiceMutation } from '../services.api';

export default function ServiceCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['services', 'common']);
  const notification = useNotification();
  const [createService, { isLoading }] = useCreateServiceMutation();

  const handleSubmit = async (values: ServiceFormValues) => {
    try {
      await createService(values).unwrap();
      notification.success(t('services:created_success'));
      navigate('/services');
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  return (
    <Box>
      <PageHeader
        title={t('services:create_service')}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/services')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <ServiceForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Box>
  );
}
