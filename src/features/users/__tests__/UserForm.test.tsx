import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { UserForm } from '../components/UserForm';

describe('UserForm', () => {
  const mockOnSubmit = vi.fn();

  it('renders all form fields in create mode', () => {
    renderWithProviders(
      <UserForm onSubmit={mockOnSubmit} isLoading={false} />,
    );

    expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse e-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
  });

  it('renders user info and account info cards', () => {
    renderWithProviders(
      <UserForm onSubmit={mockOnSubmit} isLoading={false} />,
    );

    expect(screen.getByText('Informations utilisateur')).toBeInTheDocument();
    expect(screen.getByText('Informations du compte')).toBeInTheDocument();
  });

  it('renders create button in create mode', () => {
    renderWithProviders(
      <UserForm onSubmit={mockOnSubmit} isLoading={false} />,
    );

    expect(screen.getByRole('button', { name: /créer/i })).toBeInTheDocument();
  });

  it('renders save button in edit mode', () => {
    renderWithProviders(
      <UserForm
        onSubmit={mockOnSubmit}
        isLoading={false}
        isEdit
        defaultValues={{ first_name: 'Jean', last_name: 'Dupont', email: 'jean@test.ch', password: '' }}
      />,
    );

    expect(screen.getByRole('button', { name: /enregistrer/i })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    const { user } = renderWithProviders(
      <UserForm onSubmit={mockOnSubmit} isLoading={false} />,
    );

    const createBtn = screen.getByRole('button', { name: /créer/i });
    await user.click(createBtn);

    await waitFor(() => {
      expect(screen.getAllByText('Ce champ est requis').length).toBeGreaterThanOrEqual(1);
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('pre-populates default values in edit mode', () => {
    renderWithProviders(
      <UserForm
        onSubmit={mockOnSubmit}
        isLoading={false}
        isEdit
        defaultValues={{
          first_name: 'Jean',
          last_name: 'Dupont',
          email: 'jean@rhne-clone.ch',
          password: '',
          phone: '+41 32 000 00 00',
        }}
      />,
    );

    expect(screen.getByDisplayValue('Jean')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dupont')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jean@rhne-clone.ch')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+41 32 000 00 00')).toBeInTheDocument();
  });

  it('submits with valid data', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithProviders(
      <UserForm onSubmit={onSubmit} isLoading={false} />,
    );

    await user.type(screen.getByLabelText('Prénom'), 'Test');
    await user.type(screen.getByLabelText('Nom'), 'User');
    await user.type(screen.getByLabelText('Adresse e-mail'), 'test@rhne-clone.ch');
    await user.type(screen.getByLabelText('Mot de passe'), 'TestPass1!');

    const createBtn = screen.getByRole('button', { name: /créer/i });
    await user.click(createBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      const call = onSubmit.mock.calls[0][0];
      expect(call.first_name).toBe('Test');
      expect(call.last_name).toBe('User');
      expect(call.email).toBe('test@rhne-clone.ch');
      expect(call.password).toBe('TestPass1!');
    });
  });

  it('disables submit button when loading', () => {
    renderWithProviders(
      <UserForm onSubmit={mockOnSubmit} isLoading />,
    );

    expect(screen.getByRole('button', { name: /créer/i })).toBeDisabled();
  });

  it('renders is_active and is_verified switches', () => {
    renderWithProviders(
      <UserForm onSubmit={mockOnSubmit} isLoading={false} />,
    );

    expect(screen.getByLabelText('Actif')).toBeInTheDocument();
    expect(screen.getByLabelText('Vérifié')).toBeInTheDocument();
  });

  it('renders language and user type selectors', () => {
    renderWithProviders(
      <UserForm onSubmit={mockOnSubmit} isLoading={false} />,
    );

    expect(screen.getByLabelText('Langue préférée')).toBeInTheDocument();
    expect(screen.getByLabelText("Type d'utilisateur")).toBeInTheDocument();
  });
});
