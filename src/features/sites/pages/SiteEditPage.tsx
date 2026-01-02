import { Box, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorState } from '@/shared/components/ErrorState';
import { useNotification } from '@/shared/hooks/useNotification';
import { SiteForm, type SiteFormValues } from '../components/SiteForm';
import { useGetSiteByIdQuery, useUpdateSiteMutation } from '../sites.api';

export default function SiteEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['sites', 'common']);
  const notification = useNotification();

  const { data, isLoading: isFetching, error } = useGetSiteByIdQuery(id!);
  const [updateSite, { isLoading: isUpdating }] = useUpdateSiteMutation();

  const site = data?.data;

  const handleSubmit = async (values: SiteFormValues) => {
    try {
      await updateSite({ id: id!, body: values }).unwrap();
      notification.success(t('sites:updated_success'));
      navigate('/sites');
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

  if (!site) return null;

  return (
    <Box>
      <PageHeader
        title={t('sites:edit_site')}
        subtitle={site.name}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/sites')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <SiteForm
        defaultValues={{
          name: site.name,
          type: site.type,
          address: site.address,
          city: site.city,
          postal_code: site.postal_code,
          phone: site.phone,
          maps_url: site.maps_url,
          image_url: site.image_url,
          description: site.description ?? { fr: '', en: '', de: '', it: '' },
          amenities: site.amenities,
          is_active: site.is_active,
        }}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </Box>
  );
}
