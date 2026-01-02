import { describe, it, expect } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import PatientInfoCreatePage from '../pages/PatientInfoCreatePage';

describe('PatientInfoCreatePage', () => {
  it('renders page title', () => {
    renderWithProviders(<PatientInfoCreatePage />);

    expect(screen.getByText('Créer une page')).toBeInTheDocument();
  });

  it('renders back button', () => {
    renderWithProviders(<PatientInfoCreatePage />);

    expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
  });

  it('renders the patient info form in create mode', () => {
    renderWithProviders(<PatientInfoCreatePage />);

    expect(screen.getByLabelText(/Titre de la page \(FR\)/i)).toBeInTheDocument();
    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('submits form and calls create mutation', async () => {
    const { user } = renderWithProviders(<PatientInfoCreatePage />);

    await user.type(screen.getByLabelText(/Titre de la page \(FR\)/i), 'Nouvelle page info');

    const createButton = screen.getByText('Créer');
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText("Page d'information créée avec succès")).toBeInTheDocument();
    });
  });

  it('shows validation error when submitting empty form', async () => {
    const { container } = renderWithProviders(<PatientInfoCreatePage />);

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Le français est requis')).toBeInTheDocument();
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', () => {
      renderWithProviders(<PatientInfoCreatePage />, { authPreset: 'super_admin' });
      expect(screen.getByText('Créer une page')).toBeInTheDocument();
    });

    it('renders for content_editor', () => {
      renderWithProviders(<PatientInfoCreatePage />, { authPreset: 'content_editor' });
      expect(screen.getByText('Créer une page')).toBeInTheDocument();
    });
  });
});
