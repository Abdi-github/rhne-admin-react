export interface TranslatedField {
  fr: string;
  en: string;
  de: string;
  it: string;
}

export type SupportedLanguage = 'fr' | 'en' | 'de' | 'it';

export const LANGUAGES: SupportedLanguage[] = ['fr', 'en', 'de', 'it'];

export type UserRole = 'super_admin' | 'admin' | 'content_editor' | 'hr_manager' | 'site_manager';
