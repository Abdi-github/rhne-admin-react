import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { ServiceContactForm } from '../components/ServiceContactForm';
import { mockServiceContacts } from '@/test/data/services';

describe('ServiceContactForm', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    isLoading: false,
  };

  describe('Create mode', () => {
    it('renders empty form with dialog title', () => {
      renderWithProviders(<ServiceContactForm {...defaultProps} />);

      expect(screen.getByText('Ajouter un contact')).toBeInTheDocument();
      expect(screen.getByLabelText(/Site \/ Lieu/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Téléphone/i)).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <ServiceContactForm {...defaultProps} onSubmit={onSubmit} />,
      );

      await user.type(screen.getByLabelText(/Site \/ Lieu/i), 'Hôpital Test');
      await user.type(screen.getByLabelText(/E-mail/i), 'test@rhne.ch');
      await user.type(screen.getByLabelText(/Téléphone/i), '+41 32 000 00 00');

      // Click Save button in FormDialog
      const saveButton = screen.getByRole('button', { name: /Enregistrer/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            site_name: 'Hôpital Test',
            email: 'test@rhne.ch',
            phone: '+41 32 000 00 00',
          }),
        );
      });
    });

    it('shows validation error for invalid email', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <ServiceContactForm {...defaultProps} onSubmit={onSubmit} />,
      );

      await user.type(screen.getByLabelText(/E-mail/i), 'not-an-email');

      const saveButton = screen.getByRole('button', { name: /Enregistrer/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Email invalide')).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('calls onClose when cancel button clicked', async () => {
      const onClose = vi.fn();
      const { user } = renderWithProviders(
        <ServiceContactForm {...defaultProps} onClose={onClose} />,
      );

      const cancelButton = screen.getByRole('button', { name: /Annuler/i });
      await user.click(cancelButton);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Edit mode', () => {
    it('renders form with dialog title for editing', () => {
      renderWithProviders(
        <ServiceContactForm {...defaultProps} editContact={mockServiceContacts[0]} />,
      );

      expect(screen.getByText('Modifier le contact')).toBeInTheDocument();
    });

    it('pre-populates form with contact data', () => {
      renderWithProviders(
        <ServiceContactForm {...defaultProps} editContact={mockServiceContacts[0]} />,
      );

      expect(screen.getByDisplayValue('Hôpital Pourtalès')).toBeInTheDocument();
      expect(screen.getByDisplayValue('cardio@rhne.ch')).toBeInTheDocument();
      expect(screen.getByDisplayValue('+41 32 713 30 50')).toBeInTheDocument();
    });

    it('submits updated data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <ServiceContactForm
          {...defaultProps}
          editContact={mockServiceContacts[0]}
          onSubmit={onSubmit}
        />,
      );

      const emailField = screen.getByDisplayValue('cardio@rhne.ch');
      await user.clear(emailField);
      await user.type(emailField, 'updated@rhne.ch');

      const saveButton = screen.getByRole('button', { name: /Enregistrer/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            email: 'updated@rhne.ch',
          }),
        );
      });
    });
  });

  describe('Loading state', () => {
    it('does not render when dialog is closed', () => {
      renderWithProviders(
        <ServiceContactForm {...defaultProps} open={false} />,
      );

      expect(screen.queryByText('Ajouter un contact')).not.toBeInTheDocument();
    });
  });
});
