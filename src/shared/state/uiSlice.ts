import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SupportedLanguage } from '@/shared/types/common.types';

interface UiState {
  language: SupportedLanguage;
  sidebarOpen: boolean;
  themeMode: 'light' | 'dark';
}

const getInitialLanguage = (): SupportedLanguage => {
  const stored = localStorage.getItem('rhne_language');
  if (stored && ['fr', 'en', 'de', 'it'].includes(stored)) {
    return stored as SupportedLanguage;
  }
  return (import.meta.env.VITE_DEFAULT_LANGUAGE as SupportedLanguage) || 'fr';
};

const getInitialTheme = (): 'light' | 'dark' => {
  const stored = localStorage.getItem('rhne_theme');
  if (stored === 'dark') return 'dark';
  return 'light';
};

const initialState: UiState = {
  language: getInitialLanguage(),
  sidebarOpen: true,
  themeMode: getInitialTheme(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<SupportedLanguage>) {
      state.language = action.payload;
      localStorage.setItem('rhne_language', action.payload);
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleTheme(state) {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('rhne_theme', state.themeMode);
    },
    setThemeMode(state, action: PayloadAction<'light' | 'dark'>) {
      state.themeMode = action.payload;
      localStorage.setItem('rhne_theme', action.payload);
    },
  },
});

export const { setLanguage, toggleSidebar, setSidebarOpen, toggleTheme, setThemeMode } =
  uiSlice.actions;
export const uiReducer = uiSlice.reducer;
