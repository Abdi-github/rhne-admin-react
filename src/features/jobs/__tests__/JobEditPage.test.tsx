import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import JobEditPage from '../pages/JobEditPage';

// Mock useParams to return job-1
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'job-1' }),
  };
});

describe('JobEditPage', () => {
  it('shows loading spinner while fetching', () => {
    renderWithProviders(<JobEditPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders page title after loading', async () => {
    renderWithProviders(<JobEditPage />);

    await waitFor(() => {
      expect(screen.getByText("Modifier l'offre")).toBeInTheDocument();
    });
  });

  it('shows subtitle with job title', async () => {
    renderWithProviders(<JobEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Infirmier/ère diplômé/e')).toBeInTheDocument();
    });
  });

  it('pre-populates form with job data', async () => {
    renderWithProviders(<JobEditPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Infirmier/ère diplômé/e')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('RHN-2025-001')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Soins')).toBeInTheDocument();
    expect(screen.getByDisplayValue('80-100%')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Pourtalès')).toBeInTheDocument();
  });

  it('pre-populates requirements', async () => {
    renderWithProviders(<JobEditPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Diplôme HES en soins infirmiers')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('Expérience en milieu hospitalier')).toBeInTheDocument();
  });

  it('renders save button (edit mode)', async () => {
    renderWithProviders(<JobEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Enregistrer')).toBeInTheDocument();
    });
  });

  it('renders back button', async () => {
    renderWithProviders(<JobEditPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
    });
  });

  it('submits updated data', async () => {
    const { user } = renderWithProviders(<JobEditPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Infirmier/ère diplômé/e')).toBeInTheDocument();
    });

    const titleField = screen.getByDisplayValue('Infirmier/ère diplômé/e');
    await user.clear(titleField);
    await user.type(titleField, 'Poste modifié');

    const saveButton = screen.getByText('Enregistrer');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("Offre d'emploi mise à jour avec succès")).toBeInTheDocument();
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', async () => {
      renderWithProviders(<JobEditPage />, { authPreset: 'super_admin' });
      await waitFor(() => {
        expect(screen.getByText("Modifier l'offre")).toBeInTheDocument();
      });
    });

    it('renders for hr_manager', async () => {
      renderWithProviders(<JobEditPage />, { authPreset: 'hr_manager' });
      await waitFor(() => {
        expect(screen.getByText("Modifier l'offre")).toBeInTheDocument();
      });
    });
  });
});
