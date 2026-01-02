import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import DoctorEditPage from '../pages/DoctorEditPage';

// Mock react-router-dom useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'doctor-1' }),
  };
});

describe('DoctorEditPage', () => {
  it('shows loading spinner while fetching', () => {
    renderWithProviders(<DoctorEditPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders page title after loading', async () => {
    renderWithProviders(<DoctorEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Modifier le médecin')).toBeInTheDocument();
    });
  });

  it('shows subtitle with doctor name and title', async () => {
    renderWithProviders(<DoctorEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Dr Jean Dupont')).toBeInTheDocument();
    });
  });

  it('pre-populates form with doctor data', async () => {
    renderWithProviders(<DoctorEditPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Jean Dupont')).toBeInTheDocument();
    });
  });

  it('renders save button (edit mode)', async () => {
    renderWithProviders(<DoctorEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Enregistrer')).toBeInTheDocument();
    });
  });

  it('renders back button', async () => {
    renderWithProviders(<DoctorEditPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
    });
  });

  it('submits updated data', async () => {
    const { user } = renderWithProviders(<DoctorEditPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Jean Dupont')).toBeInTheDocument();
    });

    const nameField = screen.getByDisplayValue('Jean Dupont');
    await user.clear(nameField);
    await user.type(nameField, 'Jean-Pierre Dupont');

    const saveButton = screen.getByText('Enregistrer');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Médecin mis à jour avec succès')).toBeInTheDocument();
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', async () => {
      renderWithProviders(<DoctorEditPage />, { authPreset: 'super_admin' });
      await waitFor(() => {
        expect(screen.getByText('Modifier le médecin')).toBeInTheDocument();
      });
    });

    it('renders for site_manager', async () => {
      renderWithProviders(<DoctorEditPage />, { authPreset: 'site_manager' });
      await waitFor(() => {
        expect(screen.getByText('Modifier le médecin')).toBeInTheDocument();
      });
    });
  });
});
