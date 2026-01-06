import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { JobForm } from '../components/JobForm';

describe('JobForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    isLoading: false,
  };

  describe('Create mode', () => {
    it('renders all form fields', () => {
      renderWithProviders(<JobForm {...defaultProps} />);

      expect(screen.getByText("Informations de l'offre")).toBeInTheDocument();
      expect(screen.getByText("Détails de l'offre")).toBeInTheDocument();
      expect(screen.getByText('Exigences')).toBeInTheDocument();
      // TranslatedFieldInput for title renders with FR tab by default
      expect(screen.getByLabelText(/Titre du poste \(FR\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Référence/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Catégorie/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Taux d'activité/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^Site$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Département/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Date de publication/i)).toBeInTheDocument();
      expect(screen.getByText('Créer')).toBeInTheDocument();
    });

    it('has is_active switch checked by default', () => {
      renderWithProviders(<JobForm {...defaultProps} />);

      const activeSwitch = screen.getByLabelText(/Actif/i);
      expect(activeSwitch).toBeChecked();
    });

    it('validates required fields on empty submit', async () => {
      const onSubmit = vi.fn();
      const { container } = renderWithProviders(
        <JobForm {...defaultProps} onSubmit={onSubmit} />,
      );

      const form = container.querySelector('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        const requiredErrors = screen.getAllByText('Le français est requis');
        expect(requiredErrors.length).toBeGreaterThanOrEqual(1);
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('renders url field', () => {
      renderWithProviders(<JobForm {...defaultProps} />);

      expect(screen.getByLabelText(/^URL$/i)).toBeInTheDocument();
    });

    it('renders add requirement button', () => {
      renderWithProviders(<JobForm {...defaultProps} />);

      expect(screen.getByText('Ajouter une exigence')).toBeInTheDocument();
    });

    it('adds a requirement when button is clicked', async () => {
      const { user } = renderWithProviders(<JobForm {...defaultProps} />);

      await user.click(screen.getByText('Ajouter une exigence'));

      await waitFor(() => {
        expect(screen.getByLabelText(/Exigences 1 \(FR\)/i)).toBeInTheDocument();
      });
    });

    it('submits form with valid data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <JobForm {...defaultProps} onSubmit={onSubmit} />,
      );

      await user.type(
        screen.getByLabelText(/Titre du poste \(FR\)/i),
        'Nouveau poste',
      );

      const createButton = screen.getByText('Créer');
      await user.click(createButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toMatchObject({
          title: { fr: 'Nouveau poste' },
        });
      });
    });
  });

  describe('Edit mode', () => {
    const editValues = {
      title: { fr: 'Infirmier/ère diplômé/e', en: 'Registered Nurse', de: 'Diplomierte Pflegefachperson', it: 'Infermiere/a diplomato/a' },
      job_id: 'RHN-2025-001',
      url: 'https://rhne.ch/jobs/infirmier',
      category: 'Soins',
      percentage: '80-100%',
      description: { fr: 'Poste d\'infirmier/ère en médecine interne', en: '', de: '', it: '' },
      requirements: [
        { fr: 'Diplôme HES en soins infirmiers', en: '', de: '', it: '' },
      ],
      site: 'Pourtalès',
      department: 'Médecine interne',
      published_date: '2025-06-01',
      is_active: true,
    };

    it('pre-populates form fields with existing data', () => {
      renderWithProviders(
        <JobForm {...defaultProps} defaultValues={editValues} />,
      );

      expect(screen.getByDisplayValue('Infirmier/ère diplômé/e')).toBeInTheDocument();
      expect(screen.getByDisplayValue('RHN-2025-001')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Soins')).toBeInTheDocument();
      expect(screen.getByDisplayValue('80-100%')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Pourtalès')).toBeInTheDocument();
    });

    it('shows save button instead of create', () => {
      renderWithProviders(
        <JobForm {...defaultProps} defaultValues={editValues} />,
      );

      expect(screen.getByText('Enregistrer')).toBeInTheDocument();
      expect(screen.queryByText('Créer')).not.toBeInTheDocument();
    });

    it('pre-populates requirements', () => {
      renderWithProviders(
        <JobForm {...defaultProps} defaultValues={editValues} />,
      );

      expect(screen.getByDisplayValue('Diplôme HES en soins infirmiers')).toBeInTheDocument();
    });

    it('submits updated data', async () => {
      const onSubmit = vi.fn();
      const { user } = renderWithProviders(
        <JobForm {...defaultProps} defaultValues={editValues} onSubmit={onSubmit} />,
      );

      const titleField = screen.getByDisplayValue('Infirmier/ère diplômé/e');
      await user.clear(titleField);
      await user.type(titleField, 'Poste modifié');

      const saveButton = screen.getByText('Enregistrer');
      await user.click(saveButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0]).toMatchObject({
          title: { fr: 'Poste modifié' },
        });
      });
    });
  });

  describe('Loading state', () => {
    it('disables submit button when loading', () => {
      renderWithProviders(<JobForm {...defaultProps} isLoading />);

      const createButton = screen.getByText('Créer');
      expect(createButton).toBeDisabled();
    });
  });
});
