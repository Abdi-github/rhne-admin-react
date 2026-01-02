import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { Route, Routes } from 'react-router-dom';
import UserDetailPage from '../pages/UserDetailPage';

function renderPage(id = 'user-1') {
  return renderWithProviders(
    <Routes>
      <Route path="/users/:id" element={<UserDetailPage />} />
    </Routes>,
    { route: `/users/${id}` },
  );
}

describe('UserDetailPage', () => {
  describe('Rendering', () => {
    it('renders page title', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Modifier l\'utilisateur')).toBeInTheDocument();
      });
    });

    it('shows loading spinner initially', () => {
      renderPage();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders user name as subtitle', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      });
    });

    it('renders back button', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Retour')).toBeInTheDocument();
      });
    });

    it('renders assign roles button', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByText('Assigner des rôles')).toBeInTheDocument();
      });
    });

    it('pre-populates form with user data', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByDisplayValue('Jean')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Dupont')).toBeInTheDocument();
        expect(screen.getByDisplayValue('superadmin@rhne-clone.ch')).toBeInTheDocument();
      });
    });

    it('renders save button in edit mode', async () => {
      renderPage();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /enregistrer/i })).toBeInTheDocument();
      });
    });
  });

  describe('Role assignment', () => {
    it('opens role assignment dialog when button clicked', async () => {
      const { user } = renderPage();
      await waitFor(() => {
        expect(screen.getByText('Assigner des rôles')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Assigner des rôles'));
      await waitFor(() => {
        expect(screen.getByText('Sélectionnez les rôles à assigner à cet utilisateur')).toBeInTheDocument();
      });
    });
  });

  describe('RBAC', () => {
    it('renders for super_admin', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/users/:id" element={<UserDetailPage />} />
        </Routes>,
        { route: '/users/user-1', authPreset: 'super_admin' },
      );
      await waitFor(() => {
        expect(screen.getByText('Modifier l\'utilisateur')).toBeInTheDocument();
      });
    });

    it('renders for admin', async () => {
      renderWithProviders(
        <Routes>
          <Route path="/users/:id" element={<UserDetailPage />} />
        </Routes>,
        { route: '/users/user-1', authPreset: 'admin' },
      );
      await waitFor(() => {
        expect(screen.getByText('Modifier l\'utilisateur')).toBeInTheDocument();
      });
    });
  });
});
