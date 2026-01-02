import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import ServiceEditPage from '../pages/ServiceEditPage';
import { Route, Routes } from 'react-router-dom';

function renderEditPage(serviceId = 'service-1') {
  return renderWithProviders(
    <Routes>
      <Route path="/services/:id/edit" element={<ServiceEditPage />} />
    </Routes>,
    { route: `/services/${serviceId}/edit` },
  );
}

describe('ServiceEditPage', () => {
  it('shows loading spinner while fetching', () => {
    renderEditPage();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders page title after loading', async () => {
    renderEditPage();

    await waitFor(() => {
      expect(screen.getByText('Modifier le service')).toBeInTheDocument();
    });
  });

  it('shows subtitle with service name', async () => {
    renderEditPage();

    await waitFor(() => {
      expect(screen.getByText('Cardiologie')).toBeInTheDocument();
    });
  });

  it('pre-populates form with service data', async () => {
    renderEditPage();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Cardiologie')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Médecine interne')).toBeInTheDocument();
    });
  });

  it('renders save button (edit mode)', async () => {
    renderEditPage();

    await waitFor(() => {
      expect(screen.getByText('Enregistrer')).toBeInTheDocument();
    });
  });

  it('renders back button', async () => {
    renderEditPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
    });
  });

  it('submits updated data', async () => {
    const { user } = renderEditPage();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Cardiologie')).toBeInTheDocument();
    });

    const nameField = screen.getByDisplayValue('Cardiologie');
    await user.clear(nameField);
    await user.type(nameField, 'Cardiologie interventionnelle');

    const saveButton = screen.getByText('Enregistrer');
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Service mis à jour avec succès')).toBeInTheDocument();
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/services/:id/edit" element={<ServiceEditPage />} />
        </Routes>,
        { route: '/services/service-1/edit', authPreset: 'super_admin' },
      );

      await waitFor(() => {
        expect(screen.getByText('Modifier le service')).toBeInTheDocument();
      });
    });

    it('renders for content_editor', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/services/:id/edit" element={<ServiceEditPage />} />
        </Routes>,
        { route: '/services/service-1/edit', authPreset: 'content_editor' },
      );

      await waitFor(() => {
        expect(screen.getByText('Modifier le service')).toBeInTheDocument();
      });
    });
  });
});
