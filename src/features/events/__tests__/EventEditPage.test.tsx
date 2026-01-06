import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import EventEditPage from '../pages/EventEditPage';

// Mock useParams to return event-1
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'event-1' }),
  };
});

describe('EventEditPage', () => {
  it('shows loading spinner while fetching', () => {
    renderWithProviders(<EventEditPage />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders page title after loading', async () => {
    renderWithProviders(<EventEditPage />);

    await waitFor(() => {
      expect(screen.getByText("Modifier l'événement")).toBeInTheDocument();
    });
  });

  it('shows subtitle with event title', async () => {
    renderWithProviders(<EventEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Journée portes ouvertes')).toBeInTheDocument();
    });
  });

  it('pre-populates form with event data', async () => {
    renderWithProviders(<EventEditPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Journée portes ouvertes')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('2025-09-15')).toBeInTheDocument();
  });

  it('renders save button (edit mode)', async () => {
    renderWithProviders(<EventEditPage />);

    await waitFor(() => {
      expect(screen.getByText('Enregistrer')).toBeInTheDocument();
    });
  });

  it('renders back button', async () => {
    renderWithProviders(<EventEditPage />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
    });
  });

  it('submits updated data', async () => {
    const { user } = renderWithProviders(<EventEditPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Journée portes ouvertes')).toBeInTheDocument();
    });

    const titleField = screen.getByDisplayValue('Journée portes ouvertes');
    await user.clear(titleField);
    await user.type(titleField, 'Événement modifié');

    const saveButton = screen.getByText('Enregistrer');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Événement mis à jour avec succès')).toBeInTheDocument();
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', async () => {
      renderWithProviders(<EventEditPage />, { authPreset: 'super_admin' });
      await waitFor(() => {
        expect(screen.getByText("Modifier l'événement")).toBeInTheDocument();
      });
    });

    it('renders for content_editor', async () => {
      renderWithProviders(<EventEditPage />, { authPreset: 'content_editor' });
      await waitFor(() => {
        expect(screen.getByText("Modifier l'événement")).toBeInTheDocument();
      });
    });
  });
});
