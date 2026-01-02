import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { ServiceDetailView } from '../components/ServiceDetailView';

describe('ServiceDetailView', () => {
  it('renders tabs for contacts and links', async () => {
    renderWithProviders(<ServiceDetailView serviceId="service-1" />);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Contacts/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Liens/i })).toBeInTheDocument();
    });
  });

  it('loads and displays contacts in default tab', async () => {
    renderWithProviders(<ServiceDetailView serviceId="service-1" />);

    await waitFor(() => {
      expect(screen.getByText('Hôpital Pourtalès')).toBeInTheDocument();
      expect(screen.getByText('cardio@rhne.ch')).toBeInTheDocument();
    });
  });

  it('shows add contact button in contacts tab', async () => {
    renderWithProviders(<ServiceDetailView serviceId="service-1" />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Ajouter un contact/i })).toBeInTheDocument();
    });
  });

  it('switches to links tab and displays links', async () => {
    const { user } = renderWithProviders(
      <ServiceDetailView serviceId="service-1" />,
    );

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Liens/i })).toBeInTheDocument();
    });

    const linksTab = screen.getByRole('tab', { name: /Liens/i });
    await user.click(linksTab);

    await waitFor(() => {
      expect(screen.getByText('Guide du patient')).toBeInTheDocument();
      expect(screen.getByText('Brochure informative')).toBeInTheDocument();
    });
  });

  it('shows add link button after switching to links tab', async () => {
    const { user } = renderWithProviders(
      <ServiceDetailView serviceId="service-1" />,
    );

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Liens/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('tab', { name: /Liens/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Ajouter un lien/i })).toBeInTheDocument();
    });
  });

  it('opens contact form dialog when add contact button clicked', async () => {
    const { user } = renderWithProviders(
      <ServiceDetailView serviceId="service-1" />,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Ajouter un contact/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Ajouter un contact/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByLabelText(/Site \/ Lieu/i)).toBeInTheDocument();
    });
  });

  it('opens link form dialog when add link button clicked', async () => {
    const { user } = renderWithProviders(
      <ServiceDetailView serviceId="service-1" />,
    );

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Liens/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('tab', { name: /Liens/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Ajouter un lien/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Ajouter un lien/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByLabelText(/Titre du lien \(FR\)/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when service has no contacts', async () => {
    renderWithProviders(<ServiceDetailView serviceId="service-999" />);

    await waitFor(() => {
      expect(screen.getByText('Aucun contact trouvé')).toBeInTheDocument();
    });
  });

  it('shows contact count in tab label', async () => {
    renderWithProviders(<ServiceDetailView serviceId="service-1" />);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Contacts \(2\)/i })).toBeInTheDocument();
    });
  });

  it('shows link count in tab label', async () => {
    renderWithProviders(<ServiceDetailView serviceId="service-1" />);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Liens \(2\)/i })).toBeInTheDocument();
    });
  });
});
