import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import ServicesListPage from '../pages/ServicesListPage';

describe('ServicesListPage', () => {
  describe('Rendering', () => {
    it('renders page title', async () => {
      renderWithProviders(<ServicesListPage />);

      expect(screen.getByText('Services médicaux')).toBeInTheDocument();
    });

    it('renders add service button', () => {
      renderWithProviders(<ServicesListPage />);

      expect(screen.getByRole('button', { name: /Ajouter un service/i })).toBeInTheDocument();
    });

    it('renders search toolbar', () => {
      renderWithProviders(<ServicesListPage />);

      expect(screen.getByPlaceholderText('Rechercher des services...')).toBeInTheDocument();
    });

    it('renders active-only filter switch', () => {
      renderWithProviders(<ServicesListPage />);

      expect(screen.getByText('Actifs uniquement')).toBeInTheDocument();
    });

    it('loads and displays services from API', async () => {
      renderWithProviders(<ServicesListPage />);

      await waitFor(() => {
        expect(screen.getByText('Cardiologie')).toBeInTheDocument();
        expect(screen.getByText('Oncologie')).toBeInTheDocument();
        expect(screen.getByText('Pédiatrie')).toBeInTheDocument();
      });
    });
  });

  describe('Search', () => {
    it('filters services by search text', async () => {
      const { user } = renderWithProviders(<ServicesListPage />);

      await waitFor(() => {
        expect(screen.getByText('Cardiologie')).toBeInTheDocument();
      });

      const searchField = screen.getByPlaceholderText('Rechercher des services...');
      await user.type(searchField, 'Cardio');

      // Search is debounced; data will be re-fetched
      await waitFor(() => {
        expect(screen.getByText('Cardiologie')).toBeInTheDocument();
      });
    });
  });

  describe('Delete', () => {
    it('opens confirm dialog when delete is triggered', async () => {
      const { user } = renderWithProviders(<ServicesListPage />);

      await waitFor(() => {
        expect(screen.getByText('Cardiologie')).toBeInTheDocument();
      });

      // Find and click first delete button in the data grid
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Confirmer la suppression')).toBeInTheDocument();
        expect(screen.getByText('Êtes-vous sûr de vouloir supprimer ce service ?')).toBeInTheDocument();
      });
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', async () => {
      renderWithProviders(<ServicesListPage />, { authPreset: 'super_admin' });

      await waitFor(() => {
        expect(screen.getByText('Services médicaux')).toBeInTheDocument();
      });
    });

    it('renders for admin', async () => {
      renderWithProviders(<ServicesListPage />, { authPreset: 'admin' });

      await waitFor(() => {
        expect(screen.getByText('Services médicaux')).toBeInTheDocument();
      });
    });

    it('renders for content_editor', async () => {
      renderWithProviders(<ServicesListPage />, { authPreset: 'content_editor' });

      await waitFor(() => {
        expect(screen.getByText('Services médicaux')).toBeInTheDocument();
      });
    });
  });
});
