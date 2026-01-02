import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { UserTable } from '../components/UserTable';
import { mockUsers } from '@/test/data/users';

describe('UserTable', () => {
  const defaultProps = {
    data: mockUsers,
    total: mockUsers.length,
    paginationModel: { page: 0, pageSize: 20 },
    onPaginationModelChange: vi.fn(),
    isLoading: false,
    onView: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  it('renders all user rows', () => {
    renderWithProviders(<UserTable {...defaultProps} />);

    expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    expect(screen.getByText('Marie Martin')).toBeInTheDocument();
    expect(screen.getByText('Pierre Bernard')).toBeInTheDocument();
    expect(screen.getByText('Sophie Roux')).toBeInTheDocument();
  });

  it('displays email column', () => {
    renderWithProviders(<UserTable {...defaultProps} />);

    expect(screen.getByText('superadmin@rhne-clone.ch')).toBeInTheDocument();
    expect(screen.getByText('admin@rhne-clone.ch')).toBeInTheDocument();
    expect(screen.getByText('editor@rhne-clone.ch')).toBeInTheDocument();
  });

  it('renders role chips', () => {
    renderWithProviders(<UserTable {...defaultProps} />);

    expect(screen.getByText('super_admin')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('content_editor')).toBeInTheDocument();
    expect(screen.getByText('site_manager')).toBeInTheDocument();
  });

  it('renders active/inactive status chips', () => {
    renderWithProviders(<UserTable {...defaultProps} />);

    const activeChips = screen.getAllByText('Actif');
    expect(activeChips.length).toBe(3);
    expect(screen.getByText('Inactif')).toBeInTheDocument();
  });

  it('renders action buttons (view, edit, delete) for each row', () => {
    renderWithProviders(<UserTable {...defaultProps} />);

    const viewButtons = screen.getAllByLabelText('Voir');
    expect(viewButtons.length).toBe(4);

    const editButtons = screen.getAllByLabelText('Modifier');
    expect(editButtons.length).toBe(4);

    const deleteButtons = screen.getAllByLabelText('Supprimer');
    expect(deleteButtons.length).toBe(4);
  });

  it('calls onView when view button is clicked', async () => {
    const onView = vi.fn();
    const { user } = renderWithProviders(
      <UserTable {...defaultProps} onView={onView} />,
    );

    const viewButtons = screen.getAllByLabelText('Voir');
    await user.click(viewButtons[0]);

    expect(onView).toHaveBeenCalledWith('user-1');
  });

  it('calls onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn();
    const { user } = renderWithProviders(
      <UserTable {...defaultProps} onEdit={onEdit} />,
    );

    const editButtons = screen.getAllByLabelText('Modifier');
    await user.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledWith('user-1');
  });

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    const { user } = renderWithProviders(
      <UserTable {...defaultProps} onDelete={onDelete} />,
    );

    const deleteButtons = screen.getAllByLabelText('Supprimer');
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith('user-1');
  });

  it('shows loading state', () => {
    renderWithProviders(<UserTable {...defaultProps} isLoading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders empty table when no data', () => {
    renderWithProviders(<UserTable {...defaultProps} data={[]} total={0} />);

    expect(screen.getByText('No rows')).toBeInTheDocument();
  });
});
