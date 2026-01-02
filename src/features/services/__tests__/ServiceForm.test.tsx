import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { ServiceForm } from '../components/ServiceForm';

describe('ServiceForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    isLoading: false,
  };

  // ── Create mode tests ──
  describe('Create mode', () => {
    it('renders all form fields', () => {
      renderWithProviders(<ServiceForm {...defaultProps} />);

      expect(screen.getByLabelText(/Nom du service \(FR\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Catégorie/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Actif/i)).toBeInTheDocument();
      expect(screen.getByText('Créer')).toBeInTheDocument();
    });

    it('shows translated tabs (FR, EN, DE, IT)', () => {
      renderWithProviders(<ServiceForm {...defaultProps} />);

      expect(screen.getAllByText('FR').length).toBeGreaterThan(0);
      expect(screen.getAllByText('EN').length).toBeGreaterThan(0);
      expect(screen.getAllByText('DE').length).toBeGreaterThan(0);
      expect(screen.getAllByText('IT').length).toBeGreaterThan(0);
    });

    it('validates required French name field on empty submit', async () => {
      const onSubmit = vi.fn();
      const { container } = renderWithProviders(
        <ServiceForm {...defaultProps} onSubmit={onSubmit} />,
      );

      const form = container.querySelector('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Le français est requis')).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits form with valid data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <ServiceForm {...defaultProps} onSubmit={onSubmit} />,
      );

      const nameField = screen.getByLabelText(/Nom du service \(FR\)/i);
      await user.type(nameField, 'Dermatologie');

      const categoryField = screen.getByLabelText(/Catégorie/i);
      await user.type(categoryField, 'Médecine interne');

      const createButton = screen.getByText('Créer');
      await user.click(createButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: expect.objectContaining({ fr: 'Dermatologie' }),
            category: 'Médecine interne',
            is_active: true,
          }),
          expect.anything(),
        );
      });
    });

    it('allows adding and removing prestations', async () => {
      const { user } = renderWithProviders(<ServiceForm {...defaultProps} />);

      // Initially no prestations
      expect(screen.getByText('Aucune donnée disponible')).toBeInTheDocument();

      // Click add prestation button (+ icon in Prestations card header)
      const addButtons = screen.getAllByTestId('AddIcon');
      await user.click(addButtons[addButtons.length - 1]); // last Add button = prestations

      await waitFor(() => {
        expect(screen.queryByText('Aucune donnée disponible')).not.toBeInTheDocument();
      });

      // Remove the prestation
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      await user.click(deleteButtons[deleteButtons.length - 1]);

      await waitFor(() => {
        expect(screen.getByText('Aucune donnée disponible')).toBeInTheDocument();
      });
    });

    it('has is_active switch checked by default', () => {
      renderWithProviders(<ServiceForm {...defaultProps} />);

      const activeSwitch = screen.getByRole('checkbox');
      expect(activeSwitch).toBeChecked();
    });
  });

  // ── Edit mode tests ──
  describe('Edit mode', () => {
    const editDefaults = {
      name: { fr: 'Cardiologie', en: 'Cardiology', de: 'Kardiologie', it: 'Cardiologia' },
      category: 'Médecine interne',
      image_url: 'https://example.com/cardio.jpg',
      description: { fr: 'Service de cardiologie', en: '', de: '', it: '' },
      prestations: [
        { fr: 'Échocardiographie', en: '', de: '', it: '' },
      ],
      is_active: true,
    };

    it('pre-populates form fields with existing data', () => {
      renderWithProviders(
        <ServiceForm {...defaultProps} defaultValues={editDefaults} />,
      );

      expect(screen.getByDisplayValue('Cardiologie')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Médecine interne')).toBeInTheDocument();
      expect(screen.getByText('Enregistrer')).toBeInTheDocument(); // Save button in edit mode
    });

    it('shows existing prestations', () => {
      renderWithProviders(
        <ServiceForm {...defaultProps} defaultValues={editDefaults} />,
      );

      expect(screen.getByDisplayValue('Échocardiographie')).toBeInTheDocument();
    });

    it('submits updated data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <ServiceForm {...defaultProps} defaultValues={editDefaults} onSubmit={onSubmit} />,
      );

      const nameField = screen.getByDisplayValue('Cardiologie');
      await user.clear(nameField);
      await user.type(nameField, 'Cardiologie interventionnelle');

      const saveButton = screen.getByText('Enregistrer');
      await user.click(saveButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: expect.objectContaining({ fr: 'Cardiologie interventionnelle' }),
          }),
          expect.anything(),
        );
      });
    });
  });

  // ── Disabled state ──
  describe('Loading state', () => {
    it('disables submit button when loading', () => {
      renderWithProviders(
        <ServiceForm {...defaultProps} isLoading={true} />,
      );

      const button = screen.getByText('Créer');
      expect(button).toBeDisabled();
    });
  });
});
