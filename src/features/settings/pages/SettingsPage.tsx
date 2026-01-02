import { Box, Stack, CircularProgress } from '@mui/material';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorState } from '@/shared/components/ErrorState';
import { useTranslation } from 'react-i18next';
import { useGetProfileQuery } from '../settings.api';
import { ProfileForm } from '../components/ProfileForm';
import { PasswordChangeForm } from '../components/PasswordChangeForm';
import { LanguageSelector } from '../components/LanguageSelector';

export default function SettingsPage() {
  const { t } = useTranslation(['settings', 'common']);
  const { data, isLoading, error, refetch } = useGetProfileQuery();

  const profile = data?.data;

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
        onRetry={refetch}
        retryLabel={t('common:retry')}
      />
    );
  }

  return (
    <Box>
      <PageHeader title={t('title')} />

      <Stack spacing={3}>
        {profile && <ProfileForm profile={profile} />}
        <PasswordChangeForm />
        <LanguageSelector />
      </Stack>
    </Box>
  );
}
