import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  preferred_language: 'fr' | 'en' | 'de' | 'it';
  is_active: boolean;
  is_verified: boolean;
  roles: string[];
  permissions: string[];
  site_id: string | null;
  avatar_url: string | null;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  roles: string[];
  permissions: string[];
  isAuthenticated: boolean;
}

const loadTokens = () => {
  try {
    const accessToken = localStorage.getItem('rhne_access_token');
    const refreshToken = localStorage.getItem('rhne_refresh_token');
    const userStr = localStorage.getItem('rhne_user');
    const user = userStr ? (JSON.parse(userStr) as AuthUser) : null;
    return {
      accessToken,
      refreshToken,
      user,
      roles: user?.roles ?? [],
      permissions: user?.permissions ?? [],
      isAuthenticated: !!accessToken && !!user,
    };
  } catch {
    return {
      accessToken: null,
      refreshToken: null,
      user: null,
      roles: [] as string[],
      permissions: [] as string[],
      isAuthenticated: false,
    };
  }
};

const initialState: AuthState = loadTokens();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        user: AuthUser;
        tokens: { access_token: string; refresh_token: string };
      }>,
    ) {
      const { user, tokens } = action.payload;
      state.accessToken = tokens.access_token;
      state.refreshToken = tokens.refresh_token;
      state.user = user;
      state.roles = user.roles;
      state.permissions = user.permissions;
      state.isAuthenticated = true;

      localStorage.setItem('rhne_access_token', tokens.access_token);
      localStorage.setItem('rhne_refresh_token', tokens.refresh_token);
      localStorage.setItem('rhne_user', JSON.stringify(user));
    },
    setTokens(
      state,
      action: PayloadAction<{ access_token: string; refresh_token: string }>,
    ) {
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      localStorage.setItem('rhne_access_token', action.payload.access_token);
      localStorage.setItem('rhne_refresh_token', action.payload.refresh_token);
    },
    updateUser(state, action: PayloadAction<Partial<AuthUser>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (action.payload.roles) state.roles = action.payload.roles;
        if (action.payload.permissions) state.permissions = action.payload.permissions;
        localStorage.setItem('rhne_user', JSON.stringify(state.user));
      }
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.roles = [];
      state.permissions = [];
      state.isAuthenticated = false;

      localStorage.removeItem('rhne_access_token');
      localStorage.removeItem('rhne_refresh_token');
      localStorage.removeItem('rhne_user');
    },
  },
});

export const { setCredentials, setTokens, updateUser, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
