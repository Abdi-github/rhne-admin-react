import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { UserDetailDrawer } from '../components/UserDetailDrawer';
import { mockUsers } from '@/test/data/users';

describe('UserDetailDrawer', () => {
  const mockOnClose = vi.fn();
  const user = mockUsers[0]; // Jean Dupont — super_admin

  it('renders user name and email', () => {
    renderWithProviders(
      <UserDetailDrawer user={user} open onClose={mockOnClose} />,
    );

    expect(screen.getByText(`${user.first_name} ${user.last_name}`)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
  });

  it('renders user avatar with initials when no image', () => {
    const userNoAvatar = mockUsers[1]; // Marie Martin — no avatar
    renderWithProviders(
      <UserDetailDrawer user={userNoAvatar} open onClose={mockOnClose} />,
    );

    expect(screen.getByText('MM')).toBeInTheDocument();
  });

  it('renders active status chip', () => {
    renderWithProviders(
      <UserDetailDrawer user={user} open onClose={mockOnClose} />,
    );

    expect(screen.getByText('Actif')).toBeInTheDocument();
  });

  it('renders inactive status chip for inactive user', () => {
    const inactiveUser = mockUsers[3]; // Sophie Roux — inactive
    renderWithProviders(
      <UserDetailDrawer user={inactiveUser} open onClose={mockOnClose} />,
    );

    expect(screen.getByText('Inactif')).toBeInTheDocument();
  });

  it('renders user roles', () => {
    renderWithProviders(
      <UserDetailDrawer user={user} open onClose={mockOnClose} />,
    );

    expect(screen.getByText('Super Admin')).toBeInTheDocument();
  });

  it('renders phone number', () => {
    renderWithProviders(
      <UserDetailDrawer user={user} open onClose={mockOnClose} />,
    );

    expect(screen.getByText(user.phone)).toBeInTheDocument();
  });

  it('renders preferred language', () => {
    renderWithProviders(
      <UserDetailDrawer user={user} open onClose={mockOnClose} />,
    );

    expect(screen.getByText('FR')).toBeInTheDocument();
  });

  it('renders site name for site_manager', () => {
    const siteManagerUser = mockUsers[3]; // Sophie Roux — site_manager with site
    renderWithProviders(
      <UserDetailDrawer user={siteManagerUser} open onClose={mockOnClose} />,
    );

    expect(screen.getByText('Hôpital Pourtalès')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const { user: testUser } = renderWithProviders(
      <UserDetailDrawer user={user} open onClose={mockOnClose} />,
    );

    const closeButton = screen.getByLabelText(/fermer/i);
    await testUser.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not render when closed', () => {
    renderWithProviders(
      <UserDetailDrawer user={user} open={false} onClose={mockOnClose} />,
    );

    expect(screen.queryByText(user.email)).not.toBeInTheDocument();
  });

  it('renders null user gracefully when no user', () => {
    renderWithProviders(
      <UserDetailDrawer user={null} open onClose={mockOnClose} />,
    );

    expect(screen.queryByText(user.email)).not.toBeInTheDocument();
  });
});
