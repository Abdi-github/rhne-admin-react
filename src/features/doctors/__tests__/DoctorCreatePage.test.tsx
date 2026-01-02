import { describe, it, expect } from 'vitest';
import { screen, waitFor, fireEvent, within } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import DoctorCreatePage from '../pages/DoctorCreatePage';

describe('DoctorCreatePage', () => {
  it('renders page title', () => {
    renderWithProviders(<DoctorCreatePage />);

    expect(screen.getByText('Créer un médecin')).toBeInTheDocument();
  });

  it('renders back button', () => {
    renderWithProviders(<DoctorCreatePage />);

    expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
  });

  it('renders the doctor form in create mode', () => {
    renderWithProviders(<DoctorCreatePage />);

    expect(screen.getByLabelText(/Nom complet/i)).toBeInTheDocument();
    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('submits form and calls create mutation', async () => {
    const { user } = renderWithProviders(<DoctorCreatePage />);

    await user.type(screen.getByLabelText(/Nom complet/i), 'Nouveau Médecin');

    // Open the service select (2nd combobox after title select)
    const comboboxes = screen.getAllByRole('combobox');
    await user.click(comboboxes[1]);

    // Wait for services data to load from MSW and appear in dropdown
    await waitFor(() => {
      const listbox = screen.getByRole('listbox');
      expect(within(listbox).getByText('Cardiologie')).toBeInTheDocument();
    }, { timeout: 3000 });

    const listbox = screen.getByRole('listbox');
    await user.click(within(listbox).getByText('Cardiologie'));

    const createButton = screen.getByText('Créer');
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Médecin créé avec succès')).toBeInTheDocument();
    });
  });

  it('shows validation error when submitting empty form', async () => {
    const { container } = renderWithProviders(<DoctorCreatePage />);

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      const requiredErrors = screen.getAllByText('Ce champ est requis');
      expect(requiredErrors.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', () => {
      renderWithProviders(<DoctorCreatePage />, { authPreset: 'super_admin' });
      expect(screen.getByText('Créer un médecin')).toBeInTheDocument();
    });

    it('renders for site_manager', () => {
      renderWithProviders(<DoctorCreatePage />, { authPreset: 'site_manager' });
      expect(screen.getByText('Créer un médecin')).toBeInTheDocument();
    });
  });
});
