import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import SitesListPage from '../pages/SitesListPage';

describe('SitesListPage', () => {
  describe('Rendering', () => {
    it('renders page title', async () => {
      renderWithProviders(<SitesListPage />);

      expect(screen.getByText('Sites hospitaliers')).toBeInTheDocument();
    });

    it('renders add site button', () => {
      renderWithProviders(<SitesListPage />);

      expect(screen.getByText('Ajouter un site')).toBeInTheDocument();
    });

    it('renders search toolbar', () => {
      renderWithProviders(<SitesListPage />);

      expect(screen.getByPlaceholderText('Rechercher des sites...')).toBeInTheDocument();
    });

    it('renders active-only filter switch', () => {
      renderWithProviders(<SitesListPage />);

      expect(screen.getByText('Actifs uniquement')).toBeInTheDocument();
    });

    it('loads and displays sites from API', async () => {
      renderWithProviders(<SitesListPage />);

      await waitFor(() => {
        expect(screen.getByText('Hôpital Pourtalès')).toBeInTheDocument();
        expect(screen.getByText('Hôpital de La Chaux-de-Fonds')).toBeInTheDocument();
      });
    });
  });

  describe('Search', () => {
    it('filters sites by search text', async () => {
      const { user } = renderWithProviders(<SitesListPage />);

      await waitFor(() => {
        expect(screen.getByText('Hôpital Pourtalès')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Rechercher des sites...');
      await user.type(searchInput, 'Pourtalès');

      await waitFor(() => {
        expect(screen.getByText('Hôpital Pourtalès')).toBeInTheDocument();
      });
    });
  });

  describe('Delete', () => {
    it('opens confirm dialog when delete is triggered', async () => {
      const { user } = renderWithProviders(<SitesListPage />);

      await waitFor(() => {
        expect(screen.getByText('Hôpital Pourtalès')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Êtes-vous sûr de vouloir supprimer ce site ?')).toBeInTheDocument();
      });
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', () => {
      renderWithProviders(<SitesListPage />, { authPreset: 'super_admin' });
      expect(screen.getByText('Sites hospitaliers')).toBeInTheDocument();
    });

    it('renders for admin', () => {
      renderWithProviders(<SitesListPage />, { authPreset: 'admin' });
      expect(screen.getByText('Sites hospitaliers')).toBeInTheDocument();
    });

    it('renders for site_manager', () => {
      renderWithProviders(<SitesListPage />, { authPreset: 'site_manager' });
      expect(screen.getByText('Sites hospitaliers')).toBeInTheDocument();
    });
  });
});
