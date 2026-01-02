import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { SiteTable } from '../components/SiteTable';
import { mockSites } from '@/test/data/sites';

describe('SiteTable', () => {
  const defaultProps = {
    data: mockSites,
    total: mockSites.length,
    paginationModel: { page: 0, pageSize: 20 },
    onPaginationModelChange: vi.fn(),
    isLoading: false,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders all site rows', () => {
    renderWithProviders(<SiteTable {...defaultProps} />);

    expect(screen.getByText('Hôpital Pourtalès')).toBeInTheDocument();
    expect(screen.getByText('Hôpital de La Chaux-de-Fonds')).toBeInTheDocument();
    expect(screen.getByText('Centre de réadaptation de Couvet')).toBeInTheDocument();
  });

  it('displays type column in current language', () => {
    renderWithProviders(<SiteTable {...defaultProps} />);

    const acuteCells = screen.getAllByText('Soins aigus');
    expect(acuteCells.length).toBe(2);
    expect(screen.getByText('Réadaptation')).toBeInTheDocument();
  });

  it('displays city column', () => {
    renderWithProviders(<SiteTable {...defaultProps} />);

    expect(screen.getByText('Neuchâtel')).toBeInTheDocument();
    expect(screen.getByText('La Chaux-de-Fonds')).toBeInTheDocument();
    expect(screen.getByText('Couvet')).toBeInTheDocument();
  });

  it('renders active/inactive status chips', () => {
    renderWithProviders(<SiteTable {...defaultProps} />);

    const activeChips = screen.getAllByText('Actif');
    expect(activeChips.length).toBe(2);
    expect(screen.getByText('Inactif')).toBeInTheDocument();
  });

  it('renders action buttons for each row', () => {
    renderWithProviders(<SiteTable {...defaultProps} />);

    const editButtons = screen.getAllByTestId('EditIcon');
    expect(editButtons.length).toBe(3);

    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    expect(deleteButtons.length).toBe(3);
  });

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    const { user } = renderWithProviders(
      <SiteTable {...defaultProps} onEdit={onEdit} />,
    );

    const editButtons = screen.getAllByTestId('EditIcon');
    await user.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledWith('site-1');
  });

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    const { user } = renderWithProviders(
      <SiteTable {...defaultProps} onDelete={onDelete} />,
    );

    const deleteButtons = screen.getAllByTestId('DeleteIcon');
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith('site-1');
  });

  it('shows loading state', () => {
    renderWithProviders(<SiteTable {...defaultProps} isLoading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays empty grid when no data', () => {
    renderWithProviders(<SiteTable {...defaultProps} data={[]} total={0} />);

    expect(screen.getByText('No rows')).toBeInTheDocument();
  });

  it('renders site avatar with first letter fallback', () => {
    renderWithProviders(<SiteTable {...defaultProps} />);

    // Sites with no image_url should show first letter
    const avatars = document.querySelectorAll('.MuiAvatar-root');
    expect(avatars.length).toBe(3);
  });
});
