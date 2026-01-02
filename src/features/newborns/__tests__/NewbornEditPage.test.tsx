import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import NewbornEditPage from '../pages/NewbornEditPage';

// Mock useParams to return newborn-1
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'newborn-1' }),
  };
});

describe('NewbornEditPage', () => {
  it('shows loading spinner while fetching', () => {
    renderWithProviders(<NewbornEditPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders page title after loading', async () => {
    renderWithProviders(<NewbornEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Modifier la naissance')).toBeInTheDocument();
    });
  });

  it('shows subtitle with newborn name', async () => {
    renderWithProviders(<NewbornEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Emma')).toBeInTheDocument();
    });
  });

  it('pre-populates form with newborn data', async () => {
    renderWithProviders(<NewbornEditPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Emma')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('2025-06-15')).toBeInTheDocument();
  });

  it('renders save button (edit mode)', async () => {
    renderWithProviders(<NewbornEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Enregistrer')).toBeInTheDocument();
    });
  });

  it('renders back button', async () => {
    renderWithProviders(<NewbornEditPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
    });
  });

  it('submits updated data', async () => {
    const { user } = renderWithProviders(<NewbornEditPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Emma')).toBeInTheDocument();
    });

    const nameField = screen.getByDisplayValue('Emma');
    await user.clear(nameField);
    await user.type(nameField, 'Émilie');

    const saveButton = screen.getByText('Enregistrer');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Naissance mise à jour avec succès')).toBeInTheDocument();
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', async () => {
      renderWithProviders(<NewbornEditPage />, { authPreset: 'super_admin' });
      await waitFor(() => {
        expect(screen.getByText('Modifier la naissance')).toBeInTheDocument();
      });
    });

    it('renders for admin', async () => {
      renderWithProviders(<NewbornEditPage />, { authPreset: 'admin' });
      await waitFor(() => {
        expect(screen.getByText('Modifier la naissance')).toBeInTheDocument();
      });
    });
  });
});
