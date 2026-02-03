import { type ReactElement, type PropsWithChildren } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { baseApi } from '@/shared/api/baseApi';
import { authReducer, type AuthUser } from '@/shared/state/authSlice';
import { uiReducer } from '@/shared/state/uiSlice';
import { lightTheme } from '@/styles/theme';

// ── Auth state presets for each RBAC role ──
const makeAuthState = (user: AuthUser) => ({
  accessToken: 'test-token',
  refreshToken: 'test-refresh',
  user,
  roles: user.roles,
  permissions: user.permissions,
  isAuthenticated: true,
});

export const AUTH_STATES = {
  super_admin: makeAuthState({
    _id: 'user-super-admin',
    email: 'superadmin@rhne-clone.ch',
    first_name: 'Super',
    last_name: 'Admin',
    preferred_language: 'fr',
    is_active: true,
    is_verified: true,
    roles: ['super_admin'],
    permissions: [
      'services.read', 'services.create', 'services.update', 'services.delete',
      'sites.read', 'sites.create', 'sites.update', 'sites.delete',
      'doctors.read', 'doctors.create', 'doctors.update', 'doctors.delete',
      'events.read', 'events.create', 'events.update', 'events.delete',
      'jobs.read', 'jobs.create', 'jobs.update', 'jobs.delete',
      'newborns.read', 'newborns.create', 'newborns.update', 'newborns.delete',
      'patient-info.read', 'patient-info.create', 'patient-info.update', 'patient-info.delete',
      'users.read', 'users.create', 'users.update', 'users.delete',
      'roles.read', 'roles.create', 'roles.update', 'roles.delete',
    ],
    site_id: null,
    avatar_url: null,
  }),
  admin: makeAuthState({
    _id: 'user-admin',
    email: 'admin@rhne-clone.ch',
    first_name: 'Admin',
    last_name: 'User',
    preferred_language: 'fr',
    is_active: true,
    is_verified: true,
    roles: ['admin'],
    permissions: [
      'services.read', 'services.create', 'services.update', 'services.delete',
      'sites.read', 'sites.create', 'sites.update', 'sites.delete',
      'doctors.read', 'doctors.create', 'doctors.update', 'doctors.delete',
      'events.read', 'events.create', 'events.update', 'events.delete',
      'jobs.read', 'jobs.create', 'jobs.update', 'jobs.delete',
      'newborns.read', 'newborns.create', 'newborns.update', 'newborns.delete',
      'patient-info.read', 'patient-info.create', 'patient-info.update', 'patient-info.delete',
      'users.read', 'users.create', 'users.update', 'users.delete',
    ],
    site_id: null,
    avatar_url: null,
  }),
  content_editor: makeAuthState({
    _id: 'user-editor',
    email: 'editor@rhne-clone.ch',
    first_name: 'Content',
    last_name: 'Editor',
    preferred_language: 'fr',
    is_active: true,
    is_verified: true,
    roles: ['content_editor'],
    permissions: [
      'services.read', 'services.create', 'services.update', 'services.delete',
      'events.read', 'events.create', 'events.update', 'events.delete',
      'patient-info.read', 'patient-info.create', 'patient-info.update', 'patient-info.delete',
    ],
    site_id: null,
    avatar_url: null,
  }),
  hr_manager: makeAuthState({
    _id: 'user-hr',
    email: 'hr@rhne-clone.ch',
    first_name: 'HR',
    last_name: 'Manager',
    preferred_language: 'fr',
    is_active: true,
    is_verified: true,
    roles: ['hr_manager'],
    permissions: ['jobs.read', 'jobs.create', 'jobs.update', 'jobs.delete'],
    site_id: null,
    avatar_url: null,
  }),
  site_manager: makeAuthState({
    _id: 'user-site-manager',
    email: 'pourtales.manager@rhne-clone.ch',
    first_name: 'Site',
    last_name: 'Manager',
    preferred_language: 'fr',
    is_active: true,
    is_verified: true,
    roles: ['site_manager'],
    permissions: ['sites.read', 'sites.update', 'doctors.read', 'doctors.create', 'doctors.update', 'doctors.delete'],
    site_id: 'site-1',
    avatar_url: null,
  }),
  unauthenticated: {
    accessToken: null,
    refreshToken: null,
    user: null,
    roles: [] as string[],
    permissions: [] as string[],
    isAuthenticated: false,
  },
};

// ── Store factory ──
export function createTestStore(authPreset: keyof typeof AUTH_STATES = 'super_admin') {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      auth: authReducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    preloadedState: {
      auth: AUTH_STATES[authPreset],
      ui: { language: 'fr' as const, sidebarOpen: true, themeMode: 'light' as const },
    },
  });
}

// ── Custom render ──
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authPreset?: keyof typeof AUTH_STATES;
  store?: EnhancedStore;
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    authPreset = 'super_admin',
    store = createTestStore(authPreset),
    route = '/',
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <I18nextProvider i18n={i18n}>
            <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
              <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
            </SnackbarProvider>
          </I18nextProvider>
        </ThemeProvider>
      </Provider>
    );
  }

  return {
    store,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

export { userEvent };
