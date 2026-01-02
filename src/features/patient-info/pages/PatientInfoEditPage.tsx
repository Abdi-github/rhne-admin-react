import { Box, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorState } from '@/shared/components/ErrorState';
import { useNotification } from '@/shared/hooks/useNotification';
import { PatientInfoForm, type PatientInfoFormValues } from '../components/PatientInfoForm';
import { useGetPatientInfoByIdQuery, useUpdatePatientInfoMutation } from '../patient-info.api';

export default function PatientInfoEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['patient-info', 'common']);
  const notification = useNotification();

  const { data, isLoading: isFetching, error } = useGetPatientInfoByIdQuery(id!);
  const [updatePatientInfo, { isLoading: isUpdating }] = useUpdatePatientInfoMutation();

  const patientInfo = data?.data;

  const handleSubmit = async (values: PatientInfoFormValues) => {
    try {
      await updatePatientInfo({ id: id!, body: values }).unwrap();
      notification.success(t('patient-info:updated_success'));
      navigate('/patient-info');
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

  if (!patientInfo) return null;

  return (
    <Box>
      <PageHeader
        title={t('patient-info:edit_page')}
        subtitle={patientInfo.title.fr}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/patient-info')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <PatientInfoForm
        defaultValues={{
          title: patientInfo.title,
          section: patientInfo.section,
          url: patientInfo.url,
          content: patientInfo.content,
          image_url: patientInfo.image_url,
          sections: patientInfo.sections,
        }}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </Box>
  );
}
