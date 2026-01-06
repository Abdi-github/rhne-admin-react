import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import EventsListPage from '../pages/EventsListPage';

describe('EventsListPage', () => {
  describe('Rendering', () => {
    it('renders page title', () => {
      renderWithProviders(<EventsListPage />);

      expect(screen.getByText('Événements')).toBeInTheDocument();
    });

    it('renders add event button', () => {
      renderWithProviders(<EventsListPage />);

      expect(screen.getByText('Ajouter un événement')).toBeInTheDocument();
    });

    it('renders search toolbar', () => {
      renderWithProviders(<EventsListPage />);

      expect(screen.getByPlaceholderText('Rechercher des événements...')).toBeInTheDocument();
    });

    it('renders active-only filter switch', () => {
      renderWithProviders(<EventsListPage />);

      expect(screen.getByText('Actifs uniquement')).toBeInTheDocument();
    });

    it('loads and displays events from API', async () => {
      renderWithProviders(<EventsListPage />);

      await waitFor(() => {
        expect(screen.getByText('Journée portes ouvertes')).toBeInTheDocument();
      });
      expect(screen.getByText('Conférence cardiologie')).toBeInTheDocument();
      expect(screen.getByText('Formation premiers secours')).toBeInTheDocument();
    });
  });

  describe('Search', () => {
    it('filters events by search text', async () => {
      const { user } = renderWithProviders(<EventsListPage />);

      await waitFor(() => {
        expect(screen.getByText('Journée portes ouvertes')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Rechercher des événements...');
      await user.type(searchInput, 'Conférence');

      await waitFor(() => {
        expect(screen.getByText('Conférence cardiologie')).toBeInTheDocument();
      });
    });
  });

  describe('Delete', () => {
    it('opens confirm dialog when delete is triggered', async () => {
      const { user } = renderWithProviders(<EventsListPage />);

      await waitFor(() => {
        expect(screen.getByText('Journée portes ouvertes')).toBeInTheDocument();
      });

      // Find the delete button on the first row
      const firstRow = screen.getByText('Journée portes ouvertes').closest('[role="row"]')!;
      const buttons = firstRow.querySelectorAll('button');
      const deleteButton = buttons[buttons.length - 1];
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText("Êtes-vous sûr de vouloir supprimer cet événement ?")).toBeInTheDocument();
      });
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', () => {
      renderWithProviders(<EventsListPage />, { authPreset: 'super_admin' });
      expect(screen.getByText('Événements')).toBeInTheDocument();
    });

    it('renders for admin', () => {
      renderWithProviders(<EventsListPage />, { authPreset: 'admin' });
      expect(screen.getByText('Événements')).toBeInTheDocument();
    });

    it('renders for content_editor', () => {
      renderWithProviders(<EventsListPage />, { authPreset: 'content_editor' });
      expect(screen.getByText('Événements')).toBeInTheDocument();
    });
  });
});
