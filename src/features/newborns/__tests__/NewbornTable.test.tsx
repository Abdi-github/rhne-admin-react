import { describe, it, expect, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { NewbornTable } from '../components/NewbornTable';
import { mockNewborns } from '@/test/data/newborns';

describe('NewbornTable', () => {
  const defaultProps = {
    data: mockNewborns,
    total: mockNewborns.length,
    paginationModel: { page: 0, pageSize: 20 },
    onPaginationModelChange: vi.fn(),
    isLoading: false,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders all newborn rows', () => {
    renderWithProviders(<NewbornTable {...defaultProps} />);

    expect(screen.getByText('Emma')).toBeInTheDocument();
    expect(screen.getByText('Léo')).toBeInTheDocument();
    expect(screen.getByText('Chloé')).toBeInTheDocument();
  });

  it('displays formatted date column', () => {
    renderWithProviders(<NewbornTable {...defaultProps} />);

    expect(screen.getByText('15/06/2025')).toBeInTheDocument();
    expect(screen.getByText('10/06/2025')).toBeInTheDocument();
    expect(screen.getByText('20/05/2025')).toBeInTheDocument();
  });

  it('renders avatar images', () => {
    renderWithProviders(<NewbornTable {...defaultProps} />);

    const avatars = screen.getAllByRole('img');
    expect(avatars.length).toBeGreaterThanOrEqual(2);
  });

  it('renders action buttons for each row', () => {
    renderWithProviders(<NewbornTable {...defaultProps} />);

    const rows = screen.getAllByRole('row');
    // Header + 3 data rows
    expect(rows.length).toBeGreaterThanOrEqual(4);
  });

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    const { user } = renderWithProviders(
      <NewbornTable {...defaultProps} onEdit={onEdit} />,
    );

    const firstRow = screen.getByText('Emma').closest('[role="row"]')!;
    const editButton = within(firstRow).getAllByRole('button')[0];
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledWith('newborn-1');
  });

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    const { user } = renderWithProviders(
      <NewbornTable {...defaultProps} onDelete={onDelete} />,
    );

    const firstRow = screen.getByText('Emma').closest('[role="row"]')!;
    const deleteButton = within(firstRow).getAllByRole('button')[1];
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith('newborn-1');
  });

  it('shows loading state', () => {
    renderWithProviders(<NewbornTable {...defaultProps} isLoading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays empty grid when no data', () => {
    renderWithProviders(
      <NewbornTable {...defaultProps} data={[]} total={0} />,
    );

    expect(screen.getByText('No rows')).toBeInTheDocument();
  });
});
