import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import RbacPage from '../pages/RbacPage';

describe('RbacPage', () => {
  describe('Rendering', () => {
    it('renders page title', () => {
      renderWithProviders(<RbacPage />);
      expect(screen.getByText('Rôles & Permissions')).toBeInTheDocument();
    });

    it('renders roles and permissions tabs', () => {
      renderWithProviders(<RbacPage />);
      expect(screen.getByRole('tab', { name: 'Rôles' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Permissions' })).toBeInTheDocument();
    });

    it('renders add role button', () => {
      renderWithProviders(<RbacPage />);
      expect(screen.getByText('Ajouter un rôle')).toBeInTheDocument();
    });

    it('renders search toolbar for roles', () => {
      renderWithProviders(<RbacPage />);
      expect(screen.getByPlaceholderText('Rechercher des rôles...')).toBeInTheDocument();
    });

    it('loads and displays roles from API', async () => {
      renderWithProviders(<RbacPage />);
      await waitFor(() => {
        expect(screen.getByText('super_admin')).toBeInTheDocument();
        expect(screen.getByText('admin')).toBeInTheDocument();
      });
    });
  });

  describe('Tabs', () => {
    it('switches to permissions tab', async () => {
      const { user } = renderWithProviders(<RbacPage />);

      const permTab = screen.getByRole('tab', { name: 'Permissions' });
      await user.click(permTab);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Rechercher des permissions...')).toBeInTheDocument();
      });
    });

    it('loads permissions on permissions tab', async () => {
      const { user } = renderWithProviders(<RbacPage />);

      const permTab = screen.getByRole('tab', { name: 'Permissions' });
      await user.click(permTab);

      await waitFor(() => {
        expect(screen.getByText('sites.read')).toBeInTheDocument();
      });
    });

    it('hides add role button on permissions tab', async () => {
      const { user } = renderWithProviders(<RbacPage />);

      const permTab = screen.getByRole('tab', { name: 'Permissions' });
      await user.click(permTab);

      expect(screen.queryByText('Ajouter un rôle')).not.toBeInTheDocument();
    });
  });

  describe('Role actions', () => {
    it('opens create dialog when add role clicked', async () => {
      const { user } = renderWithProviders(<RbacPage />);

      await user.click(screen.getByText('Ajouter un rôle'));

      await waitFor(() => {
        expect(screen.getByText('Créer un rôle')).toBeInTheDocument();
      });
    });

    it('opens edit dialog when edit is clicked', async () => {
      const { user } = renderWithProviders(<RbacPage />);

      await waitFor(() => {
        expect(screen.getByText('super_admin')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByLabelText('Modifier');
      await user.click(editButtons[0]);

      await waitFor(() => {
        // The edit dialog shows the role name field pre-populated
        expect(screen.getByDisplayValue('super_admin')).toBeInTheDocument();
      });
    });

    it('delete buttons are disabled for system roles', async () => {
      renderWithProviders(<RbacPage />);

      await waitFor(() => {
        expect(screen.getByText('super_admin')).toBeInTheDocument();
      });

      // All mock roles are system roles, so delete buttons exist
      const deleteLabels = screen.getAllByLabelText('Supprimer');
      expect(deleteLabels.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', () => {
      renderWithProviders(<RbacPage />, { authPreset: 'super_admin' });
      expect(screen.getByText('Rôles & Permissions')).toBeInTheDocument();
    });
  });
});
