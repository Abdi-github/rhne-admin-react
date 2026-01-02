import { describe, it, expect } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { ServiceTable } from '../components/ServiceTable';
import { mockServices } from '@/test/data/services';

const defaultProps = {
  data: mockServices,
  total: mockServices.length,
  paginationModel: { page: 0, pageSize: 20 },
  onPaginationModelChange: () => {},
  isLoading: false,
  onView: () => {},
  onEdit: () => {},
  onDelete: () => {},
};

describe('ServiceTable', () => {
  it('renders all service rows', () => {
    renderWithProviders(<ServiceTable {...defaultProps} />);

    expect(screen.getByText('Cardiologie')).toBeInTheDocument();
    expect(screen.getByText('Oncologie')).toBeInTheDocument();
    expect(screen.getByText('Pédiatrie')).toBeInTheDocument();
  });

  it('displays category column', () => {
    renderWithProviders(<ServiceTable {...defaultProps} />);

    // Two services share category 'Médecine interne'
    const internalMed = screen.getAllByText('Médecine interne');
    expect(internalMed.length).toBe(2);
    expect(screen.getByText('Chirurgie')).toBeInTheDocument();
  });

  it('renders active/inactive status chips', () => {
    renderWithProviders(<ServiceTable {...defaultProps} />);

    const activeChips = screen.getAllByText('Actif');
    const inactiveChips = screen.getAllByText('Inactif');

    expect(activeChips.length).toBe(2); // Cardiologie + Oncologie
    expect(inactiveChips.length).toBe(1); // Pédiatrie
  });

  it('renders action buttons for each row', () => {
    renderWithProviders(<ServiceTable {...defaultProps} />);

    const viewButtons = screen.getAllByLabelText('Voir');
    const editButtons = screen.getAllByLabelText('Modifier');
    const deleteButtons = screen.getAllByLabelText('Supprimer');

    expect(viewButtons.length).toBe(3);
    expect(editButtons.length).toBe(3);
    expect(deleteButtons.length).toBe(3);
  });

  it('calls onView when view button is clicked', async () => {
    const onView = vi.fn();
    const { user } = renderWithProviders(
      <ServiceTable {...defaultProps} onView={onView} />,
    );

    const viewButtons = screen.getAllByLabelText('Voir');
    await user.click(viewButtons[0]);

    expect(onView).toHaveBeenCalledWith('service-1');
  });

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    const { user } = renderWithProviders(
      <ServiceTable {...defaultProps} onEdit={onEdit} />,
    );

    const editButtons = screen.getAllByLabelText('Modifier');
    await user.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledWith('service-1');
  });

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    const { user } = renderWithProviders(
      <ServiceTable {...defaultProps} onDelete={onDelete} />,
    );

    const deleteButtons = screen.getAllByLabelText('Supprimer');
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith('service-1');
  });

  it('shows loading state', () => {
    renderWithProviders(
      <ServiceTable {...defaultProps} data={[]} isLoading={true} />,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays empty grid when no data', () => {
    renderWithProviders(
      <ServiceTable {...defaultProps} data={[]} total={0} />,
    );

    expect(screen.getByText('No rows')).toBeInTheDocument();
  });

  it('renders service name avatar fallback with first letter', () => {
    renderWithProviders(
      <ServiceTable
        {...defaultProps}
        data={[{ ...mockServices[1], image_url: '' }]}
        total={1}
      />,
    );

    // Oncologie has no image, avatar should show 'O'
    const avatars = screen.getAllByText('O');
    expect(avatars.length).toBeGreaterThan(0);
  });
});
