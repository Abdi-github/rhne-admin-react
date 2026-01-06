import { describe, it, expect, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { EventTable } from '../components/EventTable';
import { mockEvents } from '@/test/data/events';

describe('EventTable', () => {
  const defaultProps = {
    data: mockEvents,
    total: mockEvents.length,
    paginationModel: { page: 0, pageSize: 20 },
    onPaginationModelChange: vi.fn(),
    isLoading: false,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders all event rows', () => {
    renderWithProviders(<EventTable {...defaultProps} />);

    expect(screen.getByText('Journée portes ouvertes')).toBeInTheDocument();
    expect(screen.getByText('Conférence cardiologie')).toBeInTheDocument();
    expect(screen.getByText('Formation premiers secours')).toBeInTheDocument();
  });

  it('displays formatted date column', () => {
    renderWithProviders(<EventTable {...defaultProps} />);

    expect(screen.getByText('15/09/2025')).toBeInTheDocument();
    expect(screen.getByText('20/10/2025')).toBeInTheDocument();
    expect(screen.getByText('10/03/2025')).toBeInTheDocument();
  });

  it('displays location column', () => {
    renderWithProviders(<EventTable {...defaultProps} />);

    expect(screen.getByText('Hôpital Pourtalès, Neuchâtel')).toBeInTheDocument();
    expect(screen.getByText('La Chaux-de-Fonds')).toBeInTheDocument();
  });

  it('displays category column', () => {
    renderWithProviders(<EventTable {...defaultProps} />);

    expect(screen.getByText('Événement public')).toBeInTheDocument();
    expect(screen.getByText('Conférence')).toBeInTheDocument();
  });

  it('renders active/inactive status chips', () => {
    renderWithProviders(<EventTable {...defaultProps} />);

    const activeChips = screen.getAllByText('Actif');
    expect(activeChips.length).toBe(2);
    expect(screen.getByText('Inactif')).toBeInTheDocument();
  });

  it('renders action buttons for each row', () => {
    renderWithProviders(<EventTable {...defaultProps} />);

    const rows = screen.getAllByRole('row');
    // Header + 3 data rows
    expect(rows.length).toBeGreaterThanOrEqual(4);
  });

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    const { user } = renderWithProviders(
      <EventTable {...defaultProps} onEdit={onEdit} />,
    );

    const firstRow = screen.getByText('Journée portes ouvertes').closest('[role="row"]')!;
    const editButton = within(firstRow).getAllByRole('button')[0];
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledWith('event-1');
  });

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    const { user } = renderWithProviders(
      <EventTable {...defaultProps} onDelete={onDelete} />,
    );

    const firstRow = screen.getByText('Journée portes ouvertes').closest('[role="row"]')!;
    const deleteButton = within(firstRow).getAllByRole('button')[1];
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith('event-1');
  });

  it('shows loading state', () => {
    renderWithProviders(<EventTable {...defaultProps} isLoading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays empty grid when no data', () => {
    renderWithProviders(
      <EventTable {...defaultProps} data={[]} total={0} />,
    );

    expect(screen.getByText('No rows')).toBeInTheDocument();
  });
});
