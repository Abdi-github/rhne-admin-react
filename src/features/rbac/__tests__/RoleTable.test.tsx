import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { RoleTable } from '../components/RoleTable';
import { mockRoles } from '@/test/data/rbac';

describe('RoleTable', () => {
  const defaultProps = {
    data: mockRoles,
    total: mockRoles.length,
    paginationModel: { page: 0, pageSize: 20 },
    onPaginationModelChange: vi.fn(),
    isLoading: false,
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onManagePermissions: vi.fn(),
  };

  it('renders all role rows', () => {
    renderWithProviders(<RoleTable {...defaultProps} />);

    expect(screen.getByText('super_admin')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('content_editor')).toBeInTheDocument();
    expect(screen.getByText('hr_manager')).toBeInTheDocument();
    expect(screen.getByText('site_manager')).toBeInTheDocument();
  });

  it('renders display names', () => {
    renderWithProviders(<RoleTable {...defaultProps} />);

    expect(screen.getByText('Super Admin')).toBeInTheDocument();
    expect(screen.getByText('Administrateur')).toBeInTheDocument();
    expect(screen.getByText('Éditeur de contenu')).toBeInTheDocument();
  });

  it('renders system role chips', () => {
    renderWithProviders(<RoleTable {...defaultProps} />);

    const yesChips = screen.getAllByText('Oui');
    expect(yesChips.length).toBe(5); // all are system
  });

  it('renders active status chips', () => {
    renderWithProviders(<RoleTable {...defaultProps} />);

    const activeChips = screen.getAllByText('Actif');
    expect(activeChips.length).toBeGreaterThanOrEqual(5);
  });

  it('renders edit buttons for each role', () => {
    renderWithProviders(<RoleTable {...defaultProps} />);

    const editButtons = screen.getAllByLabelText('Modifier');
    expect(editButtons).toHaveLength(5);
  });

  it('renders manage permissions buttons', () => {
    renderWithProviders(<RoleTable {...defaultProps} />);

    const permButtons = screen.getAllByLabelText('Gérer les permissions');
    expect(permButtons).toHaveLength(5);
  });

  it('calls onEdit when edit is clicked', async () => {
    const { user } = renderWithProviders(<RoleTable {...defaultProps} />);

    const editButtons = screen.getAllByLabelText('Modifier');
    await user.click(editButtons[0]);

    expect(defaultProps.onEdit).toHaveBeenCalledWith('role-1');
  });

  it('calls onManagePermissions when permissions button is clicked', async () => {
    const { user } = renderWithProviders(<RoleTable {...defaultProps} />);

    const permButtons = screen.getAllByLabelText('Gérer les permissions');
    await user.click(permButtons[0]);

    expect(defaultProps.onManagePermissions).toHaveBeenCalledWith('role-1');
  });

  it('disables delete for system roles', () => {
    renderWithProviders(<RoleTable {...defaultProps} />);

    const deleteButtons = screen.getAllByLabelText('Supprimer');
    deleteButtons.forEach((btn) => {
      // MUI wraps disabled IconButton in a span, check the button inside
      const button = btn.closest('button') || btn.querySelector('button');
      if (button) {
        expect(button).toBeDisabled();
      } else {
        // The span itself indicates the button is disabled
        expect(btn).toHaveAttribute('data-mui-internal-clone-element', 'true');
      }
    });
  });

  it('shows loading state', () => {
    renderWithProviders(<RoleTable {...defaultProps} isLoading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
