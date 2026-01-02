import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import SiteEditPage from '../pages/SiteEditPage';

// Mock react-router-dom useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'site-1' }),
  };
});

describe('SiteEditPage', () => {
  it('shows loading spinner while fetching', () => {
    renderWithProviders(<SiteEditPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders page title after loading', async () => {
    renderWithProviders(<SiteEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Modifier le site')).toBeInTheDocument();
    });
  });

  it('shows subtitle with site name', async () => {
    renderWithProviders(<SiteEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Hôpital Pourtalès')).toBeInTheDocument();
    });
  });

  it('pre-populates form with site data', async () => {
    renderWithProviders(<SiteEditPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Hôpital Pourtalès')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Rue de la Maladière 45')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Neuchâtel')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
    });
  });

  it('renders save button (edit mode)', async () => {
    renderWithProviders(<SiteEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Enregistrer')).toBeInTheDocument();
    });
  });

  it('renders back button', async () => {
    renderWithProviders(<SiteEditPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
    });
  });

  it('submits updated data', async () => {
    const { user } = renderWithProviders(<SiteEditPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Hôpital Pourtalès')).toBeInTheDocument();
    });

    const nameField = screen.getByDisplayValue('Hôpital Pourtalès');
    await user.clear(nameField);
    await user.type(nameField, 'Hôpital Modifié');

    const saveButton = screen.getByText('Enregistrer');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Site mis à jour avec succès')).toBeInTheDocument();
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', async () => {
      renderWithProviders(<SiteEditPage />, { authPreset: 'super_admin' });
      await waitFor(() => {
        expect(screen.getByText('Modifier le site')).toBeInTheDocument();
      });
    });

    it('renders for site_manager', async () => {
      renderWithProviders(<SiteEditPage />, { authPreset: 'site_manager' });
      await waitFor(() => {
        expect(screen.getByText('Modifier le site')).toBeInTheDocument();
      });
    });
  });
});
