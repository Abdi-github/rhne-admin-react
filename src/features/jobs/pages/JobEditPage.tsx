import { Box, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorState } from '@/shared/components/ErrorState';
import { useNotification } from '@/shared/hooks/useNotification';
import { JobForm, type JobFormValues } from '../components/JobForm';
import { useGetJobByIdQuery, useUpdateJobMutation } from '../jobs.api';

export default function JobEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['jobs', 'common']);
  const notification = useNotification();

  const { data, isLoading: isFetching, error } = useGetJobByIdQuery(id!);
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobMutation();

  const job = data?.data;

  const handleSubmit = async (values: JobFormValues) => {
    try {
      await updateJob({ id: id!, body: values }).unwrap();
      notification.success(t('jobs:updated_success'));
      navigate('/jobs');
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

  if (!job) return null;

  return (
    <Box>
      <PageHeader
        title={t('jobs:edit_job')}
        subtitle={job.title.fr}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/jobs')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <JobForm
        defaultValues={{
          title: job.title,
          job_id: job.job_id,
          url: job.url,
          category: job.category,
          percentage: job.percentage,
          description: job.description,
          requirements: job.requirements,
          site: job.site,
          department: job.department,
          published_date: job.published_date.split('T')[0],
          is_active: job.is_active,
        }}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </Box>
  );
}
