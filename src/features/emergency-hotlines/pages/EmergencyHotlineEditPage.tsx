import { Box, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorState } from '@/shared/components/ErrorState';
import { useNotification } from '@/shared/hooks/useNotification';
import { nullifyEmptyTranslatedField } from '@/shared/utils/formatters';
import {
  EmergencyHotlineForm,
  type EmergencyHotlineFormValues,
} from '../components/EmergencyHotlineForm';
import {
  useGetEmergencyHotlineByIdQuery,
  useUpdateEmergencyHotlineMutation,
} from '../emergency-hotlines.api';

export default function EmergencyHotlineEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['emergency-hotlines', 'common']);
  const notification = useNotification();

  const {
    data,
    isLoading: isFetching,
    error,
  } = useGetEmergencyHotlineByIdQuery(id!);
  const [updateHotline, { isLoading: isUpdating }] =
    useUpdateEmergencyHotlineMutation();

  const hotline = data?.data;

  const handleSubmit = async (values: EmergencyHotlineFormValues) => {
    try {
      await updateHotline({
        id: id!,
        body: {
          ...values,
          subtitle: nullifyEmptyTranslatedField(values.subtitle),
          description: nullifyEmptyTranslatedField(values.description),
        },
      }).unwrap();
      notification.success(t('emergency-hotlines:updated_success'));
      navigate('/emergency-hotlines');
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

  if (!hotline) return null;

  return (
    <Box>
      <PageHeader
        title={t('emergency-hotlines:edit_hotline')}
        subtitle={hotline.title.fr}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/emergency-hotlines')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <EmergencyHotlineForm
        defaultValues={{
          title: hotline.title,
          hotline_type: hotline.hotline_type,
          subtitle: hotline.subtitle,
          phone_number: hotline.phone_number,
          description: hotline.description,
          icon: hotline.icon,
          color: hotline.color,
          link_url: hotline.link_url,
          display_order: hotline.display_order,
          is_active: hotline.is_active,
        }}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </Box>
  );
}
