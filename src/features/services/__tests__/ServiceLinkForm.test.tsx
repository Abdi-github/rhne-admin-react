import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { ServiceLinkForm } from '../components/ServiceLinkForm';
import { mockServiceLinks } from '@/test/data/services';

describe('ServiceLinkForm', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    isLoading: false,
  };

  describe('Create mode', () => {
    it('renders empty form with dialog title', () => {
      renderWithProviders(<ServiceLinkForm {...defaultProps} />);

      expect(screen.getByText('Ajouter un lien')).toBeInTheDocument();
      expect(screen.getByLabelText(/Titre du lien \(FR\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/URL/i)).toBeInTheDocument();
    });

    it('shows language tabs for translated title field', () => {
      renderWithProviders(<ServiceLinkForm {...defaultProps} />);

      expect(screen.getByText('FR')).toBeInTheDocument();
      expect(screen.getByText('EN')).toBeInTheDocument();
      expect(screen.getByText('DE')).toBeInTheDocument();
      expect(screen.getByText('IT')).toBeInTheDocument();
    });

    it('validates required French title', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <ServiceLinkForm {...defaultProps} onSubmit={onSubmit} />,
      );

      // Fill URL but leave title empty
      await user.type(screen.getByLabelText(/URL/i), 'https://example.com');

      const saveButton = screen.getByRole('button', { name: /Enregistrer/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Le français est requis')).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('validates URL format', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <ServiceLinkForm {...defaultProps} onSubmit={onSubmit} />,
      );

      await user.type(screen.getByLabelText(/Titre du lien \(FR\)/i), 'Test Link');
      await user.type(screen.getByLabelText(/URL/i), 'not-a-url');

      const saveButton = screen.getByRole('button', { name: /Enregistrer/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('URL invalide')).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits form with valid data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <ServiceLinkForm {...defaultProps} onSubmit={onSubmit} />,
      );

      await user.type(screen.getByLabelText(/Titre du lien \(FR\)/i), 'Guide patient');
      await user.type(screen.getByLabelText(/URL/i), 'https://example.com/guide');

      const saveButton = screen.getByRole('button', { name: /Enregistrer/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            title: expect.objectContaining({ fr: 'Guide patient' }),
            url: 'https://example.com/guide',
          }),
        );
      });
    });

    it('calls onClose when cancel button clicked', async () => {
      const onClose = vi.fn();
      const { user } = renderWithProviders(
        <ServiceLinkForm {...defaultProps} onClose={onClose} />,
      );

      const cancelButton = screen.getByRole('button', { name: /Annuler/i });
      await user.click(cancelButton);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Edit mode', () => {
    it('renders form with edit dialog title', () => {
      renderWithProviders(
        <ServiceLinkForm {...defaultProps} editLink={mockServiceLinks[0]} />,
      );

      expect(screen.getByText('Modifier le lien')).toBeInTheDocument();
    });

    it('pre-populates form with link data', () => {
      renderWithProviders(
        <ServiceLinkForm {...defaultProps} editLink={mockServiceLinks[0]} />,
      );

      expect(screen.getByDisplayValue('Guide du patient')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://example.com/guide-cardio')).toBeInTheDocument();
    });

    it('submits updated data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <ServiceLinkForm
          {...defaultProps}
          editLink={mockServiceLinks[0]}
          onSubmit={onSubmit}
        />,
      );

      const urlField = screen.getByDisplayValue('https://example.com/guide-cardio');
      await user.clear(urlField);
      await user.type(urlField, 'https://example.com/updated-guide');

      const saveButton = screen.getByRole('button', { name: /Enregistrer/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            url: 'https://example.com/updated-guide',
          }),
        );
      });
    });
  });

  describe('Closed state', () => {
    it('does not render when dialog is closed', () => {
      renderWithProviders(
        <ServiceLinkForm {...defaultProps} open={false} />,
      );

      expect(screen.queryByText('Ajouter un lien')).not.toBeInTheDocument();
    });
  });
});
