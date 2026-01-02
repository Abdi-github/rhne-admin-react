import { Box, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorState } from '@/shared/components/ErrorState';
import { useNotification } from '@/shared/hooks/useNotification';
import { nullifyEmptyTranslatedField } from '@/shared/utils/formatters';
import {
  AppointmentForm,
  type AppointmentFormValues,
} from '../components/AppointmentForm';
import {
  useGetAppointmentByIdQuery,
  useUpdateAppointmentMutation,
} from '../appointments.api';

export default function AppointmentEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['appointments', 'common']);
  const notification = useNotification();

  const {
    data,
    isLoading: isFetching,
    error,
  } = useGetAppointmentByIdQuery(id!);
  const [updateAppointment, { isLoading: isUpdating }] =
    useUpdateAppointmentMutation();

  const appointment = data?.data;

  const handleSubmit = async (values: AppointmentFormValues) => {
    try {
      await updateAppointment({
        id: id!,
        body: {
          ...values,
          description: nullifyEmptyTranslatedField(values.description),
          age_restriction: nullifyEmptyTranslatedField(values.age_restriction),
          schedule: nullifyEmptyTranslatedField(values.schedule),
          locations: nullifyEmptyTranslatedField(values.locations),
          info_text: nullifyEmptyTranslatedField(values.info_text),
        },
      }).unwrap();
      notification.success(t('appointments:updated_success'));
      navigate('/appointments');
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

  if (!appointment) return null;

  return (
    <Box>
      <PageHeader
        title={t('appointments:edit_appointment')}
        subtitle={appointment.title.fr}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/appointments')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <AppointmentForm
        defaultValues={{
          title: appointment.title,
          appointment_type: appointment.appointment_type,
          description: appointment.description,
          age_restriction: appointment.age_restriction,
          schedule: appointment.schedule,
          locations: appointment.locations,
          booking_url: appointment.booking_url,
          info_text: appointment.info_text,
          conditions: appointment.conditions,
          phone_number: appointment.phone_number,
          display_order: appointment.display_order,
          is_active: appointment.is_active,
        }}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </Box>
  );
}
