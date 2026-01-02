import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { useNotification } from '@/shared/hooks/useNotification';
import { nullifyEmptyTranslatedField } from '@/shared/utils/formatters';
import {
  AppointmentForm,
  type AppointmentFormValues,
} from '../components/AppointmentForm';
import { useCreateAppointmentMutation } from '../appointments.api';

export default function AppointmentCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['appointments', 'common']);
  const notification = useNotification();
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const handleSubmit = async (values: AppointmentFormValues) => {
    try {
      await createAppointment({
        ...values,
        description: nullifyEmptyTranslatedField(values.description),
        age_restriction: nullifyEmptyTranslatedField(values.age_restriction),
        schedule: nullifyEmptyTranslatedField(values.schedule),
        locations: nullifyEmptyTranslatedField(values.locations),
        info_text: nullifyEmptyTranslatedField(values.info_text),
      }).unwrap();
      notification.success(t('appointments:created_success'));
      navigate('/appointments');
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  return (
    <Box>
      <PageHeader
        title={t('appointments:create_appointment')}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/appointments')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <AppointmentForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Box>
  );
}
