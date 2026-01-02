import { describe, it, expect } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { useForm, FormProvider } from 'react-hook-form';
import { SectionEditor } from '../components/SectionEditor';

// Wrapper that provides FormProvider context
function SectionEditorWrapper({ defaultSections = [] }: { defaultSections?: unknown[] }) {
  const methods = useForm({
    defaultValues: {
      sections: defaultSections,
    },
  });

  return (
    <FormProvider {...methods}>
      <form>
        <SectionEditor name="sections" />
      </form>
    </FormProvider>
  );
}

describe('SectionEditor', () => {
  it('renders sections header', () => {
    renderWithProviders(<SectionEditorWrapper />);

    expect(screen.getByText('Sections')).toBeInTheDocument();
  });

  it('renders add section button', () => {
    renderWithProviders(<SectionEditorWrapper />);

    expect(screen.getByText('Ajouter une section')).toBeInTheDocument();
  });

  it('shows empty state when no sections', () => {
    renderWithProviders(<SectionEditorWrapper />);

    expect(screen.getByText('Aucune section ajoutée')).toBeInTheDocument();
  });

  it('adds a section when button is clicked', async () => {
    const { user } = renderWithProviders(<SectionEditorWrapper />);

    await user.click(screen.getByText('Ajouter une section'));

    await waitFor(() => {
      expect(screen.getByText('Section 1')).toBeInTheDocument();
    });
  });

  it('renders section fields after adding', async () => {
    const { user } = renderWithProviders(<SectionEditorWrapper />);

    await user.click(screen.getByText('Ajouter une section'));

    await waitFor(() => {
      expect(screen.getByLabelText(/Titre de la section \(FR\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Contenu de la section \(FR\)/i)).toBeInTheDocument();
    });
  });

  it('renders remove section button', async () => {
    const { user } = renderWithProviders(<SectionEditorWrapper />);

    await user.click(screen.getByText('Ajouter une section'));

    await waitFor(() => {
      expect(screen.getByLabelText('Supprimer la section')).toBeInTheDocument();
    });
  });

  it('removes section when remove button is clicked', async () => {
    const { user } = renderWithProviders(<SectionEditorWrapper />);

    await user.click(screen.getByText('Ajouter une section'));

    await waitFor(() => {
      expect(screen.getByText('Section 1')).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText('Supprimer la section'));

    await waitFor(() => {
      expect(screen.queryByText('Section 1')).not.toBeInTheDocument();
      expect(screen.getByText('Aucune section ajoutée')).toBeInTheDocument();
    });
  });

  it('renders list items area within a section', async () => {
    const { user } = renderWithProviders(<SectionEditorWrapper />);

    await user.click(screen.getByText('Ajouter une section'));

    await waitFor(() => {
      expect(screen.getByText('Éléments de liste')).toBeInTheDocument();
      expect(screen.getByText('Ajouter un élément')).toBeInTheDocument();
      expect(screen.getByText('Aucun élément de liste')).toBeInTheDocument();
    });
  });

  it('adds a list item within a section', async () => {
    const { user } = renderWithProviders(<SectionEditorWrapper />);

    await user.click(screen.getByText('Ajouter une section'));

    await waitFor(() => {
      expect(screen.getByText('Ajouter un élément')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Ajouter un élément'));

    await waitFor(() => {
      expect(screen.getByLabelText(/Éléments de liste 1 \(FR\)/i)).toBeInTheDocument();
    });
  });

  it('renders pre-populated sections', () => {
    const defaultSections = [
      {
        id: 'sec-1',
        title: { fr: 'Section existante', en: '', de: '', it: '' },
        content: { fr: 'Contenu existant', en: '', de: '', it: '' },
        list_items: [],
      },
    ];

    renderWithProviders(<SectionEditorWrapper defaultSections={defaultSections} />);

    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Section existante')).toBeInTheDocument();
  });
});
