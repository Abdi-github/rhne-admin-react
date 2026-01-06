import { describe, it, expect } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import EventCreatePage from '../pages/EventCreatePage';

describe('EventCreatePage', () => {
  it('renders page title', () => {
    renderWithProviders(<EventCreatePage />);

    expect(screen.getByText('Créer un événement')).toBeInTheDocument();
  });

  it('renders back button', () => {
    renderWithProviders(<EventCreatePage />);

    expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
  });

  it('renders the event form in create mode', () => {
    renderWithProviders(<EventCreatePage />);

    expect(screen.getByLabelText(/Titre de l'événement \(FR\)/i)).toBeInTheDocument();
    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('submits form and calls create mutation', async () => {
    const { user } = renderWithProviders(<EventCreatePage />);

    await user.type(
      screen.getByLabelText(/Titre de l'événement \(FR\)/i),
      'Nouvel événement',
    );
    await user.type(screen.getByLabelText(/Date/i), '2025-12-01');

    const createButton = screen.getByText('Créer');
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Événement créé avec succès')).toBeInTheDocument();
    });
  });

  it('shows validation error when submitting empty form', async () => {
    const { container } = renderWithProviders(<EventCreatePage />);

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      const requiredErrors = screen.getAllByText('Ce champ est requis');
      expect(requiredErrors.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', () => {
      renderWithProviders(<EventCreatePage />, { authPreset: 'super_admin' });
      expect(screen.getByText('Créer un événement')).toBeInTheDocument();
    });

    it('renders for content_editor', () => {
      renderWithProviders(<EventCreatePage />, { authPreset: 'content_editor' });
      expect(screen.getByText('Créer un événement')).toBeInTheDocument();
    });
  });
});
