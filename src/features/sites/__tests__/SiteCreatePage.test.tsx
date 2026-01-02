import { describe, it, expect } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import SiteCreatePage from '../pages/SiteCreatePage';

describe('SiteCreatePage', () => {
  it('renders page title', () => {
    renderWithProviders(<SiteCreatePage />);

    expect(screen.getByText('Créer un site')).toBeInTheDocument();
  });

  it('renders back button', () => {
    renderWithProviders(<SiteCreatePage />);

    expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
  });

  it('renders the site form in create mode', () => {
    renderWithProviders(<SiteCreatePage />);

    expect(screen.getByLabelText(/Nom du site/i)).toBeInTheDocument();
    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('submits form and calls create mutation', async () => {
    const { user } = renderWithProviders(<SiteCreatePage />);

    await user.type(screen.getByLabelText(/Nom du site/i), 'Nouvel Hôpital');
    await user.type(screen.getByLabelText(/Type de site \(FR\)/i), 'Soins aigus');
    await user.type(screen.getByLabelText(/Adresse/i), 'Rue Test 1');
    await user.type(screen.getByLabelText(/Ville/i), 'Neuchâtel');
    await user.type(screen.getByLabelText(/Code postal/i), '2000');
    await user.type(screen.getByLabelText(/Téléphone/i), '+41 32 000 00 00');

    const createButton = screen.getByText('Créer');
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Site créé avec succès')).toBeInTheDocument();
    });
  });

  it('shows validation error when submitting empty form', async () => {
    const { container } = renderWithProviders(<SiteCreatePage />);

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Le français est requis')).toBeInTheDocument();
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', () => {
      renderWithProviders(<SiteCreatePage />, { authPreset: 'super_admin' });
      expect(screen.getByText('Créer un site')).toBeInTheDocument();
    });

    it('renders for admin', () => {
      renderWithProviders(<SiteCreatePage />, { authPreset: 'admin' });
      expect(screen.getByText('Créer un site')).toBeInTheDocument();
    });
  });
});
