import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { useNotification } from '@/shared/hooks/useNotification';
import { DoctorForm, type DoctorFormValues } from '../components/DoctorForm';
import { useCreateDoctorMutation } from '../doctors.api';

export default function DoctorCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['doctors', 'common']);
  const notification = useNotification();
  const [createDoctor, { isLoading }] = useCreateDoctorMutation();

  const handleSubmit = async (values: DoctorFormValues) => {
    try {
      await createDoctor(values).unwrap();
      notification.success(t('doctors:created_success'));
      navigate('/doctors');
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  return (
    <Box>
      <PageHeader
        title={t('doctors:create_doctor')}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/doctors')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <DoctorForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Box>
  );
}
