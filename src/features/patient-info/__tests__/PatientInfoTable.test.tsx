import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { PatientInfoTable } from '../components/PatientInfoTable';
import { mockPatientInfoPages } from '@/test/data/patient-info';

const defaultProps = {
  data: mockPatientInfoPages,
  total: mockPatientInfoPages.length,
  paginationModel: { page: 0, pageSize: 20 },
  onPaginationModelChange: vi.fn(),
  isLoading: false,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe('PatientInfoTable', () => {
  it('renders all patient info rows', () => {
    renderWithProviders(<PatientInfoTable {...defaultProps} />);

    expect(screen.getByText("Admission à l'hôpital")).toBeInTheDocument();
    expect(screen.getByText('Droits des patients')).toBeInTheDocument();
    expect(screen.getByText('Sortie et suivi')).toBeInTheDocument();
  });

  it('displays section column', () => {
    renderWithProviders(<PatientInfoTable {...defaultProps} />);

    // Two rows have 'Séjour' section (pi-1 and pi-3)
    const sejourCells = screen.getAllByText('Séjour');
    expect(sejourCells.length).toBe(2);
    expect(screen.getByText('Droits')).toBeInTheDocument();
  });

  it('displays sections count', () => {
    renderWithProviders(<PatientInfoTable {...defaultProps} />);

    // pi-1 has 2 sections, pi-2 has 1, pi-3 has 0
    const cells = screen.getAllByRole('gridcell');
    const values = cells.map((c) => c.textContent);
    expect(values).toContain('2');
    expect(values).toContain('1');
    expect(values).toContain('0');
  });

  it('renders action buttons for each row', () => {
    renderWithProviders(<PatientInfoTable {...defaultProps} />);

    // 3 data rows each have edit + delete buttons
    const editButtons = screen.getAllByLabelText(/Modifier/i);
    const deleteButtons = screen.getAllByLabelText(/Supprimer/i);
    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
  });

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    const { user } = renderWithProviders(
      <PatientInfoTable {...defaultProps} onEdit={onEdit} />
    );

    const editButtons = screen.getAllByLabelText(/Modifier/i);
    await user.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledWith('pi-1');
  });

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    const { user } = renderWithProviders(
      <PatientInfoTable {...defaultProps} onDelete={onDelete} />
    );

    const deleteButtons = screen.getAllByLabelText(/Supprimer/i);
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith('pi-1');
  });

  it('shows loading state', () => {
    renderWithProviders(
      <PatientInfoTable {...defaultProps} isLoading={true} data={[]} total={0} />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    renderWithProviders(
      <PatientInfoTable {...defaultProps} data={[]} total={0} />
    );

    expect(screen.getByText('No rows')).toBeInTheDocument();
  });
});
