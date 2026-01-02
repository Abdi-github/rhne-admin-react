import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { RoleAssignmentDialog } from '../components/RoleAssignmentDialog';
import { mockRoles } from '@/test/data/rbac';

describe('RoleAssignmentDialog', () => {
  const mockOnClose = vi.fn();
  const mockOnAssign = vi.fn();
  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onAssign: mockOnAssign,
    currentRoleIds: ['role-1'],
    availableRoles: mockRoles,
    isLoading: false,
    isRolesLoading: false,
    userName: 'Jean Dupont',
  };

  it('renders dialog title with user name', () => {
    renderWithProviders(<RoleAssignmentDialog {...defaultProps} />);

    expect(screen.getByText(/jean dupont/i)).toBeInTheDocument();
  });

  it('renders all available roles', () => {
    renderWithProviders(<RoleAssignmentDialog {...defaultProps} />);

    expect(screen.getByText('Super Admin')).toBeInTheDocument();
    expect(screen.getByText('Administrateur')).toBeInTheDocument();
    expect(screen.getByText('Éditeur de contenu')).toBeInTheDocument();
    expect(screen.getByText('Responsable RH')).toBeInTheDocument();
    expect(screen.getByText('Gestionnaire de site')).toBeInTheDocument();
  });

  it('renders correct number of checkboxes', () => {
    renderWithProviders(<RoleAssignmentDialog {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(5);
  });

  it('pre-checks current role', () => {
    renderWithProviders(<RoleAssignmentDialog {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    // role-1 (Super Admin) is in currentRoleIds, so first checkbox should be checked
    expect(checkboxes[0]).toBeChecked();
  });

  it('unchecked roles are not checked', () => {
    renderWithProviders(<RoleAssignmentDialog {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    // role-2 (Administrateur) is not in currentRoleIds
    expect(checkboxes[1]).not.toBeChecked();
  });

  it('toggles role on click', async () => {
    const { user } = renderWithProviders(<RoleAssignmentDialog {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // click Administrateur

    expect(checkboxes[1]).toBeChecked();
  });

  it('calls onAssign with selected role IDs', async () => {
    const { user } = renderWithProviders(<RoleAssignmentDialog {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]); // add role-2

    const assignBtn = screen.getByRole('button', { name: /assigner/i });
    await user.click(assignBtn);

    await waitFor(() => {
      expect(mockOnAssign).toHaveBeenCalledWith(['role-1', 'role-2']);
    });
  });

  it('calls onClose when cancel is clicked', async () => {
    const { user } = renderWithProviders(<RoleAssignmentDialog {...defaultProps} />);

    const cancelBtn = screen.getByRole('button', { name: /annuler/i });
    await user.click(cancelBtn);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('shows loading spinner when isRolesLoading', () => {
    renderWithProviders(
      <RoleAssignmentDialog {...defaultProps} isRolesLoading />,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('disables assign button when loading', () => {
    renderWithProviders(
      <RoleAssignmentDialog {...defaultProps} isLoading />,
    );

    const assignBtn = screen.getByRole('button', { name: /assigner/i });
    expect(assignBtn).toBeDisabled();
  });

  it('does not render when closed', () => {
    renderWithProviders(
      <RoleAssignmentDialog {...defaultProps} open={false} />,
    );

    expect(screen.queryByText(/jean dupont/i)).not.toBeInTheDocument();
  });
});
