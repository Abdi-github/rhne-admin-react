import { Box, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorState } from '@/shared/components/ErrorState';
import { useNotification } from '@/shared/hooks/useNotification';
import { ServiceForm, type ServiceFormValues } from '../components/ServiceForm';
import { useGetServiceByIdQuery, useUpdateServiceMutation } from '../services.api';

export default function ServiceEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['services', 'common']);
  const lang = i18n.language as 'fr' | 'en' | 'de' | 'it';
  const notification = useNotification();

  const { data, isLoading: isFetching, error } = useGetServiceByIdQuery(id!);
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();

  const service = data?.data;

  const handleSubmit = async (values: ServiceFormValues) => {
    try {
      await updateService({ id: id!, body: values }).unwrap();
      notification.success(t('services:updated_success'));
      navigate('/services');
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

  if (!service) return null;

  return (
    <Box>
      <PageHeader
        title={t('services:edit_service')}
        subtitle={service.name[lang] || service.name.fr}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/services')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <ServiceForm
        defaultValues={{
          name: service.name,
          category: service.category ?? '',
          image_url: service.image_url,
          description: service.description ?? { fr: '', en: '', de: '', it: '' },
          prestations: service.prestations,
          is_active: service.is_active,
        }}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </Box>
  );
}
