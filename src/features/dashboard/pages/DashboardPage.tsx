import { Box, Typography, Grid2 as Grid, Card, CardContent, Skeleton } from '@mui/material';
import {
  LocalHospital,
  MedicalServices,
  Person,
  Event,
  Work,
  ChildCare,
  Info,
  People,
} from '@mui/icons-material';
import { PageHeader } from '@/shared/components/PageHeader';
import { ErrorState } from '@/shared/components/ErrorState';
import { useTranslation } from 'react-i18next';
import { useGetDashboardStatsQuery } from '../dashboard.api';
import type { DashboardStats } from '../dashboard.types';
import type { SvgIconComponent } from '@mui/icons-material';

interface StatCard {
  key: keyof DashboardStats['total'];
  navKey: string;
  icon: SvgIconComponent;
  color: string;
}

const statsCards: StatCard[] = [
  { key: 'sites', navKey: 'sites', icon: LocalHospital, color: '#1565c0' },
  { key: 'services', navKey: 'services', icon: MedicalServices, color: '#2e7d32' },
  { key: 'doctors', navKey: 'doctors', icon: Person, color: '#e65100' },
  { key: 'events', navKey: 'events', icon: Event, color: '#6a1b9a' },
  { key: 'jobs', navKey: 'jobs', icon: Work, color: '#00838f' },
  { key: 'newborns', navKey: 'newborns', icon: ChildCare, color: '#c62828' },
  { key: 'patient_info', navKey: 'patient_info', icon: Info, color: '#4527a0' },
  { key: 'users', navKey: 'users', icon: People, color: '#37474f' },
];

export default function DashboardPage() {
  const { t } = useTranslation(['common', 'dashboard']);
  const { data, isLoading, error, refetch } = useGetDashboardStatsQuery();

  const stats = data?.data;

  return (
    <Box>
      <PageHeader
        title={t('common:nav.dashboard')}
        subtitle={t('dashboard:subtitle')}
      />

      {error ? (
        <ErrorState
          title={t('common:error_loading')}
          description={t('common:error_loading_description')}
          onRetry={refetch}
          retryLabel={t('common:retry')}
        />
      ) : (
      <Grid container spacing={3}>
        {statsCards.map((card) => {
          const Icon = card.icon;
          const count = stats?.total[card.key];
          const activeCount = card.key in (stats?.active ?? {})
            ? (stats?.active as Record<string, number>)[card.key]
            : undefined;

          return (
            <Grid key={card.key} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card>
                <CardContent
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 3,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: `${card.color}15`,
                      color: card.color,
                      borderRadius: 2,
                      p: 1.5,
                      display: 'flex',
                    }}
                  >
                    <Icon />
                  </Box>
                  <Box>
                    {isLoading ? (
                      <Skeleton width={60} height={40} />
                    ) : (
                      <Typography variant="h4" fontWeight={700}>
                        {count ?? '—'}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {t(`common:nav.${card.navKey}`)}
                    </Typography>
                    {activeCount !== undefined && !isLoading && (
                      <Typography variant="caption" color="success.main">
                        {activeCount} {t('common:active').toLowerCase()}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      )}
    </Box>
  );
}
