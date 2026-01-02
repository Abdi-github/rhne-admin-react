import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import PatientInfoListPage from '../pages/PatientInfoListPage';

describe('PatientInfoListPage', () => {
  it('renders page title', () => {
    renderWithProviders(<PatientInfoListPage />);

    expect(screen.getByText('Informations patients')).toBeInTheDocument();
  });

  it('renders add button', () => {
    renderWithProviders(<PatientInfoListPage />);

    expect(screen.getByText('Ajouter une page')).toBeInTheDocument();
  });

  it('renders search toolbar', () => {
    renderWithProviders(<PatientInfoListPage />);

    expect(screen.getByPlaceholderText('Rechercher des pages...')).toBeInTheDocument();
  });

  it('loads and displays patient info data', async () => {
    renderWithProviders(<PatientInfoListPage />);

    await waitFor(() => {
      expect(screen.getByText("Admission à l'hôpital")).toBeInTheDocument();
    });
    expect(screen.getByText('Droits des patients')).toBeInTheDocument();
    expect(screen.getByText('Sortie et suivi')).toBeInTheDocument();
  });

  it('displays section column', async () => {
    renderWithProviders(<PatientInfoListPage />);

    await waitFor(() => {
      // Two rows have 'Séjour' section (pi-1 and pi-3)
      const sejourCells = screen.getAllByText('Séjour');
      expect(sejourCells.length).toBe(2);
    });
    expect(screen.getByText('Droits')).toBeInTheDocument();
  });

  describe('Search', () => {
    it('filters patient info by search text', async () => {
      const { user } = renderWithProviders(<PatientInfoListPage />);

      await waitFor(() => {
        expect(screen.getByText("Admission à l'hôpital")).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Rechercher des pages...');
      await user.type(searchInput, 'Droits');

      await waitFor(() => {
        expect(screen.getByText('Droits des patients')).toBeInTheDocument();
      });
    });
  });

  describe('Delete', () => {
    it('opens confirm dialog when delete is triggered', async () => {
      const { user } = renderWithProviders(<PatientInfoListPage />);

      await waitFor(() => {
        expect(screen.getByText("Admission à l'hôpital")).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByLabelText(/Supprimer/i);
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(
          screen.getByText("Êtes-vous sûr de vouloir supprimer cette page d'information ?")
        ).toBeInTheDocument();
      });
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', () => {
      renderWithProviders(<PatientInfoListPage />, { authPreset: 'super_admin' });
      expect(screen.getByText('Informations patients')).toBeInTheDocument();
    });

    it('renders for admin', () => {
      renderWithProviders(<PatientInfoListPage />, { authPreset: 'admin' });
      expect(screen.getByText('Informations patients')).toBeInTheDocument();
    });

    it('renders for content_editor', () => {
      renderWithProviders(<PatientInfoListPage />, { authPreset: 'content_editor' });
      expect(screen.getByText('Informations patients')).toBeInTheDocument();
    });
  });
});
