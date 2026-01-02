import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { PermissionTable } from '../components/PermissionTable';
import { mockPermissions } from '@/test/data/rbac';

describe('PermissionTable', () => {
  const defaultProps = {
    data: mockPermissions.slice(0, 8), // first 8: sites + services
    total: 36,
    paginationModel: { page: 0, pageSize: 20 },
    onPaginationModelChange: vi.fn(),
    isLoading: false,
  };

  it('renders permission names', () => {
    renderWithProviders(<PermissionTable {...defaultProps} />);

    expect(screen.getByText('sites.read')).toBeInTheDocument();
    expect(screen.getByText('sites.create')).toBeInTheDocument();
    expect(screen.getByText('services.read')).toBeInTheDocument();
  });

  it('renders resource column', () => {
    renderWithProviders(<PermissionTable {...defaultProps} />);

    const sitesCells = screen.getAllByText('sites');
    expect(sitesCells.length).toBeGreaterThanOrEqual(4);
  });

  it('renders action chips with translations', () => {
    renderWithProviders(<PermissionTable {...defaultProps} />);

    expect(screen.getAllByText('Lecture').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Création').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Modification').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Suppression').length).toBeGreaterThanOrEqual(1);
  });

  it('renders display_name column', () => {
    renderWithProviders(<PermissionTable {...defaultProps} />);

    expect(screen.getByText('Read Sites')).toBeInTheDocument();
    expect(screen.getByText('Create Sites')).toBeInTheDocument();
  });

  it('renders active status chips', () => {
    renderWithProviders(<PermissionTable {...defaultProps} />);

    const activeChips = screen.getAllByText('Actif');
    expect(activeChips.length).toBeGreaterThanOrEqual(8);
  });

  it('shows loading state', () => {
    renderWithProviders(<PermissionTable {...defaultProps} isLoading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders empty table with no data', () => {
    renderWithProviders(
      <PermissionTable {...defaultProps} data={[]} total={0} />,
    );

    expect(screen.getByText('No rows')).toBeInTheDocument();
  });
});
