import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Chip, Box, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import type { PatientInfo } from '../patient-info.types';

interface PatientInfoTableProps {
  data: PatientInfo[];
  total: number;
  paginationModel: { page: number; pageSize: number };
  onPaginationModelChange: (model: { page: number; pageSize: number }) => void;
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PatientInfoTable({
  data,
  total,
  paginationModel,
  onPaginationModelChange,
  isLoading,
  onEdit,
  onDelete,
}: PatientInfoTableProps) {
  const { t } = useTranslation(['patient-info', 'common']);

  const columns: GridColDef<PatientInfo>[] = [
    {
      field: 'title',
      headerName: t('patient-info:page_title'),
      flex: 1,
      minWidth: 200,
      valueGetter: (_, row) => row.title.fr,
    },
    {
      field: 'section',
      headerName: t('patient-info:section'),
      width: 180,
    },
    {
      field: 'sections_count',
      headerName: t('patient-info:sections'),
      width: 100,
      valueGetter: (_, row) => row.sections.length,
    },
    {
      field: 'url',
      headerName: t('patient-info:url'),
      width: 200,
      renderCell: ({ value }) =>
        value ? (
          <Chip label={value} size="small" variant="outlined" />
        ) : (
          '—'
        ),
    },
    {
      field: 'actions',
      headerName: t('common:actions'),
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box>
          <Tooltip title={t('common:edit')}>
            <IconButton size="small" onClick={() => onEdit(row._id)} aria-label={t('common:edit')}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common:delete')}>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(row._id)}
              aria-label={t('common:delete')}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <DataGrid
      rows={data}
      columns={columns}
      getRowId={(row) => row._id}
      rowCount={total}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationModelChange}
      paginationMode="server"
      pageSizeOptions={[10, 20, 50]}
      loading={isLoading}
      disableRowSelectionOnClick
      autoHeight
      sx={{ mt: 2 }}
    />
  );
}
