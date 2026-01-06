import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import JobsListPage from '../pages/JobsListPage';

describe('JobsListPage', () => {
  describe('Rendering', () => {
    it('renders page title', () => {
      renderWithProviders(<JobsListPage />);

      expect(screen.getByText("Offres d'emploi")).toBeInTheDocument();
    });

    it('renders add job button', () => {
      renderWithProviders(<JobsListPage />);

      expect(screen.getByText('Ajouter une offre')).toBeInTheDocument();
    });

    it('renders search toolbar', () => {
      renderWithProviders(<JobsListPage />);

      expect(screen.getByPlaceholderText('Rechercher des offres...')).toBeInTheDocument();
    });

    it('renders active-only filter switch', () => {
      renderWithProviders(<JobsListPage />);

      expect(screen.getByText('Actives uniquement')).toBeInTheDocument();
    });

    it('loads and displays jobs from API', async () => {
      renderWithProviders(<JobsListPage />);

      await waitFor(() => {
        expect(screen.getByText('Infirmier/ère diplômé/e')).toBeInTheDocument();
      });
      expect(screen.getByText('Médecin assistant/e')).toBeInTheDocument();
      expect(screen.getByText('Technicien/ne en radiologie')).toBeInTheDocument();
    });
  });

  describe('Search', () => {
    it('filters jobs by search text', async () => {
      const { user } = renderWithProviders(<JobsListPage />);

      await waitFor(() => {
        expect(screen.getByText('Infirmier/ère diplômé/e')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Rechercher des offres...');
      await user.type(searchInput, 'Médecin');

      await waitFor(() => {
        expect(screen.getByText('Médecin assistant/e')).toBeInTheDocument();
      });
    });
  });

  describe('Delete', () => {
    it('opens confirm dialog when delete is triggered', async () => {
      const { user } = renderWithProviders(<JobsListPage />);

      await waitFor(() => {
        expect(screen.getByText('Infirmier/ère diplômé/e')).toBeInTheDocument();
      });

      // Find the delete button on the first row
      const firstRow = screen.getByText('Infirmier/ère diplômé/e').closest('[role="row"]')!;
      const buttons = firstRow.querySelectorAll('button');
      const deleteButton = buttons[buttons.length - 1];
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText("Êtes-vous sûr de vouloir supprimer cette offre d'emploi ?")).toBeInTheDocument();
      });
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', () => {
      renderWithProviders(<JobsListPage />, { authPreset: 'super_admin' });
      expect(screen.getByText("Offres d'emploi")).toBeInTheDocument();
    });

    it('renders for admin', () => {
      renderWithProviders(<JobsListPage />, { authPreset: 'admin' });
      expect(screen.getByText("Offres d'emploi")).toBeInTheDocument();
    });

    it('renders for hr_manager', () => {
      renderWithProviders(<JobsListPage />, { authPreset: 'hr_manager' });
      expect(screen.getByText("Offres d'emploi")).toBeInTheDocument();
    });
  });
});
