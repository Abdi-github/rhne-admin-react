import { Box, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorState } from '@/shared/components/ErrorState';
import { useNotification } from '@/shared/hooks/useNotification';
import { DoctorForm, type DoctorFormValues } from '../components/DoctorForm';
import { useGetDoctorByIdQuery, useUpdateDoctorMutation } from '../doctors.api';

export default function DoctorEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['doctors', 'common']);
  const notification = useNotification();

  const { data, isLoading: isFetching, error } = useGetDoctorByIdQuery(id!);
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();

  const doctor = data?.data;

  const handleSubmit = async (values: DoctorFormValues) => {
    try {
      await updateDoctor({ id: id!, body: values }).unwrap();
      notification.success(t('doctors:updated_success'));
      navigate('/doctors');
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

  if (!doctor) return null;

  return (
    <Box>
      <PageHeader
        title={t('doctors:edit_doctor')}
        subtitle={doctor.title ? `${doctor.title} ${doctor.name}` : doctor.name}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/doctors')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <DoctorForm
        defaultValues={{
          name: doctor.name,
          title: doctor.title,
          service_id: doctor.service_id,
          image_url: doctor.image_url,
          is_active: doctor.is_active,
        }}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </Box>
  );
}
