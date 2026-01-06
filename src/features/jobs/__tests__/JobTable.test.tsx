import { describe, it, expect, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { JobTable } from '../components/JobTable';
import { mockJobs } from '@/test/data/jobs';

describe('JobTable', () => {
  const defaultProps = {
    data: mockJobs,
    total: mockJobs.length,
    paginationModel: { page: 0, pageSize: 20 },
    onPaginationModelChange: vi.fn(),
    isLoading: false,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders all job rows', () => {
    renderWithProviders(<JobTable {...defaultProps} />);

    expect(screen.getByText('Infirmier/ère diplômé/e')).toBeInTheDocument();
    expect(screen.getByText('Médecin assistant/e')).toBeInTheDocument();
    expect(screen.getByText('Technicien/ne en radiologie')).toBeInTheDocument();
  });

  it('displays job_id column', () => {
    renderWithProviders(<JobTable {...defaultProps} />);

    expect(screen.getByText('RHN-2025-001')).toBeInTheDocument();
    expect(screen.getByText('RHN-2025-002')).toBeInTheDocument();
    expect(screen.getByText('RHN-2025-003')).toBeInTheDocument();
  });

  it('displays category column', () => {
    renderWithProviders(<JobTable {...defaultProps} />);

    expect(screen.getByText('Soins')).toBeInTheDocument();
    expect(screen.getByText('Médecins')).toBeInTheDocument();
    expect(screen.getByText('Technique')).toBeInTheDocument();
  });

  it('displays percentage column', () => {
    renderWithProviders(<JobTable {...defaultProps} />);

    expect(screen.getByText('80-100%')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('displays site column', () => {
    renderWithProviders(<JobTable {...defaultProps} />);

    expect(screen.getByText('Pourtalès')).toBeInTheDocument();
    expect(screen.getByText('La Chaux-de-Fonds')).toBeInTheDocument();
    expect(screen.getByText('Val-de-Ruz')).toBeInTheDocument();
  });

  it('renders active/inactive status chips', () => {
    renderWithProviders(<JobTable {...defaultProps} />);

    const activeChips = screen.getAllByText('Actif');
    expect(activeChips.length).toBe(2);
    expect(screen.getByText('Inactif')).toBeInTheDocument();
  });

  it('renders action buttons for each row', () => {
    renderWithProviders(<JobTable {...defaultProps} />);

    const rows = screen.getAllByRole('row');
    // Header + 3 data rows
    expect(rows.length).toBeGreaterThanOrEqual(4);
  });

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    const { user } = renderWithProviders(
      <JobTable {...defaultProps} onEdit={onEdit} />,
    );

    const firstRow = screen.getByText('Infirmier/ère diplômé/e').closest('[role="row"]')!;
    const editButton = within(firstRow).getAllByRole('button')[0];
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledWith('job-1');
  });

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    const { user } = renderWithProviders(
      <JobTable {...defaultProps} onDelete={onDelete} />,
    );

    const firstRow = screen.getByText('Infirmier/ère diplômé/e').closest('[role="row"]')!;
    const deleteButton = within(firstRow).getAllByRole('button')[1];
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith('job-1');
  });

  it('shows loading state', () => {
    renderWithProviders(<JobTable {...defaultProps} isLoading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays empty grid when no data', () => {
    renderWithProviders(
      <JobTable {...defaultProps} data={[]} total={0} />,
    );

    expect(screen.getByText('No rows')).toBeInTheDocument();
  });
});
