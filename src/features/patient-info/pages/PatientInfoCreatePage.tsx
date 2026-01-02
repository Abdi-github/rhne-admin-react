import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { useNotification } from '@/shared/hooks/useNotification';
import { PatientInfoForm, type PatientInfoFormValues } from '../components/PatientInfoForm';
import { useCreatePatientInfoMutation } from '../patient-info.api';

export default function PatientInfoCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['patient-info', 'common']);
  const notification = useNotification();
  const [createPatientInfo, { isLoading }] = useCreatePatientInfoMutation();

  const handleSubmit = async (values: PatientInfoFormValues) => {
    try {
      await createPatientInfo(values).unwrap();
      notification.success(t('patient-info:created_success'));
      navigate('/patient-info');
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  return (
    <Box>
      <PageHeader
        title={t('patient-info:create_page')}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/patient-info')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <PatientInfoForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Box>
  );
}
