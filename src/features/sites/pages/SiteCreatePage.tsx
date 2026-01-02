import { Box, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { useNotification } from '@/shared/hooks/useNotification';
import { SiteForm, type SiteFormValues } from '../components/SiteForm';
import { useCreateSiteMutation } from '../sites.api';

export default function SiteCreatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['sites', 'common']);
  const notification = useNotification();
  const [createSite, { isLoading }] = useCreateSiteMutation();

  const handleSubmit = async (values: SiteFormValues) => {
    try {
      await createSite(values).unwrap();
      notification.success(t('sites:created_success'));
      navigate('/sites');
    } catch {
      notification.error(t('common:error_generic'));
    }
  };

  return (
    <Box>
      <PageHeader
        title={t('sites:create_site')}
        action={
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/sites')}
          >
            {t('common:back')}
          </Button>
        }
      />
      <SiteForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Box>
  );
}
