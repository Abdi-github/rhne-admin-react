import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';

interface FormDialogProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  children: ReactNode;
  submitLabel?: string;
  isLoading?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
}

export function FormDialog({
  open,
  title,
  onClose,
  onSubmit,
  children,
  submitLabel,
  isLoading = false,
  maxWidth = 'sm',
}: FormDialogProps) {
  const { t } = useTranslation('common');

  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {title}
          <IconButton size="small" onClick={onClose} aria-label={t('close')}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          {t('cancel')}
        </Button>
        <Button onClick={onSubmit} variant="contained" disabled={isLoading}>
          {submitLabel ?? t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
