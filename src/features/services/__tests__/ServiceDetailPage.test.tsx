import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import ServiceDetailPage from '../pages/ServiceDetailPage';
import { Route, Routes } from 'react-router-dom';

function renderDetailPage(serviceId = 'service-1') {
  return renderWithProviders(
    <Routes>
      <Route path="/services/:id" element={<ServiceDetailPage />} />
    </Routes>,
    { route: `/services/${serviceId}` },
  );
}

describe('ServiceDetailPage', () => {
  it('shows loading spinner while fetching', () => {
    renderDetailPage();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders page title after loading', async () => {
    renderDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Détail du service')).toBeInTheDocument();
    });
  });

  it('displays service name in overview card', async () => {
    renderDetailPage();

    await waitFor(() => {
      // Service name appears in subtitle and card
      const headings = screen.getAllByText('Cardiologie');
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  it('shows service category', async () => {
    renderDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Médecine interne')).toBeInTheDocument();
    });
  });

  it('shows active status chip', async () => {
    renderDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Actif')).toBeInTheDocument();
    });
  });

  it('shows service description', async () => {
    renderDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Service de cardiologie interventionnelle')).toBeInTheDocument();
    });
  });

  it('renders breadcrumbs', async () => {
    renderDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Services médicaux')).toBeInTheDocument();
    });
  });

  it('renders back and edit buttons', async () => {
    renderDetailPage();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Retour/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Modifier/i })).toBeInTheDocument();
    });
  });

  it('displays ServiceDetailView with contacts and links tabs', async () => {
    renderDetailPage();

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Contacts/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Liens/i })).toBeInTheDocument();
    });
  });

  it('loads contacts for the service', async () => {
    renderDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Hôpital Pourtalès')).toBeInTheDocument();
      expect(screen.getByText('cardio@rhne.ch')).toBeInTheDocument();
    });
  });

  it('returns null for non-existent service', async () => {
    const { container } = renderDetailPage('non-existent');

    // Service not found; component returns null after loading
    await waitFor(() => {
      expect(screen.queryByText('Détail du service')).not.toBeInTheDocument();
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/services/:id" element={<ServiceDetailPage />} />
        </Routes>,
        { route: '/services/service-1', authPreset: 'super_admin' },
      );

      await waitFor(() => {
        expect(screen.getByText('Détail du service')).toBeInTheDocument();
      });
    });

    it('renders for content_editor', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/services/:id" element={<ServiceDetailPage />} />
        </Routes>,
        { route: '/services/service-1', authPreset: 'content_editor' },
      );

      await waitFor(() => {
        expect(screen.getByText('Détail du service')).toBeInTheDocument();
      });
    });
  });
});
