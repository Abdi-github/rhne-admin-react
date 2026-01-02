import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import PatientInfoEditPage from '../pages/PatientInfoEditPage';

// Mock useParams to return pi-1
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'pi-1' }),
  };
});

describe('PatientInfoEditPage', () => {
  it('shows loading spinner while fetching', () => {
    renderWithProviders(<PatientInfoEditPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders page title after loading', async () => {
    renderWithProviders(<PatientInfoEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Modifier la page')).toBeInTheDocument();
    });
  });

  it('shows subtitle with page title', async () => {
    renderWithProviders(<PatientInfoEditPage />);

    await waitFor(() => {
      expect(screen.getByText("Admission à l'hôpital")).toBeInTheDocument();
    });
  });

  it('pre-populates form with page data', async () => {
    renderWithProviders(<PatientInfoEditPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Admission à l'hôpital")).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('Séjour')).toBeInTheDocument();
  });

  it('pre-populates sections', async () => {
    renderWithProviders(<PatientInfoEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('Documents nécessaires')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Horaires de visite')).toBeInTheDocument();
  });

  it('renders save button (edit mode)', async () => {
    renderWithProviders(<PatientInfoEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Enregistrer')).toBeInTheDocument();
    });
  });

  it('renders back button', async () => {
    renderWithProviders(<PatientInfoEditPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
    });
  });

  it('submits updated data', async () => {
    const { user } = renderWithProviders(<PatientInfoEditPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Admission à l'hôpital")).toBeInTheDocument();
    });

    const titleField = screen.getByDisplayValue("Admission à l'hôpital");
    await user.clear(titleField);
    await user.type(titleField, 'Page modifiée');

    const saveButton = screen.getByText('Enregistrer');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Page d'information mise à jour avec succès")).toBeInTheDocument();
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', async () => {
      renderWithProviders(<PatientInfoEditPage />, { authPreset: 'super_admin' });
      await waitFor(() => {
        expect(screen.getByText('Modifier la page')).toBeInTheDocument();
      });
    });

    it('renders for content_editor', async () => {
      renderWithProviders(<PatientInfoEditPage />, { authPreset: 'content_editor' });
      await waitFor(() => {
        expect(screen.getByText('Modifier la page')).toBeInTheDocument();
      });
    });
  });
});
