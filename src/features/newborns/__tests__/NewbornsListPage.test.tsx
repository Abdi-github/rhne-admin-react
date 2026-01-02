import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import NewbornsListPage from '../pages/NewbornsListPage';

describe('NewbornsListPage', () => {
  describe('Rendering', () => {
    it('renders page title', () => {
      renderWithProviders(<NewbornsListPage />);

      expect(screen.getByText('Naissances')).toBeInTheDocument();
    });

    it('renders add newborn button', () => {
      renderWithProviders(<NewbornsListPage />);

      expect(screen.getByText('Ajouter une naissance')).toBeInTheDocument();
    });

    it('renders search toolbar', () => {
      renderWithProviders(<NewbornsListPage />);

      expect(screen.getByPlaceholderText('Rechercher des naissances...')).toBeInTheDocument();
    });

    it('loads and displays newborns from API', async () => {
      renderWithProviders(<NewbornsListPage />);

      await waitFor(() => {
        expect(screen.getByText('Emma')).toBeInTheDocument();
      });
      expect(screen.getByText('Léo')).toBeInTheDocument();
      expect(screen.getByText('Chloé')).toBeInTheDocument();
    });
  });

  describe('Search', () => {
    it('filters newborns by search text', async () => {
      const { user } = renderWithProviders(<NewbornsListPage />);

      await waitFor(() => {
        expect(screen.getByText('Emma')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Rechercher des naissances...');
      await user.type(searchInput, 'Léo');

      await waitFor(() => {
        expect(screen.getByText('Léo')).toBeInTheDocument();
      });
    });
  });

  describe('Delete', () => {
    it('opens confirm dialog when delete is triggered', async () => {
      const { user } = renderWithProviders(<NewbornsListPage />);

      await waitFor(() => {
        expect(screen.getByText('Emma')).toBeInTheDocument();
      });

      const firstRow = screen.getByText('Emma').closest('[role="row"]')!;
      const buttons = firstRow.querySelectorAll('button');
      const deleteButton = buttons[buttons.length - 1];
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText('Êtes-vous sûr de vouloir supprimer cette naissance ?')).toBeInTheDocument();
      });
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', () => {
      renderWithProviders(<NewbornsListPage />, { authPreset: 'super_admin' });
      expect(screen.getByText('Naissances')).toBeInTheDocument();
    });

    it('renders for admin', () => {
      renderWithProviders(<NewbornsListPage />, { authPreset: 'admin' });
      expect(screen.getByText('Naissances')).toBeInTheDocument();
    });
  });
});
