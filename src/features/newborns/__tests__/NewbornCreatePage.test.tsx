import { describe, it, expect } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import NewbornCreatePage from '../pages/NewbornCreatePage';

describe('NewbornCreatePage', () => {
  it('renders page title', () => {
    renderWithProviders(<NewbornCreatePage />);

    expect(screen.getByText('Enregistrer une naissance')).toBeInTheDocument();
  });

  it('renders back button', () => {
    renderWithProviders(<NewbornCreatePage />);

    expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
  });

  it('renders the newborn form in create mode', () => {
    renderWithProviders(<NewbornCreatePage />);

    expect(screen.getByLabelText(/Prénom du bébé/i)).toBeInTheDocument();
    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('submits form and calls create mutation', async () => {
    const { user } = renderWithProviders(<NewbornCreatePage />);

    await user.type(screen.getByLabelText(/Prénom du bébé/i), 'Sophie');
    await user.type(screen.getByLabelText(/Date de naissance/i), '2025-07-01');

    const createButton = screen.getByText('Créer');
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Naissance enregistrée avec succès')).toBeInTheDocument();
    });
  });

  it('shows validation error when submitting empty form', async () => {
    const { container } = renderWithProviders(<NewbornCreatePage />);

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      const requiredErrors = screen.getAllByText('Ce champ est requis');
      expect(requiredErrors.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', () => {
      renderWithProviders(<NewbornCreatePage />, { authPreset: 'super_admin' });
      expect(screen.getByText('Enregistrer une naissance')).toBeInTheDocument();
    });

    it('renders for admin', () => {
      renderWithProviders(<NewbornCreatePage />, { authPreset: 'admin' });
      expect(screen.getByText('Enregistrer une naissance')).toBeInTheDocument();
    });
  });
});
