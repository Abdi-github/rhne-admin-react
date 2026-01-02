import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { RolePermissionsEditor } from '../components/RolePermissionsEditor';
import { mockPermissions } from '@/test/data/rbac';

describe('RolePermissionsEditor', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();
  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    currentPermissionIds: ['perm-1', 'perm-2'],
    permissions: mockPermissions,
    isLoading: false,
    isPermissionsLoading: false,
    roleName: 'Super Admin',
  };

  it('renders dialog title', () => {
    renderWithProviders(<RolePermissionsEditor {...defaultProps} />);

    expect(screen.getByText('Gérer les permissions')).toBeInTheDocument();
  });

  it('renders role name', () => {
    renderWithProviders(<RolePermissionsEditor {...defaultProps} />);

    expect(screen.getByText('Super Admin')).toBeInTheDocument();
  });

  it('renders permissions table with rows', () => {
    renderWithProviders(<RolePermissionsEditor {...defaultProps} />);

    expect(screen.getByText('Read Sites')).toBeInTheDocument();
    expect(screen.getByText('Create Sites')).toBeInTheDocument();
  });

  it('renders checkboxes for each permission', () => {
    renderWithProviders(<RolePermissionsEditor {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    // 36 permissions + 1 header "select all" = 37
    expect(checkboxes.length).toBe(37);
  });

  it('pre-checks current permissions', () => {
    renderWithProviders(<RolePermissionsEditor {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    // Skip first (select all), checkboxes[1] = perm-1 (checked), checkboxes[2] = perm-2 (checked)
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).toBeChecked();
    // perm-3 is not in currentPermissionIds
    expect(checkboxes[3]).not.toBeChecked();
  });

  it('toggles permission on click', async () => {
    const { user } = renderWithProviders(<RolePermissionsEditor {...defaultProps} />);

    const checkboxes = screen.getAllByRole('checkbox');
    // Click perm-3 (index 3)
    await user.click(checkboxes[3]);

    expect(checkboxes[3]).toBeChecked();
  });

  it('calls onSave with selected permission IDs', async () => {
    const { user } = renderWithProviders(<RolePermissionsEditor {...defaultProps} />);

    const saveButton = screen.getByRole('button', { name: /enregistrer/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(['perm-1', 'perm-2']);
    });
  });

  it('calls onClose when cancel is clicked', async () => {
    const { user } = renderWithProviders(<RolePermissionsEditor {...defaultProps} />);

    const cancelBtn = screen.getByRole('button', { name: /annuler/i });
    await user.click(cancelBtn);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders resource filter dropdown', () => {
    renderWithProviders(<RolePermissionsEditor {...defaultProps} />);

    expect(screen.getByLabelText('Ressource')).toBeInTheDocument();
  });

  it('shows loading spinner when permissions loading', () => {
    renderWithProviders(
      <RolePermissionsEditor {...defaultProps} isPermissionsLoading />,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    renderWithProviders(
      <RolePermissionsEditor {...defaultProps} open={false} />,
    );

    expect(screen.queryByText('Gérer les permissions')).not.toBeInTheDocument();
  });
});
