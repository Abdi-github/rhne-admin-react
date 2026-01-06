import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { useNotification } from '@/shared/hooks/useNotification';
import { EventForm, type EventFormValues } from '../components/EventForm';
import { useCreateEventMutation } from '../events.api';

export default function EventCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['events', 'common']);
  const notification = useNotification();
  const [createEvent, { isLoading }] = useCreateEventMutation();

  const handleSubmit = async (values: EventFormValues) => {
    try {
      await createEvent(values).unwrap();
      notification.success(t('events:created_success'));
      navigate('/events');
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  return (
    <Box>
      <PageHeader
        title={t('events:create_event')}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/events')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Box>
  );
}
