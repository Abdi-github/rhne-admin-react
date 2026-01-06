import { Box, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorState } from '@/shared/components/ErrorState';
import { useNotification } from '@/shared/hooks/useNotification';
import { EventForm, type EventFormValues } from '../components/EventForm';
import { useGetEventByIdQuery, useUpdateEventMutation } from '../events.api';

export default function EventEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['events', 'common']);
  const notification = useNotification();

  const { data, isLoading: isFetching, error } = useGetEventByIdQuery(id!);
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  const event = data?.data;

  const handleSubmit = async (values: EventFormValues) => {
    try {
      await updateEvent({ id: id!, body: values }).unwrap();
      notification.success(t('events:updated_success'));
      navigate('/events');
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

  if (!event) return null;

  return (
    <Box>
      <PageHeader
        title={t('events:edit_event')}
        subtitle={event.title.fr}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/events')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <EventForm
        defaultValues={{
          title: event.title,
          date: event.date.split('T')[0],
          url: event.url,
          time: event.time,
          location: event.location,
          category: event.category,
          description: event.description,
          detail_url: event.detail_url,
          is_active: event.is_active,
        }}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </Box>
  );
}
