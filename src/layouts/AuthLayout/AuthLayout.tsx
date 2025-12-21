import { Box, Card, CardContent, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { LocalHospital } from '@mui/icons-material';

export function AuthLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 440, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mb: 4,
            }}
          >
            <LocalHospital color="primary" sx={{ fontSize: 36 }} />
            <Typography variant="h5" fontWeight={700} color="primary">
              RHNe Admin
            </Typography>
          </Box>
          <Outlet />
        </CardContent>
      </Card>
    </Box>
  );
}
