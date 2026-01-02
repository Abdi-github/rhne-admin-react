import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { DoctorTable } from '../components/DoctorTable';
import { mockDoctors } from '@/test/data/doctors';

describe('DoctorTable', () => {
  const defaultProps = {
    data: mockDoctors,
    total: mockDoctors.length,
    paginationModel: { page: 0, pageSize: 20 },
    onPaginationModelChange: vi.fn(),
    isLoading: false,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders all doctor rows', () => {
    renderWithProviders(<DoctorTable {...defaultProps} />);

    // Doctor 1: "Dr Jean Dupont" (title + name combined by valueGetter)
    expect(screen.getByText('Dr Jean Dupont')).toBeInTheDocument();
    // Doctor 2: "Pr Marie Curie"
    expect(screen.getByText('Pr Marie Curie')).toBeInTheDocument();
    // Doctor 3: no title, just name
    expect(screen.getByText('Pierre Martin')).toBeInTheDocument();
  });

  it('displays service name column', () => {
    renderWithProviders(<DoctorTable {...defaultProps} />);

    const medicineCells = screen.getAllByText('Médecine interne');
    expect(medicineCells.length).toBe(2);
    expect(screen.getByText('Oncologie')).toBeInTheDocument();
  });

  it('renders active/inactive status chips', () => {
    renderWithProviders(<DoctorTable {...defaultProps} />);

    const activeChips = screen.getAllByText('Actif');
    expect(activeChips.length).toBe(2);
    expect(screen.getByText('Inactif')).toBeInTheDocument();
  });

  it('renders action buttons for each row', () => {
    renderWithProviders(<DoctorTable {...defaultProps} />);

    const editButtons = screen.getAllByTestId('EditIcon');
    expect(editButtons.length).toBe(3);

    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    expect(deleteButtons.length).toBe(3);
  });

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    const { user } = renderWithProviders(
      <DoctorTable {...defaultProps} onEdit={onEdit} />,
    );

    const editButtons = screen.getAllByTestId('EditIcon');
    await user.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledWith('doctor-1');
  });

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    const { user } = renderWithProviders(
      <DoctorTable {...defaultProps} onDelete={onDelete} />,
    );

    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith('doctor-1');
  });

  it('shows loading state', () => {
    renderWithProviders(<DoctorTable {...defaultProps} isLoading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays empty grid when no data', () => {
    renderWithProviders(<DoctorTable {...defaultProps} data={[]} total={0} />);

    expect(screen.getByText('No rows')).toBeInTheDocument();
  });

  it('renders doctor avatar with first letter fallback', () => {
    renderWithProviders(<DoctorTable {...defaultProps} />);

    const avatars = document.querySelectorAll('.MuiAvatar-root');
    expect(avatars.length).toBe(3);
  });
});
