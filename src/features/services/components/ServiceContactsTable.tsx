import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Typography,
  Paper,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { ServiceContact } from '../services.types';

interface ServiceContactsTableProps {
  contacts: ServiceContact[];
  isLoading: boolean;
  onEdit: (contact: ServiceContact) => void;
  onDelete: (id: string) => void;
}

export function ServiceContactsTable({
  contacts,
  isLoading,
  onEdit,
  onDelete,
}: ServiceContactsTableProps) {
  const { t, i18n } = useTranslation(['services', 'common']);
  const lang = i18n.language as 'fr' | 'en' | 'de' | 'it';

  if (!isLoading && contacts.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
        {t('services:contacts.no_contacts')}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('services:contacts.site_name')}</TableCell>
            <TableCell>{t('services:contacts.email')}</TableCell>
            <TableCell>{t('services:contacts.phone')}</TableCell>
            <TableCell>{t('services:contacts.hours')}</TableCell>
            <TableCell align="right">{t('common:actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact._id}>
              <TableCell>{contact.site_name || '—'}</TableCell>
              <TableCell>{contact.email || '—'}</TableCell>
              <TableCell>{contact.phone || '—'}</TableCell>
              <TableCell>
                {contact.hours?.[lang] || contact.hours?.fr || '—'}
              </TableCell>
              <TableCell align="right">
                <Tooltip title={t('common:edit')}>
                  <IconButton size="small" onClick={() => onEdit(contact)} aria-label={t('common:edit')}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('common:delete')}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(contact._id)}
                    aria-label={t('common:delete')}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
