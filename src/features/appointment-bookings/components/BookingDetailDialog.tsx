import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Chip,
  Divider,
  Box,
  TextField,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { AppointmentBooking, BookingStatus } from '../appointment-bookings.types';

const STATUS_COLORS: Record<BookingStatus, 'warning' | 'success' | 'error' | 'info' | 'default'> = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'error',
  completed: 'info',
  no_show: 'default',
};

const STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled', 'no_show'],
  cancelled: [],
  completed: [],
  no_show: [],
};

interface BookingDetailDialogProps {
  booking: AppointmentBooking | null;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: BookingStatus, notes?: string) => void;
  isUpdating: boolean;
}

export function BookingDetailDialog({
  booking,
  open,
  onClose,
  onUpdateStatus,
  isUpdating,
}: BookingDetailDialogProps) {
  const { t, i18n } = useTranslation(['bookings', 'appointments', 'common']);
  const lang = i18n.language as 'fr' | 'en' | 'de' | 'it';
  const [newStatus, setNewStatus] = useState<BookingStatus | ''>('');
  const [notes, setNotes] = useState('');

  if (!booking) return null;

  const allowedTransitions = STATUS_TRANSITIONS[booking.status] || [];
  const canUpdate = allowedTransitions.length > 0;

  const handleUpdate = () => {
    if (newStatus) {
      onUpdateStatus(booking._id, newStatus, notes || undefined);
      setNewStatus('');
      setNotes('');
    }
  };

  const handleClose = () => {
    setNewStatus('');
    setNotes('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
            {booking.booking_reference}
          </Typography>
          <Chip
            label={t(`bookings:statuses.${booking.status}`)}
            size="small"
            color={STATUS_COLORS[booking.status]}
          />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('bookings:patient')}
            </Typography>
            <Typography>
              {booking.patient_info.first_name} {booking.patient_info.last_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {booking.patient_info.email} &middot; {booking.patient_info.phone}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('bookings:dob')}: {new Date(booking.patient_info.date_of_birth).toLocaleDateString(lang)}
            </Typography>
          </Grid>

          <Grid size={12}>
            <Divider />
          </Grid>

          <Grid size={6}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('appointments:appointment_type')}
            </Typography>
            <Chip
              label={t(`appointments:types.${booking.appointment_type}`)}
              size="small"
              variant="outlined"
            />
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('bookings:site')}
            </Typography>
            <Typography>{booking.site_id?.name?.[lang] || '—'}</Typography>
          </Grid>

          <Grid size={6}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('bookings:date')}
            </Typography>
            <Typography>
              {new Date(booking.preferred_date).toLocaleDateString(lang)}
            </Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('bookings:time_slot')}
            </Typography>
            <Typography>{booking.preferred_time_slot}</Typography>
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle2" color="text.secondary">
              {t('bookings:reason')}
            </Typography>
            <Typography>{booking.reason}</Typography>
          </Grid>

          {booking.symptoms && booking.symptoms.length > 0 && (
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('bookings:symptoms')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {booking.symptoms.map((s, i) => (
                  <Chip key={i} label={s} size="small" variant="outlined" />
                ))}
              </Box>
            </Grid>
          )}

          {booking.notes && (
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('bookings:notes')}
              </Typography>
              <Typography>{booking.notes}</Typography>
            </Grid>
          )}

          {booking.confirmed_by && (
            <Grid size={12}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('bookings:confirmed_by')}
              </Typography>
              <Typography>
                {booking.confirmed_by.first_name} {booking.confirmed_by.last_name}
                {booking.confirmed_at &&
                  ` — ${new Date(booking.confirmed_at).toLocaleDateString(lang)}`}
              </Typography>
            </Grid>
          )}

          <Grid size={12}>
            <Typography variant="body2" color="text.secondary">
              {t('bookings:submitted')}: {new Date(booking.createdAt).toLocaleString(lang)}
            </Typography>
          </Grid>

          {canUpdate && (
            <>
              <Grid size={12}>
                <Divider />
              </Grid>
              <Grid size={6}>
                <TextField
                  select
                  label={t('bookings:update_status')}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as BookingStatus)}
                  size="small"
                  fullWidth
                >
                  {allowedTransitions.map((s) => (
                    <MenuItem key={s} value={s}>
                      {t(`bookings:statuses.${s}`)}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={6}>
                <TextField
                  label={t('bookings:notes')}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  size="small"
                  fullWidth
                  multiline
                  maxRows={3}
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('common:close')}</Button>
        {canUpdate && (
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={!newStatus || isUpdating}
          >
            {t('bookings:update_status')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
