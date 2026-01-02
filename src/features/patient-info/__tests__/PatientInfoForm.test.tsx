import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { PatientInfoForm } from '../components/PatientInfoForm';

const defaultProps = {
  onSubmit: vi.fn(),
  isLoading: false,
};

describe('PatientInfoForm', () => {
  it('renders form fields', () => {
    renderWithProviders(<PatientInfoForm {...defaultProps} />);

    expect(screen.getByText('Informations de la page')).toBeInTheDocument();
    expect(screen.getByLabelText(/Titre de la page \(FR\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Section/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Image/i)).toBeInTheDocument();
  });

  it('renders content card', () => {
    renderWithProviders(<PatientInfoForm {...defaultProps} />);

    expect(screen.getByText('Contenu de la page')).toBeInTheDocument();
    expect(screen.getByLabelText(/Contenu \(FR\)/i)).toBeInTheDocument();
  });

  it('renders sections editor', () => {
    renderWithProviders(<PatientInfoForm {...defaultProps} />);

    expect(screen.getByText('Sections')).toBeInTheDocument();
    expect(screen.getByText('Ajouter une section')).toBeInTheDocument();
  });

  it('renders create button in create mode', () => {
    renderWithProviders(<PatientInfoForm {...defaultProps} />);

    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('renders save button in edit mode', () => {
    renderWithProviders(
      <PatientInfoForm
        {...defaultProps}
        defaultValues={{
          title: { fr: 'Test', en: '', de: '', it: '' },
          section: '',
          url: '',
          content: null,
          image_url: '',
          sections: [],
        }}
      />
    );

    expect(screen.getByText('Enregistrer')).toBeInTheDocument();
  });

  it('shows validation error when title is empty', async () => {
    const { container } = renderWithProviders(<PatientInfoForm {...defaultProps} />);

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Le français est requis')).toBeInTheDocument();
    });
  });

  it('submits valid form data', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithProviders(
      <PatientInfoForm {...defaultProps} onSubmit={onSubmit} />
    );

    await user.type(screen.getByLabelText(/Titre de la page \(FR\)/i), 'Nouvelle page');
    await user.type(screen.getByLabelText(/Section/i), 'Général');

    const createButton = screen.getByText('Créer');
    await user.click(createButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      const values = onSubmit.mock.calls[0][0];
      expect(values.title.fr).toBe('Nouvelle page');
      expect(values.section).toBe('Général');
    });
  });

  it('pre-populates form in edit mode', () => {
    renderWithProviders(
      <PatientInfoForm
        {...defaultProps}
        defaultValues={{
          title: { fr: "Admission à l'hôpital", en: 'Hospital Admission', de: '', it: '' },
          section: 'Séjour',
          url: 'https://example.com',
          content: { fr: 'Contenu de test', en: '', de: '', it: '' },
          image_url: 'https://example.com/image.jpg',
          sections: [],
        }}
      />
    );

    expect(screen.getByDisplayValue("Admission à l'hôpital")).toBeInTheDocument();
    expect(screen.getByDisplayValue('Séjour')).toBeInTheDocument();
    expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument();
  });

  it('pre-populates sections in edit mode', () => {
    renderWithProviders(
      <PatientInfoForm
        {...defaultProps}
        defaultValues={{
          title: { fr: 'Test', en: '', de: '', it: '' },
          section: '',
          url: '',
          content: null,
          image_url: '',
          sections: [
            {
              id: 'sec-1',
              title: { fr: 'Documents nécessaires', en: '', de: '', it: '' },
              content: { fr: 'Veuillez apporter...', en: '', de: '', it: '' },
              list_items: [],
            },
          ],
        }}
      />
    );

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Documents nécessaires')).toBeInTheDocument();
  });

  it('submits with sections', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithProviders(
      <PatientInfoForm {...defaultProps} onSubmit={onSubmit} />
    );

    await user.type(screen.getByLabelText(/Titre de la page \(FR\)/i), 'Page test');

    // Add a section
    await user.click(screen.getByText('Ajouter une section'));

    await waitFor(() => {
      expect(screen.getByLabelText(/Titre de la section \(FR\)/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/Titre de la section \(FR\)/i), 'Section test');

    await user.click(screen.getByText('Créer'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      const values = onSubmit.mock.calls[0][0];
      expect(values.sections).toHaveLength(1);
      expect(values.sections[0].title.fr).toBe('Section test');
    });
  });

  it('disables submit button when loading', () => {
    renderWithProviders(<PatientInfoForm {...defaultProps} isLoading={true} />);

    expect(screen.getByText('Créer')).toBeDisabled();
  });
});
