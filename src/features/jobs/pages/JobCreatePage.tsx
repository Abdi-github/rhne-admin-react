import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { useNotification } from '@/shared/hooks/useNotification';
import { JobForm, type JobFormValues } from '../components/JobForm';
import { useCreateJobMutation } from '../jobs.api';

export default function JobCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['jobs', 'common']);
  const notification = useNotification();
  const [createJob, { isLoading }] = useCreateJobMutation();

  const handleSubmit = async (values: JobFormValues) => {
    try {
      await createJob(values).unwrap();
      notification.success(t('jobs:created_success'));
      navigate('/jobs');
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  return (
    <Box>
      <PageHeader
        title={t('jobs:create_job')}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/jobs')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <JobForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Box>
  );
}
