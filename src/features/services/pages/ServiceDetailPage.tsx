import { Box, Button, CircularProgress, Typography, Chip, Avatar, Card, CardContent, Stack } from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorState } from '@/shared/components/ErrorState';
import { ServiceDetailView } from '../components/ServiceDetailView';
import { useGetServiceByIdQuery } from '../services.api';

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['services', 'common']);
  const lang = i18n.language as 'fr' | 'en' | 'de' | 'it';

  const { data, isLoading, error } = useGetServiceByIdQuery(id!);
  const service = data?.data;

  if (isLoading) {
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
        title={t('services:service_detail')}
        subtitle={service.name[lang] || service.name.fr}
        breadcrumbs={[
          { label: t('services:title'), href: '/services' },
          { label: service.name[lang] || service.name.fr },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/services')}
            >
              {t('common:back')}
            </Button>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/services/${id}/edit`)}
            >
              {t('common:edit')}
            </Button>
          </Stack>
        }
      />

      <Stack spacing={3}>
        {/* Service overview card */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={3} alignItems="flex-start">
              <Avatar
                src={service.image_url || undefined}
                variant="rounded"
                sx={{ width: 80, height: 80 }}
              >
                {(service.name[lang] || service.name.fr).charAt(0)}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">
                  {service.name[lang] || service.name.fr}
                </Typography>
                {service.category && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {service.category}
                  </Typography>
                )}
                <Chip
                  label={service.is_active ? t('common:active') : t('common:inactive')}
                  size="small"
                  color={service.is_active ? 'success' : 'default'}
                  sx={{ mt: 1 }}
                />
                {service.description?.[lang] || service.description?.fr ? (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {service.description?.[lang] || service.description?.fr}
                  </Typography>
                ) : null}
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Contacts & Links tabs */}
        <ServiceDetailView serviceId={id!} />
      </Stack>
    </Box>
  );
}
