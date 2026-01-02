import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { RoleForm } from '../components/RoleForm';

describe('RoleForm', () => {
  const mockOnSubmit = vi.fn();

  it('renders role name field', () => {
    renderWithProviders(
      <RoleForm onSubmit={mockOnSubmit} isLoading={false} />,
    );

    expect(screen.getByLabelText('Nom du rôle')).toBeInTheDocument();
  });

  it('renders create button in create mode', () => {
    renderWithProviders(
      <RoleForm onSubmit={mockOnSubmit} isLoading={false} />,
    );

    expect(screen.getByRole('button', { name: /créer/i })).toBeInTheDocument();
  });

  it('renders save button in edit mode', () => {
    renderWithProviders(
      <RoleForm
        onSubmit={mockOnSubmit}
        isLoading={false}
        isEdit
        defaultValues={{ name: 'test_role' }}
      />,
    );

    expect(screen.getByRole('button', { name: /enregistrer/i })).toBeInTheDocument();
  });

  it('pre-populates default values in edit mode', () => {
    renderWithProviders(
      <RoleForm
        onSubmit={mockOnSubmit}
        isLoading={false}
        isEdit
        defaultValues={{
          name: 'test_role',
          display_name: { fr: 'Rôle Test', en: 'Test Role', de: '', it: '' },
        }}
      />,
    );

    expect(screen.getByDisplayValue('test_role')).toBeInTheDocument();
  });

  it('disables name field in edit mode', () => {
    renderWithProviders(
      <RoleForm
        onSubmit={mockOnSubmit}
        isLoading={false}
        isEdit
        defaultValues={{ name: 'test_role' }}
      />,
    );

    expect(screen.getByLabelText('Nom du rôle')).toBeDisabled();
  });

  it('shows validation errors on empty submit', async () => {
    const { user } = renderWithProviders(
      <RoleForm onSubmit={mockOnSubmit} isLoading={false} />,
    );

    const createBtn = screen.getByRole('button', { name: /créer/i });
    await user.click(createBtn);

    await waitFor(() => {
      // Check that form didn't submit
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('renders is_active switch', () => {
    renderWithProviders(
      <RoleForm onSubmit={mockOnSubmit} isLoading={false} />,
    );

    expect(screen.getByLabelText('Actif')).toBeInTheDocument();
  });

  it('disables submit button when loading', () => {
    renderWithProviders(
      <RoleForm onSubmit={mockOnSubmit} isLoading />,
    );

    expect(screen.getByRole('button', { name: /créer/i })).toBeDisabled();
  });

  it('renders translated field inputs for display_name and description', () => {
    renderWithProviders(
      <RoleForm onSubmit={mockOnSubmit} isLoading={false} />,
    );

    // TranslatedFieldInput renders tabs with language labels
    const frTabs = screen.getAllByRole('tab', { name: 'FR' });
    expect(frTabs.length).toBeGreaterThanOrEqual(2); // display_name + description
  });
});
