import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { useNotification } from '@/shared/hooks/useNotification';
import { nullifyEmptyTranslatedField } from '@/shared/utils/formatters';
import {
  EmergencyHotlineForm,
  type EmergencyHotlineFormValues,
} from '../components/EmergencyHotlineForm';
import { useCreateEmergencyHotlineMutation } from '../emergency-hotlines.api';

export default function EmergencyHotlineCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['emergency-hotlines', 'common']);
  const notification = useNotification();
  const [createHotline, { isLoading }] = useCreateEmergencyHotlineMutation();

  const handleSubmit = async (values: EmergencyHotlineFormValues) => {
    try {
      await createHotline({
        ...values,
        subtitle: nullifyEmptyTranslatedField(values.subtitle),
        description: nullifyEmptyTranslatedField(values.description),
      }).unwrap();
      notification.success(t('emergency-hotlines:created_success'));
      navigate('/emergency-hotlines');
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  return (
    <Box>
      <PageHeader
        title={t('emergency-hotlines:create_hotline')}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/emergency-hotlines')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <EmergencyHotlineForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Box>
  );
}
