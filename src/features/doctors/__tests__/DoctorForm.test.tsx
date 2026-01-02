import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, fireEvent, within } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { DoctorForm } from '../components/DoctorForm';

describe('DoctorForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    isLoading: false,
  };

  describe('Create mode', () => {
    it('renders all form fields', () => {
      renderWithProviders(<DoctorForm {...defaultProps} />);

      expect(screen.getByLabelText(/Nom complet/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Titre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Service médical/i)).toBeInTheDocument();
      expect(screen.getByText('Créer')).toBeInTheDocument();
    });

    it('has is_active switch checked by default', () => {
      renderWithProviders(<DoctorForm {...defaultProps} />);

      const activeSwitch = screen.getByLabelText(/Actif/i);
      expect(activeSwitch).toBeChecked();
    });

    it('validates required fields on empty submit', async () => {
      const onSubmit = vi.fn();
      const { container } = renderWithProviders(
        <DoctorForm {...defaultProps} onSubmit={onSubmit} />,
      );

      const form = container.querySelector('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        const requiredErrors = screen.getAllByText('Ce champ est requis');
        expect(requiredErrors.length).toBeGreaterThanOrEqual(1);
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('renders title select with options', async () => {
      const { user } = renderWithProviders(<DoctorForm {...defaultProps} />);

      // Open the title select by clicking on it
      const titleSelect = screen.getByLabelText(/Titre/i);
      await user.click(titleSelect);

      await waitFor(() => {
        expect(screen.getByText('Aucun titre')).toBeInTheDocument();
        expect(screen.getByText('Dr')).toBeInTheDocument();
        expect(screen.getByText('Dre')).toBeInTheDocument();
        expect(screen.getByText('Pr')).toBeInTheDocument();
        expect(screen.getByText('Pre')).toBeInTheDocument();
        expect(screen.getByText('Prof')).toBeInTheDocument();
      });
    });

    it('loads services for service selector', async () => {
      const { user } = renderWithProviders(<DoctorForm {...defaultProps} />);

      // Open the service select (2nd combobox after title select)
      const comboboxes = screen.getAllByRole('combobox');
      await user.click(comboboxes[1]);

      // Wait for services data to load from MSW and appear in dropdown
      await waitFor(() => {
        const listbox = screen.getByRole('listbox');
        expect(within(listbox).getByText('Cardiologie')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('submits form with valid data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <DoctorForm {...defaultProps} onSubmit={onSubmit} />,
      );

      await user.type(screen.getByLabelText(/Nom complet/i), 'Jean Dupont');

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
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toMatchObject({
          name: 'Jean Dupont',
        });
      });
    });
  });

  describe('Edit mode', () => {
    const editValues = {
      name: 'Jean Dupont',
      title: 'Dr' as const,
      service_id: 'service-1',
      image_url: 'https://example.com/dupont.jpg',
      is_active: true,
    };

    it('pre-populates form fields with existing data', () => {
      renderWithProviders(
        <DoctorForm {...defaultProps} defaultValues={editValues} />,
      );

      expect(screen.getByDisplayValue('Jean Dupont')).toBeInTheDocument();
    });

    it('shows save button instead of create', () => {
      renderWithProviders(
        <DoctorForm {...defaultProps} defaultValues={editValues} />,
      );

      expect(screen.getByText('Enregistrer')).toBeInTheDocument();
      expect(screen.queryByText('Créer')).not.toBeInTheDocument();
    });

    it('submits updated data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <DoctorForm {...defaultProps} defaultValues={editValues} onSubmit={onSubmit} />,
      );

      const nameField = screen.getByDisplayValue('Jean Dupont');
      await user.clear(nameField);
      await user.type(nameField, 'Jean-Pierre Dupont');

      const saveButton = screen.getByText('Enregistrer');
      await user.click(saveButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toMatchObject({
          name: 'Jean-Pierre Dupont',
        });
      });
    });
  });

  describe('Loading state', () => {
    it('disables submit button when loading', () => {
      renderWithProviders(<DoctorForm {...defaultProps} isLoading />);

      const createButton = screen.getByText('Créer');
      expect(createButton).toBeDisabled();
    });
  });
});
