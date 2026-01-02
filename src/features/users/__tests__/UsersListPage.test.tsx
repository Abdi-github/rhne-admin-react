import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import UsersListPage from '../pages/UsersListPage';

describe('UsersListPage', () => {
  describe('Rendering', () => {
    it('renders page title', () => {
      renderWithProviders(<UsersListPage />);
      expect(screen.getByText('Utilisateurs')).toBeInTheDocument();
    });

    it('renders add user button', () => {
      renderWithProviders(<UsersListPage />);
      expect(screen.getByText('Ajouter un utilisateur')).toBeInTheDocument();
    });

    it('renders search toolbar', () => {
      renderWithProviders(<UsersListPage />);
      expect(screen.getByPlaceholderText('Rechercher des utilisateurs...')).toBeInTheDocument();
    });

    it('renders active filter switch', () => {
      renderWithProviders(<UsersListPage />);
      expect(screen.getByText('Afficher uniquement les actifs')).toBeInTheDocument();
    });

    it('loads and displays users from API', async () => {
      renderWithProviders(<UsersListPage />);
      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
        expect(screen.getByText('Marie Martin')).toBeInTheDocument();
        expect(screen.getByText('Pierre Bernard')).toBeInTheDocument();
        expect(screen.getByText('Sophie Roux')).toBeInTheDocument();
      });
    });

    it('displays user email addresses', async () => {
      renderWithProviders(<UsersListPage />);
      await waitFor(() => {
        expect(screen.getByText('superadmin@rhne-clone.ch')).toBeInTheDocument();
        expect(screen.getByText('admin@rhne-clone.ch')).toBeInTheDocument();
      });
    });

    it('displays user roles as chips', async () => {
      renderWithProviders(<UsersListPage />);
      await waitFor(() => {
        expect(screen.getByText('super_admin')).toBeInTheDocument();
        expect(screen.getByText('admin')).toBeInTheDocument();
      });
    });
  });

  describe('Search', () => {
    it('filters users by search text', async () => {
      const { user } = renderWithProviders(<UsersListPage />);
      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });
      const searchInput = screen.getByPlaceholderText('Rechercher des utilisateurs...');
      await user.type(searchInput, 'Jean');
      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });
    });
  });

  describe('Delete', () => {
    it('opens confirm dialog when delete is triggered', async () => {
      const { user } = renderWithProviders(<UsersListPage />);
      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });
      const deleteButtons = screen.getAllByLabelText('Supprimer');
      await user.click(deleteButtons[0]);
      await waitFor(() => {
        expect(screen.getByText('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')).toBeInTheDocument();
      });
    });
  });

  describe('View detail', () => {
    it('opens user detail drawer when view is clicked', async () => {
      const { user } = renderWithProviders(<UsersListPage />);
      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });
      const viewButtons = screen.getAllByLabelText('Voir');
      await user.click(viewButtons[0]);
      await waitFor(() => {
        expect(screen.getByText("Détails de l'utilisateur")).toBeInTheDocument();
      });
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', () => {
      renderWithProviders(<UsersListPage />, { authPreset: 'super_admin' });
      expect(screen.getByText('Utilisateurs')).toBeInTheDocument();
    });

    it('renders for admin', () => {
      renderWithProviders(<UsersListPage />, { authPreset: 'admin' });
      expect(screen.getByText('Utilisateurs')).toBeInTheDocument();
    });
  });
});
