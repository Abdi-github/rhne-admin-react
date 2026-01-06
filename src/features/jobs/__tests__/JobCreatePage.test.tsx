import { describe, it, expect } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import JobCreatePage from '../pages/JobCreatePage';

describe('JobCreatePage', () => {
  it('renders page title', () => {
    renderWithProviders(<JobCreatePage />);

    expect(screen.getByText("Créer une offre d'emploi")).toBeInTheDocument();
  });

  it('renders back button', () => {
    renderWithProviders(<JobCreatePage />);

    expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
  });

  it('renders the job form in create mode', () => {
    renderWithProviders(<JobCreatePage />);

    expect(screen.getByLabelText(/Titre du poste \(FR\)/i)).toBeInTheDocument();
    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('submits form and calls create mutation', async () => {
    const { user } = renderWithProviders(<JobCreatePage />);

    await user.type(
      screen.getByLabelText(/Titre du poste \(FR\)/i),
      'Nouveau poste',
    );

    const createButton = screen.getByText('Créer');
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText("Offre d'emploi créée avec succès")).toBeInTheDocument();
    });
  });

  it('shows validation error when submitting empty form', async () => {
    const { container } = renderWithProviders(<JobCreatePage />);

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      const requiredErrors = screen.getAllByText('Le français est requis');
      expect(requiredErrors.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', () => {
      renderWithProviders(<JobCreatePage />, { authPreset: 'super_admin' });
      expect(screen.getByText("Créer une offre d'emploi")).toBeInTheDocument();
    });

    it('renders for hr_manager', () => {
      renderWithProviders(<JobCreatePage />, { authPreset: 'hr_manager' });
      expect(screen.getByText("Créer une offre d'emploi")).toBeInTheDocument();
    });
  });
});
