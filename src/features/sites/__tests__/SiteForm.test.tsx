import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { SiteForm } from '../components/SiteForm';

describe('SiteForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    isLoading: false,
  };

  describe('Create mode', () => {
    it('renders all form fields', () => {
      renderWithProviders(<SiteForm {...defaultProps} />);

      expect(screen.getByLabelText(/Nom du site/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Type de site \(FR\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Adresse/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Ville/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Code postal/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Téléphone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Lien Google Maps/i)).toBeInTheDocument();
      expect(screen.getByText('Créer')).toBeInTheDocument();
    });

    it('shows translated tabs for type field', () => {
      renderWithProviders(<SiteForm {...defaultProps} />);

      expect(screen.getAllByText('FR').length).toBeGreaterThan(0);
      expect(screen.getAllByText('EN').length).toBeGreaterThan(0);
      expect(screen.getAllByText('DE').length).toBeGreaterThan(0);
      expect(screen.getAllByText('IT').length).toBeGreaterThan(0);
    });

    it('validates required fields on empty submit', async () => {
      const onSubmit = vi.fn();
      const { container } = renderWithProviders(
        <SiteForm {...defaultProps} onSubmit={onSubmit} />,
      );

      const form = container.querySelector('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Le français est requis')).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('validates postal code format', async () => {
      const onSubmit = vi.fn();
      const { user, container } = renderWithProviders(
        <SiteForm {...defaultProps} onSubmit={onSubmit} />,
      );

      // Fill required fields except postal code
      await user.type(screen.getByLabelText(/Nom du site/i), 'Test Site');
      await user.type(screen.getByLabelText(/Type de site \(FR\)/i), 'Soins aigus');
      await user.type(screen.getByLabelText(/Adresse/i), 'Rue Test 1');
      await user.type(screen.getByLabelText(/Ville/i), 'Neuchâtel');
      await user.type(screen.getByLabelText(/Code postal/i), '12'); // Invalid
      await user.type(screen.getByLabelText(/Téléphone/i), '+41 32 000 00 00');

      const form = container.querySelector('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Code postal: 4 chiffres')).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits form with valid data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <SiteForm {...defaultProps} onSubmit={onSubmit} />,
      );

      await user.type(screen.getByLabelText(/Nom du site/i), 'Nouvel Hôpital');
      await user.type(screen.getByLabelText(/Type de site \(FR\)/i), 'Soins aigus');
      await user.type(screen.getByLabelText(/Adresse/i), 'Rue Test 1');
      await user.type(screen.getByLabelText(/Ville/i), 'Neuchâtel');
      await user.type(screen.getByLabelText(/Code postal/i), '2000');
      await user.type(screen.getByLabelText(/Téléphone/i), '+41 32 000 00 00');

      const createButton = screen.getByText('Créer');
      await user.click(createButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Nouvel Hôpital',
            address: 'Rue Test 1',
            city: 'Neuchâtel',
            postal_code: '2000',
            phone: '+41 32 000 00 00',
          }),
          expect.anything(),
        );
      });
    });

    it('allows adding and removing amenities', async () => {
      const { user } = renderWithProviders(<SiteForm {...defaultProps} />);

      // Initially no amenities
      expect(screen.getByText('Aucune donnée disponible')).toBeInTheDocument();

      // Add amenity
      const addButton = screen.getAllByTestId('AddIcon');
      await user.click(addButton[addButton.length - 1]);

      // Amenity field should appear
      await waitFor(() => {
        expect(screen.queryByText('Aucune donnée disponible')).not.toBeInTheDocument();
      });

      // Remove amenity
      const deleteButton = screen.getAllByTestId('DeleteIcon');
      await user.click(deleteButton[deleteButton.length - 1]);

      await waitFor(() => {
        expect(screen.getByText('Aucune donnée disponible')).toBeInTheDocument();
      });
    });

    it('has is_active switch checked by default', () => {
      renderWithProviders(<SiteForm {...defaultProps} />);

      const activeSwitch = screen.getByLabelText(/Actif/i);
      expect(activeSwitch).toBeChecked();
    });
  });

  describe('Edit mode', () => {
    const editValues = {
      name: 'Hôpital Pourtalès',
      type: { fr: 'Soins aigus', en: 'Acute care', de: 'Akutversorgung', it: 'Cure acute' },
      address: 'Rue de la Maladière 45',
      city: 'Neuchâtel',
      postal_code: '2000',
      phone: '+41 32 713 30 00',
      maps_url: 'https://maps.google.com/pourtales',
      image_url: '',
      description: { fr: 'Hôpital principal', en: 'Main hospital', de: 'Hauptkrankenhaus', it: 'Ospedale principale' },
      amenities: [
        { fr: 'Parking', en: 'Parking', de: 'Parkplatz', it: 'Parcheggio' },
      ],
      is_active: true,
    };

    it('pre-populates form fields with existing data', () => {
      renderWithProviders(
        <SiteForm {...defaultProps} defaultValues={editValues} />,
      );

      expect(screen.getByDisplayValue('Hôpital Pourtalès')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Rue de la Maladière 45')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Neuchâtel')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('+41 32 713 30 00')).toBeInTheDocument();
    });

    it('shows save button instead of create', () => {
      renderWithProviders(
        <SiteForm {...defaultProps} defaultValues={editValues} />,
      );

      expect(screen.getByText('Enregistrer')).toBeInTheDocument();
      expect(screen.queryByText('Créer')).not.toBeInTheDocument();
    });

    it('shows existing amenities', () => {
      renderWithProviders(
        <SiteForm {...defaultProps} defaultValues={editValues} />,
      );

      expect(screen.queryByText('Aucune donnée disponible')).not.toBeInTheDocument();
    });

    it('submits updated data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <SiteForm {...defaultProps} defaultValues={editValues} onSubmit={onSubmit} />,
      );

      const nameField = screen.getByDisplayValue('Hôpital Pourtalès');
      await user.clear(nameField);
      await user.type(nameField, 'Hôpital Pourtalès Modifié');

      const saveButton = screen.getByText('Enregistrer');
      await user.click(saveButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Hôpital Pourtalès Modifié',
          }),
          expect.anything(),
        );
      });
    });
  });

  describe('Loading state', () => {
    it('disables submit button when loading', () => {
      renderWithProviders(<SiteForm {...defaultProps} isLoading />);

      const submitButton = screen.getByText('Créer');
      expect(submitButton).toBeDisabled();
    });
  });
});
