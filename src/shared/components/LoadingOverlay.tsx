import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

export function LoadingOverlay({ open, message }: LoadingOverlayProps) {
  return (
    <Backdrop
      open={open}
      role="alert"
      aria-live="polite"
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress color="inherit" />
      {message && (
        <Box>
          <Typography variant="body2">{message}</Typography>
        </Box>
      )}
    </Backdrop>
  );
}
