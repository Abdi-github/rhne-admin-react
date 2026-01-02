import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { NewbornForm } from '../components/NewbornForm';

describe('NewbornForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    isLoading: false,
  };

  describe('Create mode', () => {
    it('renders all form fields', () => {
      renderWithProviders(<NewbornForm {...defaultProps} />);

      expect(screen.getByText('Informations de la naissance')).toBeInTheDocument();
      expect(screen.getByLabelText(/Prénom du bébé/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Date de naissance/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Photo/i)).toBeInTheDocument();
      expect(screen.getByText('Créer')).toBeInTheDocument();
    });

    it('validates required fields on empty submit', async () => {
      const onSubmit = vi.fn();
      const { container } = renderWithProviders(
        <NewbornForm {...defaultProps} onSubmit={onSubmit} />,
      );

      const form = container.querySelector('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        const requiredErrors = screen.getAllByText('Ce champ est requis');
        expect(requiredErrors.length).toBeGreaterThanOrEqual(1);
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('submits form with valid data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <NewbornForm {...defaultProps} onSubmit={onSubmit} />,
      );

      await user.type(screen.getByLabelText(/Prénom du bébé/i), 'Sophie');
      await user.type(screen.getByLabelText(/Date de naissance/i), '2025-07-01');

      const createButton = screen.getByText('Créer');
      await user.click(createButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toMatchObject({
          name: 'Sophie',
          date: '2025-07-01',
        });
      });
    });
  });

  describe('Edit mode', () => {
    const editValues = {
      name: 'Emma',
      date: '2025-06-15',
      image_url: 'https://example.com/photos/emma.jpg',
    };

    it('pre-populates form fields with existing data', () => {
      renderWithProviders(
        <NewbornForm {...defaultProps} defaultValues={editValues} />,
      );

      expect(screen.getByDisplayValue('Emma')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2025-06-15')).toBeInTheDocument();
      expect(screen.getByDisplayValue('https://example.com/photos/emma.jpg')).toBeInTheDocument();
    });

    it('shows save button instead of create', () => {
      renderWithProviders(
        <NewbornForm {...defaultProps} defaultValues={editValues} />,
      );

      expect(screen.getByText('Enregistrer')).toBeInTheDocument();
      expect(screen.queryByText('Créer')).not.toBeInTheDocument();
    });

    it('submits updated data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <NewbornForm {...defaultProps} defaultValues={editValues} onSubmit={onSubmit} />,
      );

      const nameField = screen.getByDisplayValue('Emma');
      await user.clear(nameField);
      await user.type(nameField, 'Émilie');

      const saveButton = screen.getByText('Enregistrer');
      await user.click(saveButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toMatchObject({
          name: 'Émilie',
        });
      });
    });
  });

  describe('Loading state', () => {
    it('disables submit button when loading', () => {
      renderWithProviders(<NewbornForm {...defaultProps} isLoading />);

      const createButton = screen.getByText('Créer');
      expect(createButton).toBeDisabled();
    });
  });
});
