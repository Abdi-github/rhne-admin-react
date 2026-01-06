import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { EventForm } from '../components/EventForm';

describe('EventForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    isLoading: false,
  };

  describe('Create mode', () => {
    it('renders all form fields', () => {
      renderWithProviders(<EventForm {...defaultProps} />);

      expect(screen.getByText("Informations de l'événement")).toBeInTheDocument();
      expect(screen.getByText("Détails de l'événement")).toBeInTheDocument();
      // TranslatedFieldInput for title renders with FR tab by default
      expect(screen.getByLabelText(/Titre de l'événement \(FR\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
      expect(screen.getByText('Créer')).toBeInTheDocument();
    });

    it('has is_active switch checked by default', () => {
      renderWithProviders(<EventForm {...defaultProps} />);

      const activeSwitch = screen.getByLabelText(/Actif/i);
      expect(activeSwitch).toBeChecked();
    });

    it('validates required fields on empty submit', async () => {
      const onSubmit = vi.fn();
      const { container } = renderWithProviders(
        <EventForm {...defaultProps} onSubmit={onSubmit} />,
      );

      const form = container.querySelector('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        const requiredErrors = screen.getAllByText('Ce champ est requis');
        expect(requiredErrors.length).toBeGreaterThanOrEqual(1);
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('renders url and detail_url fields', () => {
      renderWithProviders(<EventForm {...defaultProps} />);

      expect(screen.getByLabelText(/^URL$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/URL de détail/i)).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <EventForm {...defaultProps} onSubmit={onSubmit} />,
      );

      await user.type(
        screen.getByLabelText(/Titre de l'événement \(FR\)/i),
        'Nouvel événement',
      );

      const dateInput = screen.getByLabelText(/Date/i);
      await user.type(dateInput, '2025-12-01');

      const createButton = screen.getByText('Créer');
      await user.click(createButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toMatchObject({
          title: { fr: 'Nouvel événement' },
          date: '2025-12-01',
        });
      });
    });
  });

  describe('Edit mode', () => {
    const editValues = {
      title: { fr: 'Journée portes ouvertes', en: 'Open Day', de: 'Tag der offenen Tür', it: 'Giornata porte aperte' },
      date: '2025-09-15',
      url: 'https://rhne.ch/events/portes-ouvertes',
      time: { fr: '09h00 - 17h00', en: '9 AM - 5 PM', de: '09:00 - 17:00', it: '09:00 - 17:00' },
      location: { fr: 'Hôpital Pourtalès, Neuchâtel', en: '', de: '', it: '' },
      category: { fr: 'Événement public', en: '', de: '', it: '' },
      description: { fr: 'Venez découvrir nos installations', en: '', de: '', it: '' },
      detail_url: 'https://rhne.ch/events/details',
      is_active: true,
    };

    it('pre-populates form fields with existing data', () => {
      renderWithProviders(
        <EventForm {...defaultProps} defaultValues={editValues} />,
      );

      expect(screen.getByDisplayValue('Journée portes ouvertes')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2025-09-15')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://rhne.ch/events/portes-ouvertes')).toBeInTheDocument();
    });

    it('shows save button instead of create', () => {
      renderWithProviders(
        <EventForm {...defaultProps} defaultValues={editValues} />,
      );

      expect(screen.getByText('Enregistrer')).toBeInTheDocument();
      expect(screen.queryByText('Créer')).not.toBeInTheDocument();
    });

    it('submits updated data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <EventForm {...defaultProps} defaultValues={editValues} onSubmit={onSubmit} />,
      );

      const titleField = screen.getByDisplayValue('Journée portes ouvertes');
      await user.clear(titleField);
      await user.type(titleField, 'Événement modifié');

      const saveButton = screen.getByText('Enregistrer');
      await user.click(saveButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toMatchObject({
          title: { fr: 'Événement modifié' },
        });
      });
    });
  });

  describe('Loading state', () => {
    it('disables submit button when loading', () => {
      renderWithProviders(<EventForm {...defaultProps} isLoading />);

      const createButton = screen.getByText('Créer');
      expect(createButton).toBeDisabled();
    });
  });
});
