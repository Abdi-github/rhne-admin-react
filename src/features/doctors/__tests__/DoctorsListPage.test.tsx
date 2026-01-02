import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import DoctorsListPage from '../pages/DoctorsListPage';

describe('DoctorsListPage', () => {
  describe('Rendering', () => {
    it('renders page title', () => {
      renderWithProviders(<DoctorsListPage />);

      expect(screen.getByText('Médecins')).toBeInTheDocument();
    });

    it('renders add doctor button', () => {
      renderWithProviders(<DoctorsListPage />);

      expect(screen.getByText('Ajouter un médecin')).toBeInTheDocument();
    });

    it('renders search toolbar', () => {
      renderWithProviders(<DoctorsListPage />);

      expect(screen.getByPlaceholderText('Rechercher des médecins...')).toBeInTheDocument();
    });

    it('renders active-only filter switch', () => {
      renderWithProviders(<DoctorsListPage />);

      expect(screen.getByText('Actifs uniquement')).toBeInTheDocument();
    });

    it('loads and displays doctors from API', async () => {
      renderWithProviders(<DoctorsListPage />);

      await waitFor(() => {
        expect(screen.getByText('Dr Jean Dupont')).toBeInTheDocument();
        expect(screen.getByText('Pr Marie Curie')).toBeInTheDocument();
      });
    });
  });

  describe('Search', () => {
    it('filters doctors by search text', async () => {
      const { user } = renderWithProviders(<DoctorsListPage />);

      await waitFor(() => {
        expect(screen.getByText('Dr Jean Dupont')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Rechercher des médecins...');
      await user.type(searchInput, 'Jean');

      await waitFor(() => {
        expect(screen.getByText('Dr Jean Dupont')).toBeInTheDocument();
      });
    });
  });

  describe('Delete', () => {
    it('opens confirm dialog when delete is triggered', async () => {
      const { user } = renderWithProviders(<DoctorsListPage />);

      await waitFor(() => {
        expect(screen.getByText('Dr Jean Dupont')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Êtes-vous sûr de vouloir supprimer ce médecin ?')).toBeInTheDocument();
      });
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', () => {
      renderWithProviders(<DoctorsListPage />, { authPreset: 'super_admin' });
      expect(screen.getByText('Médecins')).toBeInTheDocument();
    });

    it('renders for admin', () => {
      renderWithProviders(<DoctorsListPage />, { authPreset: 'admin' });
      expect(screen.getByText('Médecins')).toBeInTheDocument();
    });

    it('renders for site_manager', () => {
      renderWithProviders(<DoctorsListPage />, { authPreset: 'site_manager' });
      expect(screen.getByText('Médecins')).toBeInTheDocument();
    });
  });
});
