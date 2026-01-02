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
  Link as MuiLink,
} from '@mui/material';
import { Edit, Delete, OpenInNew } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { ServiceLink } from '../services.types';

interface ServiceLinksTableProps {
  links: ServiceLink[];
  isLoading: boolean;
  onEdit: (link: ServiceLink) => void;
  onDelete: (id: string) => void;
}

export function ServiceLinksTable({
  links,
  isLoading,
  onEdit,
  onDelete,
}: ServiceLinksTableProps) {
  const { t, i18n } = useTranslation(['services', 'common']);
  const lang = i18n.language as 'fr' | 'en' | 'de' | 'it';

  if (!isLoading && links.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
        {t('services:links.no_links')}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{t('services:links.link_title')}</TableCell>
            <TableCell>{t('services:links.url')}</TableCell>
            <TableCell align="right">{t('common:actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link._id}>
              <TableCell>
                {link.title[lang] || link.title.fr || '—'}
              </TableCell>
              <TableCell>
                <MuiLink
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                >
                  {link.url}
                  <OpenInNew fontSize="inherit" />
                </MuiLink>
              </TableCell>
              <TableCell align="right">
                <Tooltip title={t('common:edit')}>
                  <IconButton size="small" onClick={() => onEdit(link)} aria-label={t('common:edit')}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('common:delete')}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDelete(link._id)}
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
