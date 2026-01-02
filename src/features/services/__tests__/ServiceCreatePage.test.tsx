import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import ServiceCreatePage from '../pages/ServiceCreatePage';

describe('ServiceCreatePage', () => {
  it('renders page title', () => {
    renderWithProviders(<ServiceCreatePage />);

    expect(screen.getByText('Créer un service')).toBeInTheDocument();
  });

  it('renders back button', () => {
    renderWithProviders(<ServiceCreatePage />);

    expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
  });

  it('renders the service form in create mode', () => {
    renderWithProviders(<ServiceCreatePage />);

    expect(screen.getByLabelText(/Nom du service \(FR\)/i)).toBeInTheDocument();
    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('submits form and calls create mutation', async () => {
    const { user } = renderWithProviders(<ServiceCreatePage />);

    const nameField = screen.getByLabelText(/Nom du service \(FR\)/i);
    await user.type(nameField, 'Dermatologie');

    const createButton = screen.getByText('Créer');
    await user.click(createButton);

    // Should show success snackbar after API call
    await waitFor(() => {
      expect(screen.getByText('Service créé avec succès')).toBeInTheDocument();
    });
  });

  it('shows validation error when submitting empty form', async () => {
    const { container } = renderWithProviders(<ServiceCreatePage />);

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Le français est requis')).toBeInTheDocument();
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', () => {
      renderWithProviders(<ServiceCreatePage />, { authPreset: 'super_admin' });
      expect(screen.getByText('Créer un service')).toBeInTheDocument();
    });

    it('renders for content_editor', () => {
      renderWithProviders(<ServiceCreatePage />, { authPreset: 'content_editor' });
      expect(screen.getByText('Créer un service')).toBeInTheDocument();
    });
  });
});
